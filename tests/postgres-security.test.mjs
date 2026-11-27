import test from 'node:test';
import assert from 'node:assert/strict';
import {isolatedPostgres,actors} from './helpers/postgres.mjs';

test('PostgreSQL aislado: RLS de perfiles y tipo de cuenta inmutable',async t=>{
  const pg=await isolatedPostgres();t.after(()=>pg.close());
  const own=await pg.asUser(actors.owner,tx=>tx.query('select id from public.cia_profiles'));
  assert.deepEqual(own.rows.map(x=>x.id),[actors.owner]);
  await assert.rejects(pg.asUser(actors.owner,tx=>tx.query("update public.cia_profiles set account_type='company'")),/permission denied/);
  const other=await pg.asUser(actors.owner,tx=>tx.query("update public.cia_profiles set name='Ajeno' where id=$1 returning id",[actors.other]));
  assert.equal(other.rows.length,0);
  await pg.asUser(actors.owner,tx=>tx.query("update public.cia_profiles set name='Nuevo' where id=$1",[actors.owner]));
  assert.equal((await pg.asUser(actors.owner,tx=>tx.query('select name from public.cia_profiles'))).rows[0].name,'Nuevo');
  await assert.rejects(pg.asUser(null,tx=>tx.query('select * from public.cia_profiles'),'anon'),/permission denied/);
  await pg.db.query('update auth.users set raw_user_meta_data=$1 where id=$2',[{account_type:'company'},actors.user]);
  assert.equal((await pg.asUser(actors.user,tx=>tx.query('select account_type from public.cia_profiles'))).rows[0].account_type,'user');
});
const payload={name:'Negocio aislado',category:'cafeteria',country:'MX',city:'Ciudad de prueba',address:'Dirección de prueba',contact_email:'negocio@example.test',uses_points:true};
const save=(pg,actor,data=payload,revision=0)=>pg.asUser(actor,tx=>tx.query('select public.cia_save_business_draft($1,1,$2) as draft',[data,revision]));
test('PostgreSQL aislado: borrador, alta atómica e aislamiento entre negocios',async t=>{
  const pg=await isolatedPostgres({businesses:true});t.after(()=>pg.close());
  await assert.rejects(save(pg,actors.user),/company_account_required/);
  assert.equal((await save(pg,actors.owner)).rows[0].draft.revision,1);
  assert.equal((await save(pg,actors.owner)).rows[0].draft.revision,1);
  await assert.rejects(save(pg,actors.owner,{...payload,name:'Obsoleto'}),/draft_conflict/);
  assert.equal((await pg.asUser(actors.other,tx=>tx.query('select * from public.cia_business_drafts'))).rows.length,0);
  const finish=()=>pg.asUser(actors.owner,tx=>tx.query('select public.cia_finish_business_onboarding(1) as id'));
  const id=(await finish()).rows[0].id;
  assert.equal((await finish()).rows[0].id,id);
  for(const table of ['cia_businesses','cia_business_members','cia_locations','cia_business_activity']) {
    assert.equal((await pg.asUser(actors.owner,tx=>tx.query('select * from public.'+table))).rows.length,1);
    assert.equal((await pg.asUser(actors.other,tx=>tx.query('select * from public.'+table))).rows.length,0);
    await assert.rejects(pg.asUser(actors.other,tx=>tx.query('delete from public.'+table)),/permission denied/);
  }
  assert.equal((await pg.db.query('select count(*)::int as n from public.cia_businesses')).rows[0].n,1);
  assert.equal((await pg.asUser(actors.owner,tx=>tx.query('select status from public.cia_businesses'))).rows[0].status,'private');
});
test('PostgreSQL aislado: payload malicioso y alta incompleta sin registros parciales',async t=>{
  const pg=await isolatedPostgres({businesses:true});t.after(()=>pg.close());
  for(const data of [{...payload,owner_id:actors.other},{...payload,role:'owner'},{...payload,uses_points:'true'},
    {...payload,brand_color:'red'},{...payload,timezone:'Invalid/Nowhere'},{...payload,name:'x'.repeat(101)},null,[]])
    await assert.rejects(save(pg,actors.owner,data));
  await save(pg,actors.owner,{name:'Borrador incompleto'});
  await assert.rejects(pg.asUser(actors.owner,tx=>tx.query('select public.cia_finish_business_onboarding(1)')),/incomplete_business/);
  for(const table of ['cia_businesses','cia_business_members','cia_locations','cia_business_activity'])
    assert.equal((await pg.db.query('select count(*)::int as n from public.'+table)).rows[0].n,0);
  await assert.rejects(pg.asUser(null,tx=>tx.query('select public.cia_finish_business_onboarding(1)'),'anon'),/permission denied/);
});

test('PostgreSQL aislado: fallo a mitad del alta revierte negocio y membresía',async t=>{
  const pg=await isolatedPostgres({businesses:true});t.after(()=>pg.close());
  await save(pg,actors.owner);
  await pg.db.exec(`create function public.test_location_failure() returns trigger language plpgsql as $$begin raise exception 'isolated_test_failure';end$$;
    create trigger test_location_failure before insert on public.cia_locations for each row execute function public.test_location_failure();`);
  await assert.rejects(pg.asUser(actors.owner,tx=>tx.query('select public.cia_finish_business_onboarding(1)')),/isolated_test_failure/);
  for(const table of ['cia_businesses','cia_business_members','cia_locations','cia_business_activity'])
    assert.equal((await pg.db.query('select count(*)::int as n from public.'+table)).rows[0].n,0);
  assert.equal((await pg.db.query('select business_id from public.cia_business_drafts')).rows[0].business_id,null);
});

test('PostgreSQL aislado: dos ediciones obsoletas no se sobrescriben',async t=>{
  const pg=await isolatedPostgres({businesses:true});t.after(()=>pg.close());
  await save(pg,actors.owner);
  const outcomes=await Promise.allSettled([
    save(pg,actors.owner,{...payload,name:'Edición uno'},1),
    save(pg,actors.owner,{...payload,name:'Edición dos'},1),
  ]);
  assert.equal(outcomes.filter(x=>x.status==='fulfilled').length,1);
  assert.equal(outcomes.filter(x=>x.status==='rejected').length,1);
  const draft=(await pg.asUser(actors.owner,tx=>tx.query('select payload,revision from public.cia_business_drafts'))).rows[0];
  assert.equal(draft.revision,2);assert.ok(['Edición uno','Edición dos'].includes(draft.payload.name));
  await assert.rejects(pg.asUser(null,tx=>tx.query('select public.cia_save_business_draft($1,1,0)',[payload])),/company_account_required/);
  await assert.rejects(pg.asUser(actors.owner,tx=>tx.query("insert into public.cia_business_members(business_id,user_id,role) values(gen_random_uuid(),$1,'owner')",[actors.owner])),/permission denied/);
});
