const layer=document.getElementById('windowLayer');
const launcher=document.getElementById('launcher');
const backdrop=document.getElementById('launcherBackdrop');
const search=document.getElementById('launcherSearch');
const toastEl=document.getElementById('toast');
let z=30;
const appDefs={
 files:{title:'Files',body:`<div class="app-content"><h2>My Files</h2><p style="color:#687187">Browse your folders</p><div class="file-list"><div class="file-item"><span>📁</span>Documents</div><div class="file-item"><span>🖼️</span>Pictures</div><div class="file-item"><span>⬇️</span>Downloads</div><div class="file-item"><span>🎵</span>Music</div><div class="file-item"><span>🎬</span>Videos</div><div class="file-item"><span>💾</span>Disk</div></div>`},
 browser:{title:'Browser',body:`<div class="app-content"><h2>Welcome to MAC Browser</h2><p>Browser window concept. Web browsing integration will come in a later OS milestone.</p><div style="padding:14px;border-radius:10px;background:#edf1fb;color:#687187">🔒 Search or enter a URL (prototype only)</div></div>`},
 settings:{title:'Settings',body:`<div class="settings-layout"><aside class="settings-sidebar"><button class="active">Appearance</button><button>Desktop</button><button>Sound</button><button>Network</button><button>About</button></aside><div><h2>Appearance</h2><p style="color:#687187">Personalize your MAC desktop</p><div class="setting-row"><div><b>Dark appearance</b><div style="font-size:11px;color:#788196">Use a darker system theme</div></div><button class="switch" aria-label="Dark appearance"></button></div><div class="setting-row"><div><b>Dock magnification</b><div style="font-size:11px;color:#788196">Enlarge icons on hover</div></div><button class="switch on" aria-label="Dock magnification"></button></div><div class="setting-row"><div><b>Desktop widgets</b><div style="font-size:11px;color:#788196">Show desktop widgets</div></div><button class="switch" aria-label="Desktop widgets"></button></div><div class="setting-row"><div><b>Accent color</b></div><div style="display:flex;gap:7px"><i style="background:#6686f6;width:18px;height:18px;border-radius:50%"></i><i style="background:#df76ad;width:18px;height:18px;border-radius:50%"></i><i style="background:#56bf9c;width:18px;height:18px;border-radius:50%"></i></div></div></div></div>`},
 terminal:{title:'Terminal',body:`<div class="terminal"><div>MAC OS Prototype Terminal</div><div>Welcome. Commands are simulated in this preview.</div><div>$ <input placeholder="try: help" /></div></div>`},
 notes:{title:'Notes',body:`<div class="app-content"><h2>Quick Notes</h2><textarea class="notes-area" placeholder="Start typing…"></textarea></div>`},
 about:{title:'About MAC OS',body:`<div class="app-content" style="text-align:center;padding-top:30px"><div style="font-size:56px">⌘</div><h2>MAC OS</h2><p>Desktop prototype 0.1</p><p style="color:#687187">A personal Linux-based operating system concept, with its own design language.</p></div>`}
};
function showToast(text){toastEl.textContent=text;toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),1900)}
function openApp(id){const def=appDefs[id];if(!def)return;closeLauncher();let existing=document.querySelector('.app-window[data-app="'+id+'"]');if(existing){existing.style.zIndex=++z;existing.style.display='block';return;}
const win=document.createElement('article');win.className='app-window';win.dataset.app=id;win.style.zIndex=++z;win.innerHTML=`<div class="window-titlebar"><div class="window-controls"><button class="win-control close" aria-label="Close"></button><button class="win-control minimize" aria-label="Minimize"></button><button class="win-control maximize" aria-label="Maximize"></button></div><div class="window-title">${def.title}</div></div><div class="window-content">${def.body}</div>`;layer.appendChild(win);
win.querySelector('.close').onclick=()=>win.remove();
win.querySelector('.minimize').onclick=()=>{win.style.display='none';showToast(def.title+' minimized')};
win.querySelector('.maximize').onclick=()=>{win.classList.toggle('maximized');if(win.classList.contains('maximized')){win.style.cssText+=';left:0;top:0;transform:none;width:100%;height:100%'}else{win.style.left='50%';win.style.top='50%';win.style.transform='translate(-50%,-50%)';win.style.width='min(620px,calc(100vw - 30px))';win.style.height='min(440px,calc(100dvh - 140px))'}};
win.addEventListener('mousedown',()=>win.style.zIndex=++z);
const bar=win.querySelector('.window-titlebar');let dragging=false,dx=0,dy=0;
bar.addEventListener('pointerdown',e=>{if(win.classList.contains('maximized'))return;dragging=true;dx=e.clientX-win.offsetLeft;dy=e.clientY-win.offsetTop;bar.setPointerCapture(e.pointerId)});
bar.addEventListener('pointermove',e=>{if(!dragging)return;win.style.left=(e.clientX-dx+win.offsetWidth/2)+'px';win.style.top=(e.clientY-dy+win.offsetHeight/2)+'px';win.style.transform='translate(-50%,-50%)'});
bar.addEventListener('pointerup',()=>dragging=false);
win.querySelectorAll('.switch').forEach(s=>s.onclick=()=>s.classList.toggle('on'));
win.querySelectorAll('.settings-sidebar button').forEach(b=>b.onclick=()=>{win.querySelectorAll('.settings-sidebar button').forEach(x=>x.classList.remove('active'));b.classList.add('active');showToast(b.textContent+' settings (demo)')});
const input=win.querySelector('.terminal input');if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter'){showToast(input.value==='help'?'Commands: help, clear, about':'Simulated command: '+input.value);input.value=''}});
}
document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>openApp(el.dataset.open)));
function toggleLauncher(){launcher.classList.toggle('show');backdrop.classList.toggle('show');if(launcher.classList.contains('show')){search.value='';filterApps('');search.focus()}}
function closeLauncher(){launcher.classList.remove('show');backdrop.classList.remove('show')}
document.getElementById('launcherToggle').onclick=toggleLauncher;backdrop.onclick=closeLauncher;
search.addEventListener('input',()=>filterApps(search.value));
function filterApps(q){document.querySelectorAll('.launcher-app').forEach(btn=>btn.style.display=btn.textContent.toLowerCase().includes(q.toLowerCase())?'grid':'none')}
document.getElementById('controlCenter').onclick=()=>showToast('Control Center · Wi-Fi · Sound · Brightness');
document.getElementById('systemMenu').onclick=()=>showToast('MAC system menu · About · Settings · Restart');
document.querySelectorAll('.menu-label').forEach(b=>b.onclick=()=>showToast(b.dataset.menu+' menu (prototype)'));
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key===' '){e.preventDefault();toggleLauncher()}if(e.key==='Escape')closeLauncher()});
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
