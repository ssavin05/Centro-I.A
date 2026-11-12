// This publishable key is public by design. PostgreSQL RLS authorizes each request.
export let supabase = null;
let sdkTimer;
try {
  const {createClient} = await Promise.race([
    import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.94.1/+esm'),
    new Promise((_,reject) => {sdkTimer=setTimeout(()=>reject(Error('SDK_TIMEOUT')),15000);}),
  ]);
  supabase = createClient('https://huqspupbhhqilxeizklr.supabase.co','sb_publishable_Bp8XTxGbFg3OuysC-HjdAA_mbaR8kPr', {
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},
    global: {fetch: timedFetch},
  });
} catch {
  // Controllers render an actionable loading error when the SDK cannot load.
} finally {clearTimeout(sdkTimer);}

export async function timedFetch(input, options = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (options.signal?.aborted) abort();
  else options.signal?.addEventListener('abort', abort, {once:true});
  const timer = setTimeout(abort, 15000);
  try {return await fetch(input, {...options, signal:controller.signal});}
  finally {clearTimeout(timer);options.signal?.removeEventListener('abort', abort);}
}
