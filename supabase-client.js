// Public frontend configuration. The publishable key is intentionally non-secret.
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.95.0';
export const supabase=createClient('https://huqspupbhhqilxeizklr.supabase.co','sb_publishable_Bp8XTxGbFg3OuysC-HjdAA_mbaR8kPr',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
