export const loyaltySections=['home','rewards','visits','explore','account'];
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function loyaltyError(error){
 const messages={invalid_club_code:'No encontramos ese código. Pídeselo al negocio y revisa las 12 letras y números.',join_first:'Primero únete al programa de este negocio.',visit_cooldown:'Ya registraste una visita reciente. Puedes iniciar otra cuando hayan pasado 18 horas.',not_enough_points:'Todavía no tienes los puntos necesarios en este negocio.',reward_unavailable:'El premio ya no está disponible. Actualiza para ver otras opciones.',account_not_allowed:'Esta acción no está disponible para tu tipo de cuenta.',club_not_owned:'Solo el negocio propietario puede realizar esta acción.',request_conflict:'No pudimos confirmar esta solicitud. Actualiza antes de volver a intentarlo.',invalid_club:'Revisa el nombre, categoría, ciudad y puntos de tu negocio.',invalid_reward:'Revisa el nombre, puntos y existencias del premio.'};
 if(messages[error?.message])return messages[error.message];
 if(['PGRST202','PGRST205','42P01','42883'].includes(error?.code))return 'El programa de fidelidad todavía no está disponible en este entorno. Tu cuenta sigue funcionando.';
 return 'No pudimos completar la operación. Revisa tu conexión y actualiza el estado antes de volver a intentar.';
}
export function rewardState(reward,club){
 const points=Number(club?.points||0),cost=Number(reward.points_cost);
 return {points,remaining:Math.max(0,cost-points),available:reward.active!==false && reward.stock!==0,canRedeem:!!club&&points>=cost&&reward.active!==false&&reward.stock!==0};
}

export function arrivalState(visits,clubId,serverTime){
 const relevant=visits.filter(v=>v.club_id===clubId);
 const openVisit=relevant.find(v=>!v.departed_at);
 const latest=Math.max(0,...relevant.map(v=>Date.parse(v.arrived_at)||0));
 const nextAllowedAt=latest?new Date(latest+18*60*60*1000).toISOString():null;
 return {openVisit,nextAllowedAt,canArrive:!openVisit&&(!nextAllowedAt||Date.parse(nextAllowedAt)<=Date.parse(serverTime||new Date().toISOString()))};
}
