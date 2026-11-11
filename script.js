'use strict';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const drawer = $('#navigation');
const menu = $('.menu-toggle');
menu?.addEventListener('click', () => { drawer.showModal(); menu.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; });
const closeMenu = () => drawer.close();
$('[data-close]')?.addEventListener('click', closeMenu);
drawer?.addEventListener('click', e => { if (e.target === drawer && e.clientX > drawer.getBoundingClientRect().right) closeMenu(); });
drawer?.addEventListener('close', () => { menu.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; menu.focus(); });
$$('#navigation a').forEach(a => a.addEventListener('click', closeMenu));
let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2500); }
async function copy(text) { try { await navigator.clipboard.writeText(text); toast('Comando copiado. Selecione a menção ao bot no Discord.'); } catch { toast('Não foi possível copiar. Selecione o comando e copie manualmente.'); } }
$$('[data-copy]').forEach(b => b.addEventListener('click', () => copy(b.dataset.copy)));
const motion = $('#motion-toggle');
function setMotion(paused) { document.documentElement.classList.toggle('motion-paused', paused); motion?.setAttribute('aria-pressed', String(paused)); if(motion) motion.textContent = paused ? 'Retomar animações' : 'Pausar animações'; }
try { setMotion(localStorage.getItem('revolutx-motion') === 'paused'); } catch { /* Storage is optional. */ }
motion?.addEventListener('click', () => { const paused = !document.documentElement.classList.contains('motion-paused'); setMotion(paused); try { localStorage.setItem('revolutx-motion', paused ? 'paused' : 'playing'); } catch {} });
$$('[data-period]').forEach(button => button.addEventListener('click', () => { const night = button.dataset.period === 'night'; $('.weather-demo').dataset.weather = button.dataset.period; $('.weather-icon').textContent = night ? '☾' : '☀'; $$('[data-period]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); }));
let category = 'Todos';
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function filterCommands() { const query = normalize($('#command-search')?.value || ''); let count = 0; $$('.command-row').forEach(row => { const show = (category === 'Todos' || row.dataset.category === category) && normalize(row.textContent).includes(query); row.hidden = !show; if(show) count++; }); if($('#command-count')) $('#command-count').textContent = `${count} ${count === 1 ? 'comando encontrado' : 'comandos encontrados'}`; if($('#no-results')) $('#no-results').hidden = count > 0; }
$('#command-search')?.addEventListener('input', filterCommands);
$$('[data-filter]').forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); filterCommands(); }));
if($('#command-search')) filterCommands();
document.addEventListener('keydown', e => { if(e.key === '/' && $('#command-search') && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !drawer.open) { e.preventDefault(); $('#command-search').focus(); } });
const tones = { breve: 'responda de forma breve e clara, aprofundando quando solicitado.', acolhedor: 'responda de forma acolhedora e natural, acompanhando o contexto da conversa.', academico: 'priorize clareza e rigor nos estudos, com explicações breves e aprofundamento quando solicitado.' };
$('#tone')?.addEventListener('change', e => { $('#tone-command').textContent = '@RevolutX personalidade: ' + tones[e.target.value]; });
$('#copy-tone')?.addEventListener('click', () => copy($('#tone-command').textContent));
async function loadAccount() {
 if(!$('#auth-message')) return;
 const message = $('#auth-message'), login = $('#login-button');
 try {
  const response = await fetch('/.netlify/functions/auth-session', {headers:{Accept:'application/json'},cache:'no-store'});
  if(!response.ok) throw new Error('unavailable');
  const data = await response.json();
  if(!data.configured) { message.textContent = 'O acesso à conta ainda não está disponível. Você pode adicionar o bot e consultar os guias sem entrar.'; return; }
  if(!data.user) { login.hidden = false; const error = new URLSearchParams(location.search).get('erro'); message.textContent = error ? 'Não foi possível concluir o acesso. Tente entrar novamente pelo Discord.' : 'Autorize o acesso ao perfil e à lista de servidores para continuar.'; return; }
  $('#account-title').textContent = 'Olá, ' + data.user.name + '.';
  message.textContent = 'Você está conectado pelo Discord.'; login.hidden = true; $('#logout-button').hidden = false;
  const list = $('#guild-list'); list.replaceChildren();
  if(!data.guilds.length) { const p=document.createElement('p'); p.textContent='Nenhum servidor com permissão de gerenciamento foi encontrado.'; list.append(p); }
  data.guilds.forEach(guild => { const item=document.createElement('article'); item.className='guild-card'; const h=document.createElement('h3'); h.textContent=guild.name; const add=document.createElement('a'); add.textContent='Adicionar bot'; const url=new URL('https://discord.com/oauth2/authorize'); url.search=new URLSearchParams({client_id:'1487512494674153793',scope:'bot applications.commands',permissions:'8',integration_type:'0',guild_id:guild.id,disable_guild_select:'true'}); add.href=url.href; const open=document.createElement('a'); open.textContent='Abrir no Discord'; open.href='https://discord.com/channels/'+guild.id; item.append(h,add,open);list.append(item); });
 } catch { message.textContent = 'O acesso à conta está indisponível no momento. Os guias e o convite do bot continuam disponíveis.'; }
}
$('#logout-button')?.addEventListener('click', async e => { e.target.disabled=true; try { const r=await fetch('/.netlify/functions/auth-logout',{method:'POST'}); if(!r.ok) throw new Error(); location.assign('acesso.html'); } catch { e.target.disabled=false; toast('Não foi possível sair agora. Tente novamente.'); } });
loadAccount();
