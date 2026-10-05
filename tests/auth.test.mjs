import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import { createMoveInAuth } from '../app/lib/auth/server.ts';
import { authConfig } from '../app/lib/auth/config.ts';
import { authEmailSender } from '../app/lib/auth/email.ts';
import { getCurrentHousehold } from '../app/lib/households/current.ts';
import { ensureUserHousehold } from '../app/lib/auth/membership.ts';
import { signInDestination } from '../app/lib/auth/destination.ts';
import { createReceiptRepository } from '../app/lib/receipts/persistence.ts';
import { GET as authGet, POST as authPost } from '../app/api/auth/[...all]/route.ts';
import { GET as getInventory } from '../app/api/my-home/route.ts';
import { POST as saveReview } from '../app/api/receipts/save/route.ts';
import { DEVELOPMENT_HOUSEHOLD_ID } from '../app/lib/households/constants.ts';
const origin='https://movein.example';
const environment={DATABASE_PATH:'/tmp/movein-isolated-auth-test.sqlite',NODE_ENV:'production',BETTER_AUTH_SECRET:'a-secure-test-secret-with-more-than-32-characters',BETTER_AUTH_URL:origin,AUTH_EMAIL_MODE:'smtp',AUTH_SMTP_HOST:'smtp.example',AUTH_SMTP_PORT:'587',AUTH_SMTP_USER:'test',AUTH_SMTP_PASS:'test',AUTH_EMAIL_FROM:'MoveIn <signin@movein.example>',AUTH_DEV_HOUSEHOLD:'true'};
async function fixture() {
  const db=new Database(':memory:');db.pragma('foreign_keys=ON');
  for(const name of ['007_receipts_and_inventory.sql','008_receipt_save_requests.sql','009_receipt_intelligence.sql','010_household_ownership.sql','011_authentication.sql']) db.exec(await readFile(new URL('../db/migrations/'+name,import.meta.url),'utf8'));
  const sent=[];const auth=createMoveInAuth(db,authConfig(environment),async message=>{sent.push(message);});
  const call=(path,{method='GET',body,cookie,ip='192.0.2.1',requestOrigin=origin}={})=>auth.handler(new Request(origin+'/api/auth'+path,{method,headers:{origin:requestOrigin,'x-real-ip':ip,...(body?{'content-type':'application/json'}:{}),...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})}));
  async function login(email,ip='192.0.2.1') {
    const response=await call('/sign-in/magic-link',{method:'POST',body:{email,callbackURL:'/my-home',errorCallbackURL:'/sign-in?next=%2Fmy-home'},ip});assert.equal(response.status,200);
    const url=new URL(sent.at(-1).url);const verified=await call(url.pathname.slice('/api/auth'.length)+url.search,{ip});assert.equal(verified.status,302);
    assert.equal(verified.headers.get('location'),origin+'/my-home');
    const cookies=verified.headers.getSetCookie();assert.ok(cookies.some(value=>value.includes('HttpOnly')&&value.includes('Secure')&&value.includes('SameSite=Lax')));
    const cookie=cookies.map(value=>value.split(';')[0]).join('; ');
    const session=await auth.api.getSession({headers:new Headers({cookie})});assert.ok(session?.user.emailVerified);
    return {url,cookie,user:session.user};
  }
  return{db,auth,sent,call,login};
}
function withEnvironment() {const old={};for(const[key,value]of Object.entries(environment)){old[key]=process.env[key];process.env[key]=value;}return()=>{for(const[key,value]of Object.entries(old))if(value===undefined)delete process.env[key];else process.env[key]=value;};}

