import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'node:net';
import {setTimeout as delay} from 'node:timers/promises';

async function freePort(){return new Promise((resolve,reject)=>{const s=createServer();s.on('error',reject);s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});});}
class Client {
  constructor(base){this.base=base;this.cookie='';this.csrf='';}
  async call(path,method='GET',data=undefined){
    const headers={'Accept':'application/json'};if(data!==undefined)headers['Content-Type']='application/json';if(this.cookie)headers.Cookie=this.cookie;if(this.csrf&&method!=='GET')headers['X-CSRF-Token']=this.csrf;
    const r=await fetch(this.base+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data)});
    const cookie=r.headers.get('set-cookie');if(cookie)this.cookie=cookie.split(';')[0];
    const contentType=r.headers.get('content-type')||'';
    const body=contentType.includes('json')?await r.json():await r.text();if(body?.csrf)this.csrf=body.csrf;
    return {status:r.status,body,headers:r.headers};
  }
  async register(name,email,accountType='user'){const r=await this.call('/api/auth/register','POST',{name,email,password:'ExamplePass1234!',accountType});assert.equal(r.status,201,JSON.stringify(r.body));return r.body;}
}

test('flujo real: roles, empresas, reserva, visitas, puntos, canjes, seguridad y persistencia',async t=>{
  const dir=mkdtempSync(join(tmpdir(),'centro-ia-test-')),port=await freePort(),base=`http://127.0.0.1:${port}`;
  const proc=spawn(process.execPath,['server/index.mjs'],{cwd:new URL('../',import.meta.url).pathname,env:{...process.env,PORT:String(port),HOST:'127.0.0.1',DB_PATH:join(dir,'test.sqlite')},stdio:['ignore','pipe','pipe']});
  let err='';proc.stderr.on('data',x=>err+=x.toString());
  t.after(()=>{proc.kill();rmSync(dir,{recursive:true,force:true});});
  let ready=false;for(let i=0;i<50;i++){try{const r=await fetch(base+'/api/health');if(r.ok){ready=true;break;}}catch{}await delay(60);}
  assert.ok(ready,`Servidor no disponible. ${err}`);
  const owner=new Client(base),client=new Client(base),another=new Client(base),competitor=new Client(base),stranger=new Client(base);
  assert.equal((await client.call('/api/businesses')).status,200);
  await owner.register('Negocio Uno','dueno1@example.test','company');
  await client.register('Cliente Ana','ana@example.test','user');
  await another.register('Cliente Beto','beto@example.test','user');
  await competitor.register('Empresa Rival','rival@example.test','company');
  let r=await client.call('/api/businesses','POST',{name:'Negocio prohibido'});assert.equal(r.status,403,'Usuario no debe crear empresa');
  r=await owner.call('/api/businesses','POST',{name:'Café Bahía',category:'Cafetería',city:'Ensenada',address:'Centro'});assert.equal(r.status,200);const biz=r.body.id;
  r=await competitor.call('/api/businesses','POST',{name:'Rival',category:'Otro'});assert.equal(r.status,200);const otherBiz=r.body.id;
  r=await client.call(`/api/businesses/${biz}/customers`);assert.equal(r.status,403,'La tabla de clientes es privada');
  r=await competitor.call(`/api/businesses/${biz}/customers`);assert.equal(r.status,403,'Una empresa no ve a otra');
  r=await owner.call(`/api/businesses/${otherBiz}/overview`);assert.equal(r.status,403);
  r=await owner.call(`/api/businesses/${biz}/locations`);assert.equal(r.status,200);const loc=r.body[0].id;
  const date=new Date(Date.now()+4*86400000).toISOString().slice(0,10);
  r=await owner.call(`/api/businesses/${biz}/events`,'POST',{title:'Taller de café',date,time:'18:00',capacity:1,locationId:loc,priceCents:0});assert.equal(r.status,200,JSON.stringify(r.body));const event=r.body.id;
  r=await client.call(`/api/events/${event}/reservations`,'POST',{});assert.equal(r.status,200,JSON.stringify(r.body));const reservation=r.body.id;
  r=await client.call(`/api/events/${event}/reservations`,'POST',{});assert.equal(r.status,409,'No permitir doble reserva');
  r=await another.call(`/api/events/${event}/reservations`,'POST',{});assert.equal(r.status,409,'Cupo lleno');
  r=await competitor.call(`/api/reservations/${reservation}`,'PATCH',{status:'attended'});assert.equal(r.status,403,'No marcar asistencias ajenas');
  r=await owner.call(`/api/businesses/${biz}/visits`,'POST',{customerEmail:'ana@example.test',points:150,locationId:loc,note:'Visita inicial',idempotencyKey:'visit-001'});assert.equal(r.status,200,JSON.stringify(r.body));const vId=r.body.id;
  r=await owner.call(`/api/businesses/${biz}/visits`,'POST',{customerEmail:'ana@example.test',points:150,idempotencyKey:'visit-001'});assert.equal(r.status,200);assert.equal(r.body.id,vId);assert.equal(r.body.duplicate,true,'Visita idempotente');
  r=await client.call('/api/me/wallet');assert.equal(r.status,200);assert.equal(r.body[0].points,150);assert.equal(r.body[0].visits,1);
  r=await owner.call(`/api/businesses/${biz}/rewards`,'POST',{name:'Café de cortesía',cost:100,stock:1});assert.equal(r.status,200);const reward=r.body.id;
  r=await client.call(`/api/rewards/${reward}/redeem`,'POST',{});assert.equal(r.status,200);assert.equal(r.body.pointsRemaining,50);
  r=await client.call(`/api/rewards/${reward}/redeem`,'POST',{});assert.equal(r.status,409,'El canje no debe repetirse si se agota el stock');
  r=await client.call('/api/me/wallet');assert.equal(r.body[0].points,50);
  r=await client.call('/api/me/ledger');assert.equal(r.body.length,2);assert.deepEqual(r.body.map(x=>x.delta).sort((a,b)=>a-b),[-100,150]);
  r=await owner.call(`/api/businesses/${biz}/overview`);assert.equal(r.status,200);assert.equal(r.body.stats.members,1);assert.equal(r.body.stats.visits,1);assert.equal(r.body.stats.redemptions,1);assert.equal(r.body.stats.reservations,1);assert.equal(r.body.stats.revenue,null);
  r=await owner.call(`/api/businesses/${biz}/visits`);assert.equal(r.status,200);assert.equal(r.body.length,1);
  r=await owner.call(`/api/businesses/${biz}/campaigns`,'POST',{title:'Regresa',message:'Te esperamos',channel:'Correo'});assert.equal(r.status,200);assert.equal(r.body.status,'draft');
  r=await owner.call(`/api/businesses/${biz}/export.csv`);assert.equal(r.status,200);assert.match(r.body,/ana@example.test/);
  r=await client.call(`/api/reservations/${reservation}`,'PATCH',{status:'cancelled'});assert.equal(r.status,200);
  r=await another.call(`/api/events/${event}/reservations`,'POST',{});assert.equal(r.status,200,'Se libera el cupo al cancelar');
  r=await client.call('/api/me/reservations');assert.equal(r.body[0].status,'cancelled');
  r=await owner.call(`/api/businesses/${biz}/insights`);assert.equal(r.status,200);assert.equal(r.body.usesExternalAI,false);
  r=await client.call('/api/me/export');assert.equal(r.status,200);assert.equal(r.body.visits.length,1);
  r=await client.call('/api/me/visit-code','POST',{});assert.equal(r.status,200,JSON.stringify(r.body));
  assert.match(r.body.code,/^CIA-[A-HJ-NP-Z2-9]{16}$/);assert.ok(r.body.qrImage.startsWith('data:image/svg+xml;base64,'));
  const code=r.body.code;
  r=await competitor.call(`/api/businesses/${biz}/checkin`,'POST',{code,points:25});assert.equal(r.status,403,'Otro negocio no debe usar la ruta ajena');
  r=await owner.call(`/api/businesses/${biz}/checkin`,'POST',{code,points:25});assert.equal(r.status,200,JSON.stringify(r.body));
  r=await owner.call(`/api/businesses/${biz}/checkin`,'POST',{code,points:25});assert.equal(r.status,409,'Un QR solo puede usarse una vez');
  r=await client.call('/api/me/wallet');assert.equal(r.body[0].points,75);assert.equal(r.body[0].visits,2);
  r=await owner.call(`/api/businesses/${biz}/overview`);assert.equal(r.body.stats.visits,2);
  r=await client.call('/api/invites/accept','POST',{code:'un-codigo-invalido'});assert.equal(r.status,403,'Usuario no puede volverse empleado');
  const worker=new Client(base);await worker.register('Empleado Luis','staff@example.test','company');
  r=await owner.call(`/api/businesses/${biz}/invites`,'POST',{email:'staff@example.test',role:'staff'});assert.equal(r.status,200);const inviteCode=r.body.inviteCode;
  r=await worker.call('/api/invites/accept','POST',{code:inviteCode});assert.equal(r.status,200);
  r=await worker.call(`/api/businesses/${biz}/customers`);assert.equal(r.status,200,'Empleado autorizado puede consultar clientes');
  r=await worker.call(`/api/businesses/${biz}/events`,'POST',{title:'No autorizado',date,time:'13:00',capacity:10});assert.equal(r.status,403,'Empleado no puede publicar eventos');
  r=await owner.call('/api/me/password','POST',{currentPassword:'ExamplePass1234!',newPassword:'ReplacementPass2026!'});assert.equal(r.status,200);
  r=await owner.call('/api/auth/login','POST',{email:'dueno1@example.test',password:'ExamplePass1234!'});assert.equal(r.status,401,'Contraseña anterior desactivada');

  r=await owner.call('/api/me');assert.equal(r.status,404,'No fingir endpoints faltantes');
  r=await owner.call('/api/auth/logout','POST',{});assert.equal(r.status,200);
  r=await owner.call(`/api/businesses/${biz}/overview`);assert.equal(r.status,401,'Cierre de sesión revoca la cookie');
  r=await owner.call('/api/auth/login','POST',{email:'dueno1@example.test',password:'ReplacementPass2026!'});assert.equal(r.status,200);
  r=await owner.call(`/api/businesses/${biz}/overview`);assert.equal(r.status,200,'Persistencia entre sesiones');
  r=await stranger.call('/api/auth/login','POST',{email:'dueno1@example.test',password:'incorrecta'});assert.equal(r.status,401);
  assert.equal((await fetch(base+'/')).status,200);
  assert.equal((await fetch(base+'/auth.html')).status,200);
  assert.equal((await fetch(base+'/workspace.html')).status,200);
  assert.equal((await fetch(base+'/site.css')).status,200);
  assert.equal((await fetch(base+'/auth.js')).status,200);
  assert.equal((await fetch(base+'/demo/')).status,404,'La demo anterior debe permanecer fuera de la web oficial');
  assert.equal((await fetch(base+'/waves.css')).status,404,'Los recursos antiguos no son públicos');
  assert.equal((await fetch(base+'/api/health')).status,200);
  assert.equal((await fetch(base+'/../server/index.mjs')).status,404);
});