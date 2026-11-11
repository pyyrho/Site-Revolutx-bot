from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, parse_qs
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.assets=[];self.h1=0;self.text=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a':self.links.append(a.get('href',''))
  if tag in ('img','script') and 'src' in a:self.assets.append(a['src'])
  if tag=='link' and a.get('rel') in ('stylesheet','icon'):self.assets.append(a['href'])
  if tag=='h1':self.h1+=1
  if tag=='img':assert 'alt' in a
 def handle_data(self,data):self.text.append(data)
pages={}
for file in ROOT.glob('*.html'):
 if file.name=='live-old.html':continue
 p=Page();p.feed(file.read_text());pages[file.name]=p
 assert p.h1==1,file.name
 assert len(p.ids)==len(set(p.ids)),file.name
 assert not any(x in ''.join(p.text) for x in ('—','–')),file.name
 for asset in p.assets:assert (ROOT/asset).is_file(),asset
for name,p in pages.items():
 for link in p.links:
  u=urlparse(link)
  if not u.scheme and not link.startswith('/.netlify/'):
   target=u.path or name
   assert target in pages,(name,link)
   if u.fragment:assert u.fragment in pages[target].ids,(name,link)
  if u.netloc=='discord.com' and u.path=='/oauth2/authorize':
   q=parse_qs(u.query);assert q['client_id']==['1487512494674153793'];assert 'applications.commands' in q['scope'][0]
print(f'OK: {len(pages)} páginas, links internos, recursos, títulos, convite e textos.')
