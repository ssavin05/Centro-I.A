// Bound the entire Auth operation, including SDK/session work outside fetch.
export async function authDeadline(operation,timeoutMs=20000){
 let timer;
 try{
  return await Promise.race([
   operation(),
   new Promise((_,reject)=>{timer=setTimeout(()=>reject(Object.assign(Error('AUTH_TIMEOUT'),{code:'auth_timeout'})),timeoutMs);}),
  ]);
 }finally{clearTimeout(timer);}
}

// Auth replies are small JSON documents. Keep the abort active through their body,
// not only until headers arrive. Other Supabase responses retain their normal stream.
export async function timedFetch(input,options={},timeoutMs=15000){
 const controller=new AbortController(),sourceSignal=options.signal||input?.signal;
 const abort=()=>controller.abort();
 if(sourceSignal?.aborted)abort();else sourceSignal?.addEventListener('abort',abort,{once:true});
 const timer=setTimeout(abort,timeoutMs);
 try{
  const response=await fetch(input,{...options,signal:controller.signal});
  const url=new URL(typeof input==='string'?input:input.url||input.href);
  if(!url.pathname.startsWith('/auth/v1/')||!response.body)return response;
  const body=await response.arrayBuffer();
  return new Response(body,{status:response.status,statusText:response.statusText,headers:response.headers});
 }finally{clearTimeout(timer);sourceSignal?.removeEventListener('abort',abort);}
}
