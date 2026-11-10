# Site do RevolutX

Site público do bot para Discord, publicado em https://revolutxbot.netlify.app/.

## Estrutura

- `index.html`: conteúdo, comandos e perguntas frequentes.
- `styles.css`: visual e layouts responsivos.
- `script.js`: menu móvel, filtros, busca e cópia dos comandos.
- `assets/`: marca e demonstração ilustrativa do clima.

Não exige dependências nem compilação. No Netlify, mantenha a branch `main`, sem comando de build, e publique a raiz do repositório (`.`). A publicação automática depende de a integração GitHub estar habilitada no projeto Netlify.

A imagem de clima é uma demonstração com dados de teste, não uma previsão atual. O site não chama provedores de IA nem usa tokens do bot. Recursos que dependem de configuração ou de serviços externos estão identificados no texto.

## Verificação

Execute `python3 tests/check_site.py` e `node --check script.js`. No navegador, confira a versão desktop e a largura de 390 px; teste menu, filtro por categoria, busca sem acentos, resultado vazio, cópia e perguntas frequentes.
