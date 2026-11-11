const a=require('../lib/auth.cjs');
exports.handler=async(event)=>{
 if(event.httpMethod!=='GET')return a.json(405,{error:'method'});
 if(!a.configured())return a.json(200,{configured:false});
 const session=a.unseal(a.cookies(event)['__Host-rx-session']);
 if(!session)return a.json(200,{configured:true,user:null});
 try{
  const [user,guilds]=await Promise.all([a.discord('/users/@me',session.access),a.discord('/users/@me/guilds',session.access)]);
  const manageable=guilds.filter(g=>g.owner||(BigInt(g.permissions||'0')&40n)!==0n).filter(g=>/^\d+$/.test(g.id));
  return a.json(200,{configured:true,user:{name:user.global_name||user.username},guilds:manageable.map(g=>({id:g.id,name:g.name}))});
 }catch{return a.json(503,{configured:true,error:'unavailable'});}
};
