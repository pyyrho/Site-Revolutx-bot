from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, parse_qs

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.links=[]; self.assets=[]; self.h1=0
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if "id" in a: self.ids.append(a["id"])
        if tag=="a": self.links.append(a.get("href", ""))
        if tag in ("img", "script") and "src" in a: self.assets.append(a["src"])
        if tag=="link" and a.get("rel") in ("stylesheet", "icon"): self.assets.append(a["href"])
        if tag=="h1": self.h1+=1
        if tag=="img": assert "alt" in a, "Imagem sem texto alternativo"
page=Page(); html=(ROOT/"index.html").read_text(); page.feed(html)
assert page.h1==1
assert len(page.ids)==len(set(page.ids)), "IDs duplicados"
for link in page.links:
    if link.startswith("#"): assert link[1:] in page.ids, link
    if "discord.com/oauth2" in link:
        q=parse_qs(urlparse(link).query)
        assert q["client_id"]==["1487512494674153793"]
        assert "applications.commands" in q["scope"][0]
for asset in page.assets: assert (ROOT/asset).is_file(), asset
for obsolete in ("SEU_SERVIDOR", "GPT-5.4", "GPT‑5.4", "data:image"):
    assert obsolete not in html, obsolete
assert "dados de teste" in html
print("OK: âncoras, assets, IDs, acessibilidade básica, convite e conteúdo.")
