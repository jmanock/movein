import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import { createMoveInAuth } from '../app/lib/auth/server.ts';
import { authConfig } from '../app/lib/auth/config.ts';
import { provisionUser, resetUserPassword, listUsers } from '../scripts/lib/operator-users.mjs';
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
  const auth=createMoveInAuth(db,authConfig(environment));
  const call=(path,{method='GET',body,cookie,ip='192.0.2.1',requestOrigin=origin}={})=>auth.handler(new Request(origin+'/api/auth'+path,{method,headers:{origin:requestOrigin,'x-real-ip':ip,...(body?{'content-type':'application/json'}:{}),...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})}));
  async function login(email,ip='192.0.2.1') {
    await provisionUser(db,authConfig(environment),email,'initial-password-for-test');
    const verified=await call('/sign-in/email',{method:'POST',body:{email,password:'initial-password-for-test'},ip});assert.equal(verified.status,200);
    const cookies=verified.headers.getSetCookie();assert.ok(cookies.some(value=>value.includes('HttpOnly')&&value.includes('Secure')&&value.includes('SameSite=Lax')));
    const cookie=cookies.map(value=>value.split(';')[0]).join('; ');
    const session=await auth.api.getSession({headers:new Headers({cookie})});assert.ok(session?.user.emailVerified);
    return {cookie,user:session.user};
  }
  return{db,auth,call,login};
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

test('operator provisioning is idempotent, uses library hashes, makes one household and no session or email',async()=>{
  const f=await fixture();try{
    const first=await provisionUser(f.db,authConfig(environment),'Approved@Example.com','initial-password-for-test');
    assert.equal(first.created,true);
    const again=await provisionUser(f.db,authConfig(environment),'approved@example.com','unused-retry-password');
    assert.equal(again.created,false);assert.equal(first.householdId,again.householdId);
    assert.equal(f.db.prepare('SELECT count(*) n FROM household_memberships').get().n,1);
    assert.equal(f.db.prepare('SELECT count(*) n FROM households WHERE id != ?').get(DEVELOPMENT_HOUSEHOLD_ID).n,1);
    assert.equal(f.db.prepare('SELECT count(*) n FROM auth_session').get().n,0);
    assert.equal(f.db.prepare('SELECT count(*) n FROM auth_verification').get().n,0);
    assert.notEqual(f.db.prepare('SELECT password FROM auth_account').get().password,'initial-password-for-test');
    assert.deepEqual(Object.keys(listUsers(f.db)[0]),['email','created','household','state']);
    assert.equal((await f.call('/sign-in/email',{method:'POST',body:{email:'approved@example.com',password:'initial-password-for-test'}})).status,200);
    await assert.rejects(provisionUser(f.db,authConfig(environment),'weak@example.com','short'));
    assert.equal(f.db.prepare('SELECT count(*) n FROM auth_user').get().n,1);
  }finally{f.db.close();}
});

test('unknown users and incorrect passwords fail identically, no signup even in Better Auth, no magic links',async()=>{
  const f=await fixture();try{
    await provisionUser(f.db,authConfig(environment),'known@example.com','initial-password-for-test');
    const unknown=await f.call('/sign-in/email',{method:'POST',body:{email:'unknown@example.com',password:'initial-password-for-test'}});
    const wrong=await f.call('/sign-in/email',{method:'POST',body:{email:'known@example.com',password:'incorrect-password'}});
    assert.equal(unknown.status,401);assert.equal(wrong.status,401);assert.deepEqual(await unknown.json(),await wrong.json());
    assert.equal((await f.call('/sign-up/email',{method:'POST',body:{email:'arbitrary@example.com',name:'Visitor',password:'initial-password-for-test'}})).status,400);
    assert.equal((await f.call('/sign-in/magic-link',{method:'POST',body:{email:'arbitrary@example.com'}})).status,404);
    assert.equal(f.db.prepare('SELECT count(*) n FROM auth_user').get().n,1);
    assert.equal((await f.call('/sign-in/email',{method:'POST',body:{email:'known@example.com',password:'initial-password-for-test'},requestOrigin:'https://evil.example'})).status,403);
    assert.equal(signInDestination('https://evil.example'),'/my-home');assert.equal(signInDestination('/receipts'),'/receipts');
  }finally{f.db.close();}
});

test('database limiter bounds password login attempts to five per minute per IP',async()=>{
  const f=await fixture();try{
    for(let i=0;i<5;i++)assert.equal((await f.call('/sign-in/email',{method:'POST',body:{email:'unknown@example.com',password:'incorrect-password'}})).status,401);
    assert.equal((await f.call('/sign-in/email',{method:'POST',body:{email:'unknown@example.com',password:'incorrect-password'}})).status,429);
  }finally{f.db.close();}
});

