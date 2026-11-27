const layer=document.getElementById('windowLayer');
const launcher=document.getElementById('launcher');
const backdrop=document.getElementById('launcherBackdrop');
const search=document.getElementById('launcherSearch');
const toastEl=document.getElementById('toast');
let z=30;
const appDefs={
 files:{title:'Files',body:`<div class="app-content"><h2>My Files</h2><p style="color:#687187">Browse your folders</p><div class="file-list"><button class="file-item" data-folder="Documents"><span>📁</span>Documents</button><button class="file-item" data-folder="Pictures"><span>🖼️</span>Pictures</button><button class="file-item" data-folder="Downloads"><span>⬇️</span>Downloads</button><button class="file-item" data-folder="Music"><span>🎵</span>Music</button><button class="file-item" data-folder="Videos"><span>🎬</span>Videos</button><button class="file-item" data-folder="Disk"><span>💾</span>Disk</button></div>`},
 browser:{title:'Browser',body:`<div class="app-content"><h2>Welcome to MAC Browser</h2><p>Browser window concept. Web browsing integration will come in a later OS milestone.</p><div style="padding:14px;border-radius:10px;background:#edf1fb;color:#687187">🔒 Search or enter a URL (prototype only)</div></div>`},
 settings:{title:'Settings',body:`<div class="settings-layout"><aside class="settings-sidebar"><button class="active">Appearance</button><button>Desktop</button><button>Sound</button><button>Network</button><button>About</button></aside><div><h2>Appearance</h2><p style="color:#687187">Personalize your MAC desktop</p><div class="setting-row"><div><b>Dark appearance</b><div style="font-size:11px;color:#788196">Use a darker system theme</div></div><button class="switch" aria-label="Dark appearance" data-setting="dark"></button></div><div class="setting-row"><div><b>Dock magnification</b><div style="font-size:11px;color:#788196">Enlarge icons on hover</div></div><button class="switch on" aria-label="Dock magnification"></button></div><div class="setting-row"><div><b>Desktop widgets</b><div style="font-size:11px;color:#788196">Show desktop widgets</div></div><button class="switch" aria-label="Desktop widgets" data-setting="widgets"></button></div><div class="setting-row"><div><b>Accent color</b><div style="font-size:11px;color:#788196">Choose a highlight</div></div><div class="accent-picker"><button class="accent-swatch" data-accent="#6686f6" aria-label="Blue"></button><button class="accent-swatch" data-accent="#df76ad" aria-label="Pink"></button><button class="accent-swatch" data-accent="#56bf9c" aria-label="Mint"></button><button class="accent-swatch" data-accent="#f0a44b" aria-label="Amber"></button></div></div><div class="setting-row"><div><b>Wallpaper</b><div style="font-size:11px;color:#788196">Change your desktop background</div></div><div class="wallpaper-picker"><button class="wallpaper-swatch blue" data-wallpaper="blue" aria-label="Blue wallpaper"></button><button class="wallpaper-swatch violet" data-wallpaper="violet" aria-label="Violet wallpaper"></button><button class="wallpaper-swatch sunset" data-wallpaper="sunset" aria-label="Sunset wallpaper"></button></div></div></div></div></div>`},
 terminal:{title:'Terminal',body:`<div class="terminal"><div class="terminal-output" aria-live="polite">MAC OS Prototype Terminal\nWelcome. Type <b>help</b> to see available commands.</div><div class="terminal-prompt">$ <input placeholder="type a command…" autocomplete="off" /></div></div>`},
 notes:{title:'Notes',body:`<div class="app-content"><h2>Quick Notes</h2><textarea class="notes-area" placeholder="Start typing…"></textarea><p class="notes-status" style="font-size:11px;color:#788196;margin-top:8px">Saved locally on this device</p></div>`},
 about:{title:'About MAC OS',body:`<div class="app-content" style="text-align:center;padding-top:30px"><div style="font-size:56px">⌘</div><h2>MAC OS</h2><p>Desktop prototype 0.6</p><p style="color:#687187">A personal Linux-based operating system concept, with its own design language.</p></div>`}
};
function showToast(text){toastEl.textContent=text;toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),1900)}
function setDockRunning(id,running){document.querySelectorAll('.dock-app[data-open="'+id+'"]').forEach(btn=>btn.classList.toggle('running',running))}function openApp(id){const def=appDefs[id];if(!def)return;closeLauncher();let existing=document.querySelector('.app-window[data-app="'+id+'"]');if(existing){existing.style.zIndex=++z;existing.style.display='block';setDockRunning(id,true);return;}
const win=document.createElement('article');win.className='app-window';win.dataset.app=id;win.style.zIndex=++z;win.innerHTML=`<div class="window-titlebar"><div class="window-controls"><button class="win-control close" aria-label="Close"></button><button class="win-control minimize" aria-label="Minimize"></button><button class="win-control maximize" aria-label="Maximize"></button></div><div class="window-title">${def.title}</div></div><div class="window-content">${def.body}</div>`;layer.appendChild(win);
win.querySelector('.close').onclick=()=>{win.remove();setDockRunning(id,false)};setDockRunning(id,true);
win.querySelector('.minimize').onclick=()=>{win.style.display='none';showToast(def.title+' minimized')};
win.querySelector('.maximize').onclick=()=>{win.classList.toggle('maximized');if(win.classList.contains('maximized')){win.style.cssText+=';left:0;top:0;transform:none;width:100%;height:100%'}else{win.style.left='50%';win.style.top='50%';win.style.transform='translate(-50%,-50%)';win.style.width='min(620px,calc(100vw - 30px))';win.style.height='min(440px,calc(100dvh - 140px))'}};
win.addEventListener('mousedown',()=>win.style.zIndex=++z);
const bar=win.querySelector('.window-titlebar');let dragging=false,dx=0,dy=0;
bar.addEventListener('pointerdown',e=>{if(win.classList.contains('maximized'))return;dragging=true;dx=e.clientX-win.offsetLeft;dy=e.clientY-win.offsetTop;bar.setPointerCapture(e.pointerId)});
bar.addEventListener('pointermove',e=>{if(!dragging)return;win.style.left=(e.clientX-dx+win.offsetWidth/2)+'px';win.style.top=(e.clientY-dy+win.offsetHeight/2)+'px';win.style.transform='translate(-50%,-50%)'});
bar.addEventListener('pointerup',()=>dragging=false);
win.querySelectorAll('.switch').forEach(s=>s.onclick=()=>s.classList.toggle('on'));
win.querySelectorAll('.settings-sidebar button').forEach(b=>b.onclick=()=>{win.querySelectorAll('.settings-sidebar button').forEach(x=>x.classList.remove('active'));b.classList.add('active');showToast(b.textContent+' settings (demo)')});
const input=win.querySelector('.terminal input');if(input)input.focus();
}
document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>openApp(el.dataset.open)));
function toggleLauncher(){launcher.classList.toggle('show');backdrop.classList.toggle('show');if(launcher.classList.contains('show')){search.value='';filterApps('');search.focus()}}
function closeLauncher(){launcher.classList.remove('show');backdrop.classList.remove('show')}
document.getElementById('launcherToggle').onclick=toggleLauncher;backdrop.onclick=closeLauncher;
search.addEventListener('input',()=>filterApps(search.value));
let launcherSelection=0;function filterApps(q){const apps=[...document.querySelectorAll('.launcher-app')];const matches=apps.filter(btn=>btn.textContent.toLowerCase().includes(q.trim().toLowerCase()));apps.forEach(btn=>{btn.style.display=matches.includes(btn)?'grid':'none';btn.classList.remove('selected')});launcherSelection=0;matches[0]?.classList.add('selected');let empty=document.getElementById('launcherEmpty');if(!empty){empty=document.createElement('p');empty.id='launcherEmpty';empty.textContent='No apps found';empty.style.cssText='color:#cbd0df;text-align:center;font-size:12px;padding:12px 0;display:none';document.getElementById('launcherGrid').after(empty)}empty.style.display=matches.length?'none':'block'}function moveLauncherSelection(delta){const matches=[...document.querySelectorAll('.launcher-app')].filter(btn=>btn.style.display!=='none');if(!matches.length)return;launcherSelection=Math.max(0,Math.min(matches.length-1,launcherSelection+delta));matches.forEach((btn,i)=>btn.classList.toggle('selected',i===launcherSelection))}search.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();moveLauncherSelection(1)}else if(e.key==='ArrowUp'){e.preventDefault();moveLauncherSelection(-1)}else if(e.key==='Enter'){const match=[...document.querySelectorAll('.launcher-app')].filter(btn=>btn.style.display!=='none')[launcherSelection];match?.click()}});
document.getElementById('controlCenter').onclick=()=>showToast('Control Center · Wi-Fi · Sound · Brightness');
document.getElementById('systemMenu').onclick=()=>showToast('MAC system menu · About · Settings · Restart');
document.querySelectorAll('.menu-label').forEach(b=>b.onclick=()=>showToast(b.dataset.menu+' menu (prototype)'));
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key===' '){e.preventDefault();toggleLauncher()}if(e.key==='Escape'){closeLauncher();controlPanel.classList.remove('show');notificationPanel.classList.remove('show')}});
function updateClock(){const d=new Date();document.getElementById('clock').textContent=d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}
updateClock();setInterval(updateClock,30000);

