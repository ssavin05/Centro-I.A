// Explicit allowlist: never export a session, JWT, password or editable metadata.
export function profileExport(user,profile,exportedAt=new Date().toISOString()) {
  if (!user?.id || !profile || !['user','company'].includes(profile.account_type)) throw Error('PROFILE_REQUIRED');
  return {
    format:'centro-ia-profile-v1',exported_at:exportedAt,
    scope:'Perfil y correo de la cuenta. No incluye datos de módulos todavía no implementados.',
    profile:{id:user.id,name:profile.name,account_type:profile.account_type,email:user.email||'',created_at:profile.created_at||null},
  };
}

export function downloadProfile(data) {
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');
  try {
    anchor.href=url;anchor.download='centro-ia-mi-perfil.json';
    document.body.appendChild(anchor);anchor.click();
  } finally {anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
}
