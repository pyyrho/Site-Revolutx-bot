const a=require('../lib/auth.cjs');
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return a.json(405,{error:'method'});
 if(event.headers?.origin!==a.SITE)return a.json(403,{error:'origin'});
 return a.json(200,{ok:true},{'Set-Cookie':a.cookie('__Host-rx-session','',0)});
};