/* v0.2 feature wiring */
const bootOverlay=document.getElementById('bootScreen'),lockOverlay=document.getElementById('lockScreen');
setTimeout(()=>{bootOverlay.classList.add('done');lockOverlay.classList.add('show')},1700);
document.getElementById('unlockButton').onclick=()=>lockOverlay.classList.remove('show');
lockOverlay.addEventListener('click',e=>{if(e.target===lockOverlay)lockOverlay.classList.remove('show')});
const controlPanel=document.getElementById('controlPanel'),notificationPanel=document.getElementById('notificationPanel');
document.getElementById('controlCenter').onclick=()=>{controlPanel.classList.toggle('show');notificationPanel.classList.remove('show')};
document.getElementById('clock').onclick=()=>{notificationPanel.classList.toggle('show');controlPanel.classList.remove('show')};
document.getElementById('clearNotifications').onclick=()=>{notificationPanel.querySelector('.notification-card')?.remove();showToast('Notifications cleared')};
['wifiTile','focusTile','bluetoothTile'].forEach(id=>document.getElementById(id).onclick=e=>e.currentTarget.classList.toggle('active'));
document.getElementById('darkTile').onclick=()=>{document.body.classList.toggle('dark-ui');showToast('Appearance toggled')};
document.getElementById('brightness').oninput=e=>document.querySelector('.desktop').style.filter='brightness('+e.target.value/100+')';
document.getElementById('volume').oninput=e=>showToast('Volume '+e.target.value+'%');
const originalClock=updateClock;
function updateEnhancedClock(){const d=new Date();const t=d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});document.getElementById('clock').textContent=t;document.getElementById('lockClock').textContent=d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});document.getElementById('lockDate').textContent=d.toLocaleDateString([], {weekday:'long',month:'long',day:'numeric'});}
updateEnhancedClock();setInterval(updateEnhancedClock,30000);

