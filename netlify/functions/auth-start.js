const crypto=require('node:crypto');
const a=require('../lib/auth.cjs');
exports.handler=async(event)=>{
 if(event.httpMethod!=='GET')return a.json(405,{error:'method'});
 if(!a.configured())return a.redirect('/acesso.html?erro=indisponivel');
 const state=crypto.randomBytes(32).toString('hex');
 const url=new URL('https://discord.com/oauth2/authorize');
 url.search=new URLSearchParams({client_id:a.CLIENT,redirect_uri:a.CALLBACK,response_type:'code',scope:'identify guilds',state});
 return a.redirect(url.href,[a.cookie('__Host-rx-state',a.seal({state,exp:Date.now()+600000}),600)]);
};
