import { readdir, readFile, lstat } from 'node:fs/promises';
import { resolve, join, extname, basename } from 'node:path';
import { extractConfiguredReceipt } from '../../app/lib/receipts/extraction.ts';
import { MAX_RECEIPT_BYTES, uploadInput, validateUpload } from '../../app/lib/receipts/upload.ts';
import { RECEIPT_CATEGORIES } from '../../app/lib/receipts/prompt.ts';
import { ITEM_ROLES, RECEIPT_TYPES } from '../../app/lib/receipts/intelligence-types.ts';
const receiptFields = ['merchant','purchaseDate','subtotalMinor','taxMinor','totalMinor','currency','receiptType'];
const itemFields = ['rawDescription','normalizedName','unitPriceMinor','totalPriceMinor','quantity','category','itemRole','isHouseholdAsset'];
const own = (object,key) => Object.hasOwn(object,key);
const canonical = text => String(text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const rawCanonical = text => String(text).toLowerCase().replace(/\s+/g,' ').trim();
// Alignment ignores explicitly printed currency-price suffixes and quantity prefixes; capture still compares literal description text.
export function alignmentDescription(text) {
  return String(text).replace(/^\s*[0-9]+(?:\.[0-9]+)?\s*[xX]\s+/, '').replace(/\s+(?:@\s*)?-?\$-?[0-9]+(?:\.[0-9]{2})?\s*$/, '').trim();
}
export function nameSimilarity(a,b) {
  const left=canonical(a), right=canonical(b);
  if (left===right) return 1;
  if (!left || !right) return 0;
  let row=Array.from({length:right.length+1},(_,i)=>i);
  for(let i=1;i<=left.length;i++) {
    const next=[i];
    for(let j=1;j<=right.length;j++) next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(left[i-1]===right[j-1]?0:1));
    row=next;
  }
  return 1-row[right.length]/Math.max(left.length,right.length);
}
export function validateExpected(value) {
  if (!value || typeof value!=='object' || Array.isArray(value) || !Object.keys(value).length) throw new Error('Expected JSON must be a partial receipt object.');
  const validateFields=(object,allowed,item=false)=>{
    if (!object || typeof object!=='object' || Array.isArray(object) || Object.keys(object).some(key=>!allowed.includes(key))) throw new Error('Expected JSON contains an unknown field or invalid object.');
    for(const [key,val] of Object.entries(object)) {
      if(key==='items') continue;
      if(key==='acceptableNames') { if(!Array.isArray(val)||!val.length||val.length>10||val.some(name=>typeof name!=='string'||!name.trim()||name.length>500)) throw new Error('acceptableNames must be 1–10 nonempty strings.'); continue; }
      if(key.endsWith('Minor')) { if(val!==null&&(!Number.isSafeInteger(val)||Math.abs(val)>1e9)) throw new Error('Expected money must be integer minor units or null.'); }
      else if(key==='quantity') { if(typeof val!=='number'||!Number.isFinite(val)||val<=0||val>100000) throw new Error('Expected quantity must be positive.'); }
      else if(key==='isHouseholdAsset') { if(typeof val!=='boolean') throw new Error('Expected asset classification must be boolean.'); }
      else if(key==='receiptType') { if(!RECEIPT_TYPES.includes(val)) throw new Error('Invalid expected receipt type.'); }
      else if(key==='itemRole') { if(!ITEM_ROLES.includes(val)) throw new Error('Invalid expected item role.'); }
      else if(key==='category') { if(val!==null&&!RECEIPT_CATEGORIES.includes(val)) throw new Error('Invalid expected category.'); }
      else if(val!==null&&(typeof val!=='string'||val.length>500)) throw new Error('Expected text must be a bounded string or null.');
      if(key==='purchaseDate'&&val!==null&&(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(val)||!Number.isFinite(Date.parse(val))||new Date(val).toISOString().slice(0,10)!==val)) throw new Error('Expected date must be a real ISO date.');
      if(key==='currency'&&val!=='USD') throw new Error('Expected currency must be USD.');
    }
    if(item&&(!own(object,'rawDescription')||typeof object.rawDescription!=='string'||!object.rawDescription.trim())) throw new Error('Each expected item requires rawDescription for alignment.');
    if(item&&own(object,'acceptableNames')&&!own(object,'normalizedName')) throw new Error('acceptableNames requires normalizedName.');
  };
  validateFields(value,[...receiptFields,'items']);
  if(own(value,'items')) {
    if(!Array.isArray(value.items)||value.items.length>100) throw new Error('Expected items must be an array of at most 100 lines.');
    value.items.forEach(item=>validateFields(item,[...itemFields,'acceptableNames'],true));
  }
  return value;
}
export function compareReceipt(actual,expected) {
  validateExpected(expected);
  const metrics={};
  const record=(key,pass)=>{ const metric=metrics[key]??={passed:0,failed:0,total:0}; metric.total++; if(pass) metric.passed++; else metric.failed++; return pass?'PASS':'FAIL'; };
  const fields={};
  for(const key of receiptFields) if(own(expected,key)) {
    const got=actual?.[key], want=expected[key];
    const pass=actual!==undefined&&(key==='merchant'&&typeof got==='string'&&typeof want==='string'?canonical(got)===canonical(want):got===want);
    fields[key]={status:record(key,pass),expected:want,actual:got??null};
  }
  const itemComparisons=[]; const used=new Set();
  if(own(expected,'items')) {
    fields.itemCount={status:record('itemCount',actual!==undefined&&actual.items.length===expected.items.length),expected:expected.items.length,actual:actual?.items.length??0};
    // One-to-one greedy raw-description alignment, threshold .85; ties prefer equal line price, then original order.
    for(const [expectedIndex,want] of expected.items.entries()) {
      const candidates=(actual?.items??[]).map((item,index)=>({item,index,similarity:nameSimilarity(alignmentDescription(item.rawDescription),alignmentDescription(want.rawDescription))})).filter(candidate=>!used.has(candidate.index)&&candidate.similarity>=.85).sort((a,b)=>b.similarity-a.similarity || Number(b.item.totalPriceMinor===want.totalPriceMinor)-Number(a.item.totalPriceMinor===want.totalPriceMinor) || a.index-b.index);
      const match=candidates[0]; if(match) used.add(match.index);
      const checks={}; record('itemCapture',Boolean(match));
      for(const key of itemFields) if(own(want,key)) {
        const got=match?.item[key], target=want[key]; let pass=Boolean(match)&&got===target;
        if(match&&key==='rawDescription') pass=rawCanonical(got)===rawCanonical(target);
        if(match&&key==='normalizedName'&&typeof got==='string'&&typeof target==='string') pass=[target,...(want.acceptableNames??[])].some(name=>nameSimilarity(got,name)>=.85);
        checks[key]={status:record(key,pass),expected:target,actual:got??null};
      }
      itemComparisons.push({expectedIndex,actualIndex:match?.index??null,alignmentSimilarity:match?.similarity??null,checks});
    }
  }
  return {fields,items:itemComparisons,extraActualItemIndexes:own(expected,'items')?(actual?.items??[]).map((_,i)=>i).filter(i=>!used.has(i)):[],metrics};
}
export function aggregateEvaluations(results) {
  const metrics={};
  for(const result of results) for(const [key,value] of Object.entries(result.comparison?.metrics??{})) {
    const target=metrics[key]??={passed:0,failed:0,total:0};for(const field of ['passed','failed','total']) target[field]+=value[field];
  }
  const durations=results.filter(result=>result.durationMs!==null).map(result=>result.durationMs).sort((a,b)=>a-b);
  return {receiptCount:results.length,extracted:results.filter(result=>result.receipt).length,errors:results.filter(result=>result.error).length,withExpectations:results.filter(result=>result.comparison).length,warningCount:results.reduce((sum,result)=>sum+(result.quality?.warnings.length??0),0),durationMs:{total:durations.reduce((a,b)=>a+b,0),median:durations.length?(durations[Math.floor((durations.length-1)/2)]+durations[Math.floor(durations.length/2)])/2:null},metrics};
}
export async function evaluateDirectory(directory,{env=process.env,extract=extractConfiguredReceipt,onResult=()=>{}}={}) {
  const root=resolve(directory), entries=await readdir(root,{withFileTypes:true});
  const images=entries.filter(entry=>entry.isFile()&&/\.(jpe?g|png)$/i.test(entry.name)).map(entry=>entry.name).sort();
  if(!images.length) throw new Error('No JPG/JPEG/PNG receipts found in this directory (top level only).');
  const results=[];
  for(const name of images) {
    const result={file:name,durationMs:null,receipt:null,quality:null,comparison:null,error:null};let input;
    let expected;
    try {
      const expectedPath=join(root,basename(name,extname(name))+'.expected.json');
      try {
        const info=await lstat(expectedPath);
        if(!info.isFile()||info.isSymbolicLink()||info.size>1024*1024) throw new Error('Expected sidecar must be a regular JSON file under 1 MiB.');
        expected=validateExpected(JSON.parse(await readFile(expectedPath,'utf8')));
      } catch(error) { if(error.code!=='ENOENT') throw error; }
      const imagePath=join(root,name),info=await lstat(imagePath);
      if(!info.isFile()||info.isSymbolicLink()) throw new Error('Receipt must be a regular local file.');
      const type=/\.png$/i.test(name)?'image/png':'image/jpeg';
      const problem=validateUpload({name,type,size:info.size});if(problem) throw new Error(problem);
      if(info.size>MAX_RECEIPT_BYTES) throw new Error('Receipt exceeds the 8 MiB limit.');
      input=uploadInput(new Uint8Array(await readFile(imagePath)),type);
      const started=performance.now();
      try {
        const extracted=await extract(input,{env});result.receipt=extracted.receipt;result.quality=extracted.quality;
      } finally {result.durationMs=Math.round(performance.now()-started);}
    } catch(error) { result.error=error instanceof SyntaxError?'Expected JSON is malformed.':error.message??'Receipt evaluation failed.'; }
    finally {if(input?.content.kind==='file') input.content.bytes=new Uint8Array();}
    if(expected) result.comparison=compareReceipt(result.receipt??undefined,expected);
    results.push(result);await onResult(result);
  }
  return {results,summary:aggregateEvaluations(results)};
}
