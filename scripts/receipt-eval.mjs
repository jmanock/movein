import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { loadNextEnvironment } from './lib/next-env.mjs';
import { receiptExtractorConfig } from '../app/lib/receipts/config.ts';
import { evaluateDirectory } from './lib/receipt-evaluation.mjs';
process.env.NODE_ENV ??= 'development';
loadNextEnvironment(process.cwd());
try {
  if(process.env.NODE_ENV!=='development') throw new Error('receipt:eval is available only in development.');
  const args=process.argv.slice(2);const directory=args.shift();let reportPath;
  if(args.length===2&&args[0]==='--report') reportPath=resolve(args[1]);
  else if(args.length) throw new Error('Usage: npm run receipt:eval -- ./receipt-lab [--report ./receipt-eval-reports/run.json]');
  if(!directory) throw new Error('Usage: npm run receipt:eval -- ./receipt-lab [--report ./receipt-eval-reports/run.json]');
  const config=receiptExtractorConfig();if(config.provider!=='ollama') throw new Error('receipt:eval requires RECEIPT_EXTRACTOR=ollama; no demo evaluation.');
  console.log(`Provider: ollama | Model: ${config.model} | Prompt: ${config.promptVersion}`);
  const evaluation=await evaluateDirectory(directory,{onResult(result){
    console.log(`\n${result.file}: ${result.error?'ERROR '+result.error:'extracted'} | ${result.durationMs??'—'} ms | ${result.quality?.warnings.length??0} warnings`);
    if(result.comparison) {
      for(const [key,value] of Object.entries(result.comparison.metrics)) console.log(`  ${key}: ${value.passed}/${value.total}${value.failed?' (FAIL)':' (PASS)'}`);
    }
    if(result.receipt) console.log(JSON.stringify(result.receipt,null,2));
    for(const warning of result.quality?.warnings??[]) console.log(`  Warning ${warning.code}${warning.itemIndex===undefined?'':` (line ${warning.itemIndex+1})`}: ${warning.message}`);
  }});
  const report={timestamp:new Date().toISOString(),provider:'ollama',model:config.model,promptVersion:config.promptVersion,comparisonPolicy:{alignment:'currency price suffix/quantity prefix removed for alignment only; raw description similarity >= 0.85; one-to-one, price tie-break, stable order',rawDescription:'case/whitespace folded exact',normalizedName:'case/punctuation folded edit similarity >= 0.85 or acceptableNames',merchant:'case/punctuation folded exact',otherFields:'exact; absent expected fields not measured'},...evaluation};
  console.log('\nAggregate (field metrics, no overall AI score):');console.log(JSON.stringify(report.summary,null,2));
  if(reportPath) {await mkdir(dirname(reportPath),{recursive:true});await writeFile(reportPath,JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});console.log(`Report: ${reportPath}`);}
  if(report.summary.errors||Object.values(report.summary.metrics).some(metric=>metric.failed)) process.exitCode=1;
} catch(error) {console.error(error.message??'Evaluation failed.');process.exitCode=1;}
