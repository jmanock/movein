import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
const files=[];
async function collect(path){for(const e of await readdir(path,{withFileTypes:true})){const p=path+'/'+e.name;if(e.isDirectory())await collect(p);else if(/\.(tsx?|mjs|cjs|md|sql)$/.test(p))files.push(p);}}
for(const dir of ['app','db','scripts','docs'])await collect(dir);
files.push('.env.example','ecosystem.config.cjs','next.config.ts');
let failures=0;
const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\b(?:sk_live_|AKIA)[A-Za-z0-9]{16,}/,/NEXT_PUBLIC_[A-Z_]*(?:SECRET|PASSWORD|SMTP|DATABASE_PATH|AUTH_TOKEN)\b/];
for(const file of files){if(file==='scripts/secret-check.mjs')continue;const text=await readFile(file,'utf8');if(patterns.some(p=>p.test(text))){console.log(`FAIL suspicious secret pattern: ${file} (value redacted)`);failures++;}}
const envFiles=execFileSync('git',['ls-files','.env*'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
if(envFiles.some(f=>f!=='.env.example')){console.log('FAIL real environment file tracked (contents not printed)');failures++;}
const example=await readFile('.env.example','utf8');for(const name of ['BETTER_AUTH_SECRET','AUTH_SMTP_USER','AUTH_SMTP_PASS'])if(!new RegExp(`^${name}=$`,'m').test(example)){console.log(`FAIL ${name} must be blank in .env.example`);failures++;}
// Scan all reachable committed history as well; report only the commit/file, never a matching value.
const commits=execFileSync('git',['rev-list','--all'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
for(const commit of commits){try{const hit=execFileSync('git',['grep','-l','-E','(BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|sk_live_[A-Za-z0-9]{16,}|AKIA[A-Za-z0-9]{16,})',commit,'--','.'],{encoding:'utf8'}).trim();if(hit){console.log(`FAIL committed secret pattern: ${commit.slice(0,12)} (values redacted)`);failures++;}}catch(error){if(error.status!==1)throw error;}}
console.log(`Secret pattern audit: ${files.length} working-tree files and ${commits.length} commits; ${failures} findings. Heuristic scan, not a guarantee against every secret format.`);
if(failures)process.exitCode=1;
