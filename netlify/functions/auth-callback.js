const crypto=require('node:crypto');
const a=require('../lib/auth.cjs');
exports.handler=async(event)=>{
 if(event.httpMethod!=='GET')return a.json(405,{error:'method'});
 const clear=[a.cookie('__Host-rx-state','',0)];
 const fail=()=>a.redirect('/acesso.html?erro=autenticacao',clear);
 if(!a.configured())return fail();
 const pending=a.unseal(a.cookies(event)['__Host-rx-state']);
 const q=event.queryStringParameters||{};
 if(!pending||!q.code||!q.state||q.error||!/^\w{64}$/.test(q.state))return fail();
 if(!crypto.timingSafeEqual(Buffer.from(pending.state),Buffer.from(q.state)))return fail();
 try{
  const response=await fetch('https://discord.com/api/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:a.CLIENT,client_secret:process.env.DISCORD_CLIENT_SECRET,grant_type:'authorization_code',code:q.code,redirect_uri:a.CALLBACK}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)return fail();
  const tokens=await response.json();
  if(typeof tokens.access_token!=='string'||!Number.isFinite(tokens.expires_in)||tokens.expires_in<=0)return fail();
  const ttl=Math.min(tokens.expires_in,3600);
  const session=a.seal({access:tokens.access_token,exp:Date.now()+ttl*1000});
  if(session.length>3800)return fail();
  return a.redirect('/acesso.html',[...clear,a.cookie('__Host-rx-session',session,ttl)]);
 }catch{return fail();}
};
