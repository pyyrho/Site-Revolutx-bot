# Site do RevolutX

Site de apresentação hospedado no Netlify, com páginas de recursos, comandos, configuração, ajuda, privacidade e acesso pelo Discord. O site não contém o código do bot.

## Publicação

O Netlify lê `netlify.toml`, executa `node scripts/build.cjs` e publica apenas `dist`. As funções de autenticação ficam no ambiente de servidor. Arquivos de desenvolvimento e documentação não são copiados para a pasta pública.

Verificação local:

```
python tests/check_site.py
node --test tests/auth.test.cjs
node scripts/build.cjs
```

## Login Discord

Cadastre esta URL exata em OAuth2 / Redirects da aplicação do RevolutX no Discord Developer Portal:

```
https://revolutxbot.netlify.app/.netlify/functions/auth-callback
```

No painel do Netlify, configure variáveis com escopo Functions:

* `DISCORD_CLIENT_SECRET`: segredo OAuth2 da aplicação. Não é o token do bot.
* `SESSION_SECRET`: valor aleatório com pelo menos 32 caracteres, usado para proteger a sessão. Gere com um gerenciador de senhas ou ferramenta criptográfica.

Os valores nunca devem ser inseridos no HTML, JavaScript público, repositório ou mensagens. Faça um novo deploy depois de configurar. O login é limitado ao domínio oficial de produção e pede somente `identify guilds`. Sem essas variáveis, a página informa que o acesso ainda não está disponível.

A sessão usa cookie HttpOnly, Secure e SameSite=Lax, criptografia AES-GCM e validade máxima de uma hora. O fluxo verifica o estado de autorização. O painel mostra apenas servidores com permissão de gerenciamento. Ele oferece convite, acesso ao Discord e orientações; não altera configurações do bot remotamente. O texto público não promete essa integração.

## Conteúdo

Exemplos de conversa e clima são ilustrativos. O tema do cartão na página inicial é uma demonstração, não uma consulta real. O gerador de personalidade prepara um comando para copiar e executar no Discord. Não há chamada a modelos de IA pelo site.

O menu, busca de comandos, filtros, controles de movimento e temas de demonstração funcionam no navegador. Preferência de movimento reduzido é respeitada. O convite de instalação é o existente da aplicação e solicita Administrador, informação apresentada no guia.