test('real verified sessions provision one private household, isolate A/B, ignore forged IDs, reject CSRF, and revoke on logout',async()=>{
  const f=await fixture(),restore=withEnvironment(), previousDb=globalThis.moveInDatabase;
  globalThis.moveInDatabase=f.db;
  try {
    assert.equal(await getCurrentHousehold(new Request(origin+'/api/my-home',{headers:{cookie:'session=forged','x-user-id':'fake','x-household-id':DEVELOPMENT_HOUSEHOLD_ID}}),f.db),null);
    const a=await f.login('a@example.com'),b=await f.login('b@example.com','192.0.2.2');
    const req=(cookie,extras={})=>new Request(origin+'/api/my-home?householdId='+DEVELOPMENT_HOUSEHOLD_ID,{headers:{cookie,...extras}});
    const ca=await getCurrentHousehold(req(a.cookie,{'x-user-id':b.user.id,'x-household-id':DEVELOPMENT_HOUSEHOLD_ID}),f.db),cb=await getCurrentHousehold(req(b.cookie),f.db);
    assert.equal(ca.access,'authenticated');assert.notEqual(ca.householdId,cb.householdId);assert.notEqual(ca.householdId,DEVELOPMENT_HOUSEHOLD_ID);
    assert.equal(f.db.prepare('SELECT count(*) n FROM household_memberships').get().n,2);
    const again=await f.login('a@example.com');assert.equal(again.user.id,a.user.id);
    assert.equal(ensureUserHousehold(f.db,a.user.id),ca.householdId);assert.equal(f.db.prepare('SELECT count(*) n FROM households').get().n,3);
    const sample={merchant:'A private store',purchaseDate:'2026-10-04',subtotalMinor:10000,taxMinor:700,totalMinor:10700,currency:'USD',extractionConfidence:null,receiptType:'purchase',items:[{rawDescription:'DRILL',normalizedName:'Drill',quantity:1,unitPriceMinor:10000,totalPriceMinor:10000,category:'Tools',isHouseholdAsset:true,assetReason:'Durable purchase',itemRole:'durable_asset'}]};
    const ra=createReceiptRepository(f.db,ca.householdId),rb=createReceiptRepository(f.db,cb.householdId),saved=ra.saveReviewed(sample,[0],randomUUID());
    assert.equal(rb.get(saved.receipt.id),null);assert.deepEqual(rb.listHistory(),[]);assert.deepEqual(rb.listInventory(),[]);assert.equal(ra.listInventory().length,1);
    const aResponse=await getInventory(req(a.cookie,{'x-user-id':b.user.id,'x-household-id':cb.householdId}));assert.equal(aResponse.status,200);assert.equal((await aResponse.json()).items.length,1);
    const bResponse=await getInventory(req(b.cookie,{'x-household-id':ca.householdId}));assert.equal(bResponse.status,200);assert.deepEqual((await bResponse.json()).items,[]);
    const forgedSave=await saveReview(new Request(origin+'/api/receipts/save',{method:'POST',headers:{cookie:a.cookie,origin,'content-type':'application/json'},body:JSON.stringify({receipt:sample,selected:[0],requestId:randomUUID(),householdId:cb.householdId,userId:b.user.id})}));assert.equal(forgedSave.status,400);
    assert.equal((await getInventory(req('session=forged'))).status,401);
    assert.equal(await getCurrentHousehold(new Request(origin+'/api/receipts/save',{method:'POST',headers:{cookie:a.cookie,origin:'https://evil.example'}}),f.db),null);
    assert.equal(await getCurrentHousehold(new Request(origin+'/api/receipts/save',{method:'POST',headers:{cookie:a.cookie}}),f.db),null);
    const logout=await f.call('/sign-out',{method:'POST',cookie:a.cookie});assert.equal(logout.status,200);
    assert.equal(await getCurrentHousehold(req(a.cookie),f.db),null);
    assert.ok(await getCurrentHousehold(req(again.cookie),f.db));
    assert.deepEqual(f.db.pragma('foreign_key_check'),[]);
  }finally{globalThis.moveInDatabase=previousDb;restore();f.db.close();}
});

