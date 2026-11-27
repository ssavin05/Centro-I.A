export function rewardProgress(reward,club,serverTime){
 const points=Number(club?.points),cost=Number(reward?.points_cost),now=Date.parse(serverTime||new Date().toISOString());
 const known=!!club&&club.points!==null&&club.points!==undefined&&Number.isFinite(points)&&points>=0&&Number.isFinite(cost)&&cost>0;
 const available=reward?.active!==false&&reward?.stock!==0&&(!reward?.valid_until||Date.parse(reward.valid_until)>=now);
 return {known,points:known?points:0,cost:known?cost:0,available,ready:known&&available&&points>=cost,remaining:known?Math.max(0,cost-points):0,percent:known?Math.max(0,Math.min(100,points/cost*100)):0};
}
export function chooseReward(rewards,club,serverTime,preferredId){
 if(!club)return null;const list=rewards.filter(r=>r.club_id===club.id&&rewardProgress(r,club,serverTime).known&&rewardProgress(r,club,serverTime).available).sort((a,b)=>a.points_cost-b.points_cost||String(a.id).localeCompare(String(b.id)));
 return list.find(r=>r.id===preferredId)||list.find(r=>rewardProgress(r,club,serverTime).ready)||list[0]||null;
}
export function levelProgress(visits){const count=Math.max(0,Number(visits)||0);if(count>=10)return {label:'Preferente',next:null,count,target:10,remaining:0,percent:100};const target=count>=3?10:3;return {label:count>=3?'Habitual':'Explorador',next:count>=3?'Preferente':'Habitual',count,target,remaining:target-count,percent:Math.min(100,count/target*100)};}
export function customerActivity(snapshot,studio,clubId){
 const entries=[];
 for(const v of snapshot.visits.filter(v=>v.club_id===clubId))entries.push({id:'visit:'+v.id,at:v.confirmed_at||v.departed_at||v.arrived_at,title:v.confirmed_at?'Visita confirmada':v.departed_at?'Visita por confirmar':'Llegada registrada',detail:v.confirmed_at?'+'+v.awarded_points+' puntos por volver':'El negocio confirma los puntos de tu visita.',icon:v.confirmed_at?'check':'visit',view:'visits'});
 for(const r of snapshot.redemptions.filter(r=>r.club_id===clubId))entries.push({id:'redemption:'+r.id,at:r.cancelled_at||r.delivered_at||r.created_at,title:r.state==='cancelled'?'Puntos devueltos':r.state==='delivered'?'Premio entregado':'Tu premio está por recoger',detail:r.reward_title,icon:'gift',view:'rewards'});
 for(const m of (studio?.movements||[]).filter(m=>m.club_id===clubId&&!/^(visit:|redemption:|refund:|opening$)/.test(m.source_key||'')))entries.push({id:'movement:'+m.id,at:m.created_at,title:(m.amount>0?'+':'')+m.amount+' puntos',detail:m.reason,icon:'star',view:'inbox'});
 return entries.filter(r=>Number.isFinite(Date.parse(r.at))).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at)||a.id.localeCompare(b.id)).slice(0,4);
}
export function filterCustomerRewards(rewards,clubs,{kind='all',clubId='',serverTime}={}){return rewards.filter(r=>{if(clubId&&r.club_id!==clubId)return false;const state=rewardProgress(r,clubs.find(c=>c.id===r.club_id),serverTime);return kind==='ready'?state.ready:kind==='progress'?state.known&&state.available&&!state.ready:true;});}
