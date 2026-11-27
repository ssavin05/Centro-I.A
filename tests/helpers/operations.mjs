import {readFile} from 'node:fs/promises';
import {studioDatabase,studioActors} from './studio.mjs';
Object.assign(studioActors,{manager:'00000000-0000-4000-8000-000000000005',professional:'00000000-0000-4000-8000-000000000006',reception:'00000000-0000-4000-8000-000000000007'});
export {studioActors as actors};
export const key=n=>String(n).padStart(8,'0')+'-2222-4222-8222-222222222222';
export async function operationsDatabase(t){
 const h=await studioDatabase(t);const source=await readFile(new URL('../../supabase/migrations/20261125201303_operations_33_reviewed.sql',import.meta.url),'utf8');
 try{await h.db.exec(source);}catch(e){throw Error(e.message+' near '+source.slice(Math.max(0,Number(e.position||1)-90),Number(e.position||1)+90));}
 const location=(await h.rpc('company','cia_ops_snapshot')).locations[0].id;
 await h.rpc('company','cia_ops_save_location',[h.club,{id:location,name:'Sede principal',timezone:'UTC',active:true},key(900)]);
 async function staff(who,role,loc=location,n=1){const invite=await h.rpc('company','cia_ops_invite',[loc,role,'Solo prueba',key(n)]);const code=(await h.db.query('select code from cia_team_invites where id=$1',[invite])).rows[0].code;const membership=await h.rpc(who,'cia_ops_accept_invite',[code]);return {invite,code,membership};}
 async function resource(name='Profesional uno',user=null,loc=location,n=20){const id=await h.rpc('company','cia_ops_save_resource',[loc,{name,kind:'professional',staff_user_id:user,active:true},key(n)]);await h.rpc('company','cia_ops_save_hours',[id,Array.from({length:7},(_,weekday)=>({weekday,starts_at:'09:00',ends_at:'18:00'}))]);return id;}
 const day=new Date(Date.now()+2*86400000).toISOString().slice(0,10);
 return {...h,location,staff,resource,day};
}