test('operator password reset revokes all sessions, consumes token, preserves household and changes login',async()=>{
  const f=await fixture();try{
    const first=await f.login('reset@example.com');const second=await f.login('reset@example.com','192.0.2.2');
    const household=ensureUserHousehold(f.db,first.user.id);
    await resetUserPassword(f.db,authConfig(environment),'reset@example.com','new-password-for-test');
    for(const account of [first,second])assert.equal(await f.auth.api.getSession({headers:new Headers({cookie:account.cookie})}),null);
    assert.equal((await f.call('/sign-in/email',{method:'POST',body:{email:'reset@example.com',password:'initial-password-for-test'},ip:'192.0.2.3'})).status,401);
    assert.equal((await f.call('/sign-in/email',{method:'POST',body:{email:'reset@example.com',password:'new-password-for-test'},ip:'192.0.2.3'})).status,200);
    assert.equal(ensureUserHousehold(f.db,first.user.id),household);assert.equal(f.db.prepare('SELECT count(*) n FROM auth_verification').get().n,0);
    await assert.rejects(resetUserPassword(f.db,authConfig(environment),'missing@example.com','new-password-for-test'),/does not exist/);
  }finally{f.db.close();}
});

test('production needs no SMTP and disabled delivery cannot send',async()=>{
  const config=authConfig({NODE_ENV:'production',BETTER_AUTH_SECRET:environment.BETTER_AUTH_SECRET,BETTER_AUTH_URL:origin});
  assert.equal(config.emailMode,'disabled');
  assert.equal(authConfig({...environment,AUTH_EMAIL_MODE:'console',AUTH_DEV_LOG_MAGIC_LINKS:'true'}).emailMode,'disabled');
  for(const key of ['BETTER_AUTH_SECRET','BETTER_AUTH_URL'])assert.throws(()=>authConfig({...environment,[key]:''}));
  await assert.rejects(authEmailSender(config)({email:'test@example.com',url:'https://movein.example'}),/disabled/);
});

test('web boundary exposes existing-user login only; signup/reset/operator and magic-link APIs are unavailable',async()=>{
  const f=await fixture(),restore=withEnvironment(),previousDb=globalThis.moveInDatabase;
  globalThis.moveInDatabase=f.db;
  try {
    for(const path of ['/sign-up/email','/request-password-reset','/reset-password','/change-password','/admin/create-user','/sign-in/magic-link','/magic-link/verify']){
      const handler=path==='/magic-link/verify'?authGet:authPost;
      const response=await handler(new Request(origin+'/api/auth'+path,{method:handler===authGet?'GET':'POST'}));assert.equal(response.status,404,path);
    }
    await provisionUser(f.db,authConfig(environment),'boundary@example.com','initial-password-for-test');
    const request=(email,password)=>new Request(origin+'/api/auth/sign-in/email',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({email,password})});
    for(const email of ['boundary@example.com','missing@example.com']){
      const response=await authPost(request(email,'incorrect-password'));assert.equal(response.status,401);assert.deepEqual(await response.json(),{error:'Email or password is incorrect.'});assert.equal(response.headers.get('cache-control'),'no-store');
    }
    assert.equal((await authPost(request('boundary@example.com','initial-password-for-test'))).status,200);
    assert.equal(f.db.prepare('SELECT count(*) n FROM auth_user').get().n,1);
    delete process.env.BETTER_AUTH_SECRET;assert.equal((await authPost(request('boundary@example.com','initial-password-for-test'))).status,503);
  } finally {globalThis.moveInDatabase=previousDb;restore();f.db.close();}
});

test('operator CLI rejects credential arguments and non-interactive password entry without leaking input',()=>{
  const secret='never-print-this-password';
  const argumentsRun=spawnSync(process.execPath,['scripts/operator-users.mjs','create','test@example.com',secret],{encoding:'utf8'});
  assert.equal(argumentsRun.status,1);assert.ok(!`${argumentsRun.stdout}${argumentsRun.stderr}`.includes(secret));
  const piped=spawnSync(process.execPath,['scripts/operator-users.mjs','create'],{input:`test@example.com\n${secret}\n`,encoding:'utf8'});
  assert.equal(piped.status,1);assert.match(piped.stderr,/Interactive terminal required/);assert.ok(!`${piped.stdout}${piped.stderr}`.includes(secret));
});