test('magic links are hashed, single use, expired/invalid rejected, invalid email and untrusted callbacks rejected',async()=>{
  const f=await fixture();
  try{
    const a=await f.login('single@example.com');
    assert.equal(f.db.prepare('SELECT count(*) n FROM auth_verification').get().n,0);
    const reused=await f.call(a.url.pathname.slice('/api/auth'.length)+a.url.search);assert.equal(reused.status,302);assert.ok(reused.headers.get('location').includes('error='));assert.equal(reused.headers.getSetCookie().length,0);
    await f.call('/sign-in/magic-link',{method:'POST',body:{email:'expired@example.com',callbackURL:'/my-home',errorCallbackURL:'/sign-in'}});
    const pending=new URL(f.sent.at(-1).url),row=f.db.prepare('SELECT identifier FROM auth_verification').get();assert.notEqual(row.identifier,pending.searchParams.get('token'));
    f.db.prepare('UPDATE auth_verification SET expiresAt=0').run();
    const expired=await f.call(pending.pathname.slice('/api/auth'.length)+pending.search);assert.ok(expired.headers.get('location').includes('error='));assert.equal(expired.headers.getSetCookie().length,0);
    const invalid=await f.call('/magic-link/verify?token=invalid&errorCallbackURL=%2Fsign-in');assert.ok(invalid.headers.get('location').includes('error='));
    assert.equal((await f.call('/sign-in/magic-link',{method:'POST',body:{email:'invalid'}})).status,400);
    assert.equal((await f.call('/sign-in/magic-link',{method:'POST',body:{email:'valid@example.com',callbackURL:'https://evil.example'}})).status,403);
    assert.equal(signInDestination('https://evil.example'),'/my-home');assert.equal(signInDestination('/receipts'),'/receipts');
  }finally{f.db.close();}
});

test('built-in database limiter bounds magic-link email requests to five per minute per IP',async()=>{
  const f=await fixture();try{for(let i=0;i<5;i++)assert.equal((await f.call('/sign-in/magic-link',{method:'POST',body:{email:'rate@example.com'}})).status,200);assert.equal((await f.call('/sign-in/magic-link',{method:'POST',body:{email:'rate@example.com'}})).status,429);assert.equal(f.sent.length,5);}finally{f.db.close();}
});

test('production missing mail config and development console fallback always fail closed',async()=>{
  assert.throws(()=>authConfig({...environment,AUTH_EMAIL_MODE:'console',AUTH_DEV_LOG_MAGIC_LINKS:'true'}),/opt-in/);
  for(const key of ['BETTER_AUTH_SECRET','BETTER_AUTH_URL','AUTH_SMTP_HOST','AUTH_SMTP_PORT','AUTH_SMTP_USER','AUTH_SMTP_PASS','AUTH_EMAIL_FROM'])assert.throws(()=>authConfig({...environment,[key]:''}));
  assert.throws(()=>authEmailSender({secret:'x'.repeat(32),origin,production:true,emailMode:'console'}),/production/);
  const restore=withEnvironment();try{delete process.env.AUTH_EMAIL_FROM;assert.equal(await getCurrentHousehold(new Request(origin+'/api/my-home'),new Proxy({}, {get(){throw new Error('must not query DB')}})),null);}finally{restore();}
});


test('App Router auth boundary fails clearly without production mail, recovers failed verification, and excludes password endpoints',async()=>{
  const f=await fixture(),restore=withEnvironment(),previousDb=globalThis.moveInDatabase;
  globalThis.moveInDatabase=f.db;
  try {
    delete process.env.AUTH_EMAIL_FROM;
    const response=await authPost(new Request(origin+'/api/auth/sign-in/magic-link',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({email:'test@example.com'})}));
    assert.equal(response.status,503);assert.equal(response.headers.get('cache-control'),'no-store');assert.deepEqual(Object.keys(await response.json()),['error']);
    const verification=await authGet(new Request(origin+'/api/auth/magic-link/verify?token=invalid&callbackURL=%2Freceipts'));
    assert.equal(verification.status,303);assert.equal(verification.headers.get('location'),'/sign-in?next=%2Freceipts&error=VERIFICATION_FAILED');
    assert.equal((await authPost(new Request(origin+'/api/auth/sign-up/email',{method:'POST'}))).status,404);
    assert.equal(f.db.prepare('SELECT count(*) n FROM auth_user').get().n,0);
  } finally {globalThis.moveInDatabase=previousDb;restore();f.db.close();}
});
