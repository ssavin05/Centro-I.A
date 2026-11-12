// Public frontend configuration. The publishable key is intentionally non-secret.
import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.94.1/+esm';
export const supabase=createClient('https://huqspupbhhqilxeizklr.supabase.co','sb_publishable_Bp8XTxGbFg3OuysC-HjdAA_mbaR8kPr',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