/* v0.3 usability: click outside panels to dismiss */
document.addEventListener('click',e=>{if(!controlPanel.contains(e.target)&&e.target!==document.getElementById('controlCenter'))controlPanel.classList.remove('show');if(!notificationPanel.contains(e.target)&&e.target!==document.getElementById('clock'))notificationPanel.classList.remove('show')});


/* v0.4: local persistence and functional demo apps */
const STORE='macos-prototype-v04';
function readState(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}}
function writeState(patch){try{localStorage.setItem(STORE,JSON.stringify({...readState(),...patch}))}catch{showToast('Storage unavailable in this browser')}}
const saved=readState();
if(saved.dark)document.body.classList.add('dark-ui');
if(saved.wallpaper){document.querySelector('.desktop').style.background=saved.wallpaper}if(saved.accent)document.documentElement.style.setProperty('--accent',saved.accent);
document.querySelectorAll('[data-open="notes"]').forEach(()=>{});
const originalOpenApp=openApp;
openApp=function(id){const already=document.querySelector('.app-window[data-app="'+id+'"]');originalOpenApp(id);const win=document.querySelector('.app-window[data-app="'+id+'"]');if(!win)return;if(already){if(id==='settings'){const dark=win.querySelector('[data-setting="dark"]');dark?.classList.toggle('on',!!readState().dark);const dock=win.querySelector('[aria-label="Dock magnification"]');dock?.classList.toggle('on',readState().dockMagnification!==false)}return;}
if(id==='notes'){const area=win.querySelector('.notes-area'),status=win.querySelector('.notes-status');area.value=readState().notes||'';area.addEventListener('input',()=>{writeState({notes:area.value});status.textContent='Saved just now';clearTimeout(area._saveTimer);area._saveTimer=setTimeout(()=>status.textContent='Saved locally on this device',700)});}
if(id==='files'){win.querySelectorAll('[data-folder]').forEach(btn=>btn.onclick=()=>showToast(btn.dataset.folder+' folder · prototype'));}
if(id==='settings'){const dock=win.querySelector('[aria-label="Dock magnification"]');if(dock)dock.classList.toggle('on',readState().dockMagnification!==false);const dark=win.querySelector('[data-setting="dark"]');if(dark){dark.classList.toggle('on',!!readState().dark);dark.onclick=()=>{const next=!document.body.classList.contains('dark-ui');document.body.classList.toggle('dark-ui',next);dark.classList.toggle('on',next);writeState({dark:next});showToast(next?'Dark appearance enabled':'Light appearance enabled')}}win.querySelectorAll('[data-accent]').forEach(btn=>btn.onclick=()=>{const color=btn.dataset.accent;document.documentElement.style.setProperty('--accent',color);writeState({accent:color});showToast('Accent updated')});const wallpapers={blue:'radial-gradient(ellipse at 15% 20%,#5369bb 0%,transparent 45%),radial-gradient(ellipse at 82% 65%,#55b8e8 0%,transparent 40%),linear-gradient(130deg,#172b54,#192344 45%,#274d67)',violet:'radial-gradient(ellipse at 15% 20%,#7763cf 0%,transparent 45%),radial-gradient(ellipse at 82% 65%,#b56b9a 0%,transparent 40%),linear-gradient(130deg,#172b54,#192344 45%,#5d315e)',sunset:'radial-gradient(ellipse at 15% 20%,#f2a36e 0%,transparent 45%),radial-gradient(ellipse at 82% 65%,#e27b9f 0%,transparent 40%),linear-gradient(130deg,#432a54,#753e5b 45%,#b45d4b)'};win.querySelectorAll('[data-wallpaper]').forEach(btn=>btn.onclick=()=>{const bg=wallpapers[btn.dataset.wallpaper];document.querySelector('.desktop').style.background=bg;writeState({wallpaper:bg});showToast('Wallpaper changed')});}
if(id==='terminal'){const input=win.querySelector('.terminal input'),out=win.querySelector('.terminal-output');const history=[];function runCommand(raw){const cmd=raw.trim(),parts=cmd.split(/\s+/),name=parts[0]?.toLowerCase(),arg=parts.slice(1).join(' ');if(!cmd)return '';switch(name){case'help':return 'Available: help, clear, about, date, time, pwd, ls, echo, whoami';case'clear':out.textContent='';return null;case'about':return 'MAC OS browser prototype v0.7-dev · simulated terminal';case'date':return new Date().toDateString();case'time':return new Date().toLocaleTimeString();case'pwd':return '/home/demo';case'ls':return 'Desktop  Documents  Downloads  Pictures  Music  Videos';case'echo':return arg;case'whoami':return 'demo';default:return 'Command not found: '+name+' (type help)'}}input.addEventListener('keydown',e=>{if(e.key==='Enter'){const cmd=input.value;const result=runCommand(cmd);if(result!==null){out.textContent+='\n$ '+cmd+'\n'+result}input.value='';out.scrollTop=out.scrollHeight}});}
};


