// Local-only adapter served exclusively by scripts/loyalty-preview.mjs.
// It never talks to Supabase and is excluded from the Pages artifact.
const previewToken='__PREVIEW_TOKEN__';
const actor=new URLSearchParams(location.search).get('as')==='company'?'company':'user';
const listeners=[];
async function local(path,body){
 try{
  const response=await fetch('/__local/'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-Preview-Token':previewToken,'X-Preview-Actor':actor},...(body?{body:JSON.stringify(body)}:{})});
  const value=await response.json();return response.ok?{data:value,error:null}:{data:null,error:value};
 }catch{return {data:null,error:{message:'local_connection_unavailable'}};}
}
export const supabase={
 auth:{
  async getUser(){const {data,error}=await local('profile');return {data:{user:data?.user||null},error};},
  async getSession(){const {data,error}=await local('profile');return {data:{session:data?{user:data.user}:null},error};},
  onAuthStateChange(callback){listeners.push(callback);return {data:{subscription:{unsubscribe(){}}}};},
  async signOut(){return {error:null};},
 },
 from(table){
  let patch=null;
  return {select(){return this;},eq(){return this;},update(value){patch=value;return this;},async single(){
   if(table!=='cia_profiles')return {data:null,error:{message:'local_table_not_allowed'}};
   const {data,error}=await local('profile',patch?{name:patch.name}:undefined);return {data:data?.profile,error};
  }};
 },
 rpc(name,args={}){return local('rpc',{name,args});},
};
