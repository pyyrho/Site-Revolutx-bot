const crypto = require('node:crypto');
const SITE = 'https://revolutxbot.netlify.app';
const CLIENT = '1487512494674153793';
const CALLBACK = SITE + '/.netlify/functions/auth-callback';
const headers = {'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','Referrer-Policy':'no-referrer'};
function configured(){return Boolean(process.env.DISCORD_CLIENT_SECRET && process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32);}
function key(){if(!configured())throw new Error('Configuration missing');return crypto.createHash('sha256').update(process.env.SESSION_SECRET).digest();}
function seal(data){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key(),iv);const body=Buffer.concat([cipher.update(JSON.stringify(data),'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),body]).toString('base64url');}
function unseal(value){try{if(!value || value.length>3800)return null;const raw=Buffer.from(value,'base64url');const decipher=crypto.createDecipheriv('aes-256-gcm',key(),raw.subarray(0,12));decipher.setAuthTag(raw.subarray(12,28));const data=JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)),decipher.final()]).toString());return data.exp>Date.now()?data:null;}catch{return null;}}
function cookie(name,value,age){return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;}
function cookies(event){return Object.fromEntries((event.headers?.cookie||'').split(';').map(x=>{const i=x.indexOf('=');return i<0?['','']:[x.slice(0,i).trim(),x.slice(i+1)];}));}
function json(status,data,extra={}){return {statusCode:status,headers:{...headers,...extra},body:JSON.stringify(data)};}
function redirect(path,values=[]){return {statusCode:302,headers:{...headers,Location:path},multiValueHeaders:{'Set-Cookie':values},body:''};}
async function discord(path,token){const response=await fetch('https://discord.com/api/v10'+path,{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(8000)});if(!response.ok)throw new Error('Discord unavailable');return response.json();}
module.exports={SITE,CLIENT,CALLBACK,configured,seal,unseal,cookie,cookies,json,redirect,discord};
