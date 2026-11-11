const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
for(const file of fs.readdirSync(root)){if(/\.(html|css|js)$/.test(file)&&file!=='live-old.html')fs.copyFileSync(path.join(root,file),path.join(dist,file));}
fs.cpSync(path.join(root,'assets'),path.join(dist,'assets'),{recursive:true});
console.log('Static site built in dist.');