/* v0.7: desktop keyboard window management and persistent dock preferences */
(function macV07(){
  const dock=document.querySelector('.dock');
  const prefs=readState();
  if(prefs.dockMagnification) dock?.classList.add('magnified');
  document.addEventListener('click',event=>{
    const toggle=event.target.closest('.switch[aria-label="Dock magnification"]');
    if(!toggle)return;
    const enabled=toggle.classList.contains('on');
    dock?.classList.toggle('magnified',enabled);
    writeState({dockMagnification:enabled});
  });
  function topWindow(){
    return [...document.querySelectorAll('.app-window')].filter(w=>w.style.display!=='none').sort((a,b)=>(Number(b.style.zIndex)||0)-(Number(a.style.zIndex)||0))[0];
  }
  function toggleMaximize(win){
    if(!win)return;
    const max=win.classList.toggle('maximized');
    if(max){
      win.dataset.restoreStyle=JSON.stringify({left:win.style.left,top:win.style.top,width:win.style.width,height:win.style.height,transform:win.style.transform});
      Object.assign(win.style,{left:'0',top:'0',transform:'none',width:'100%',height:'100%'});
    }else{
      let restore={};
      try{restore=JSON.parse(win.dataset.restoreStyle||'{}')}catch{}
      Object.assign(win.style,{left:restore.left||'50%',top:restore.top||'50%',transform:restore.transform||'translate(-50%,-50%)',width:restore.width||'min(620px,calc(100vw - 30px))',height:restore.height||'min(440px,calc(100dvh - 140px))'});
    }
  }
  document.addEventListener('keydown',event=>{
    const win=topWindow();
    const key=event.key.toLowerCase();
    if((event.metaKey||event.ctrlKey)&&key==='w'&&win){
      event.preventDefault();const id=win.dataset.app;win.remove();setDockRunning(id,false);return;
    }
    if((event.metaKey||event.ctrlKey)&&key==='m'&&win){
      event.preventDefault();win.style.display='none';showToast((appDefs[win.dataset.app]?.title||'Window')+' minimized');return;
    }
    if((event.metaKey||event.ctrlKey)&&event.altKey&&key==='f'){
      event.preventDefault();toggleMaximize(win);return;
    }
    if(event.key==='Escape'&&launcher.classList.contains('show'))closeLauncher();
  });
  document.querySelectorAll('.dock-app').forEach(button=>{
    button.addEventListener('dblclick',()=>{const id=button.dataset.open;if(!id)return;const win=document.querySelector('.app-window[data-app="'+id+'"]');if(win&&win.style.display==='none'){win.style.display='block';win.style.zIndex=++z;}});
  });
})();
