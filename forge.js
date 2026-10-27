var AU={ctx:null,voice:1,trk:'celt',on:1,mus:1,sfx:1,mv:.5,sv:.8,last:{},step:0,nt:0},TO={m:'',k:'',t:0};
function silentWav(){var n=800,b=new ArrayBuffer(44+n),v=new DataView(b),i;function w(o,s){for(var k=0;k<s.length;k++)v.setUint8(o+k,s.charCodeAt(k))}
 w(0,'RIFF');v.setUint32(4,36+n,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,8000,true);v.setUint32(28,8000,true);v.setUint16(32,1,true);v.setUint16(34,8,true);w(36,'data');v.setUint32(40,n,true);for(i=0;i<n;i++)v.setUint8(44+i,128);return URL.createObjectURL(new Blob([b],{type:'audio/wav'}))}
function auInit(){try{if(!AU.ctx){var C=window.AudioContext||window.webkitAudioContext;if(!C)return;var c=new C(),cp=c.createDynamicsCompressor(),ms=c.createGain(),i;ms.gain.value=1.8;AU.ctx=c;AU.mg=c.createGain();AU.sg=c.createGain();AU.mg.connect(cp);AU.sg.connect(cp);cp.connect(ms);ms.connect(c.destination);
   var b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.nz=b;auVol();AU.nt=c.currentTime+.2;AU.tm=setInterval(musTick,100)}
  var x=AU.ctx;try{navigator.audioSession.type='playback'}catch(e){}
  if(!AU.el){try{var a=document.createElement('audio');a.src=silentWav();a.loop=true;a.setAttribute('playsinline','');var pr=a.play();if(pr&&pr.catch)pr.catch(function(){});AU.el=a}catch(e){}}
  if(x.state!='running'){var rs=x.resume();if(rs&&rs.then)rs.then(auUi,function(){})}
  var s=x.createBufferSource();s.buffer=x.createBuffer(1,1,22050);s.connect(x.destination);s.start(0);auUi()}catch(e){}}
function auVol(){if(!AU.ctx)return;AU.mg.gain.value=AU.on&&AU.mus?AU.mv*.55:0;AU.sg.gain.value=AU.on&&AU.sfx?AU.sv:0}
function tone(f,t,d,ty,g,out,lp){var c=AU.ctx,o=c.createOscillator(),e=c.createGain(),n=o;o.type=ty;o.frequency.value=f;e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime(g,t+.006);e.gain.exponentialRampToValueAtTime(.0001,t+d);
 if(lp){var q=c.createBiquadFilter();q.type='lowpass';q.frequency.value=lp;o.connect(q);n=q}n.connect(e);e.connect(out);o.start(t);o.stop(t+d+.05)}
function nburst(t,d,f,q,g,out){var c=AU.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),e=c.createGain();s.buffer=AU.nz;fl.type='bandpass';fl.frequency.value=f;fl.Q.value=q;e.gain.setValueAtTime(g,t);e.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(e);e.connect(out);s.start(t,Math.random()*.5);s.stop(t+d+.02)}
var MEL=[587.33,440,349.23,440,349.23,293.66,329.63,392,493.88,440,392,329.63,349.23,440,523.25,587.33,523.25,440,392,349.23,329.63,293.66,0,0],BAS=[146.83,164.81,174.61,196];
function whs(f,t,d){var c=AU.ctx,o=c.createOscillator(),l=c.createOscillator(),lg=c.createGain(),e=c.createGain();o.type='sine';o.frequency.value=f;l.frequency.value=5.2;lg.gain.value=f*.006;l.connect(lg);lg.connect(o.frequency);
 e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime(.2,t+.04);e.gain.setValueAtTime(.2,t+Math.max(.05,d-.1));e.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(e);e.connect(AU.mg);o.start(t);l.start(t);o.stop(t+d+.05);l.stop(t+d+.05);
 nburst(t,Math.min(d,.25),f*2,2,.05,AU.mg);tone(f*2,t,d*.8,'triangle',.03,AU.mg)}
var CEV={0:[659.25,2],2:[659.25,1],3:[587.33,1],4:[523.25,2],6:[440,1],7:[523.25,1],8:[587.33,2],10:[587.33,1],11:[523.25,1],12:[493.88,2],14:[392,1],15:[493.88,1],16:[523.25,2],18:[659.25,1],19:[783.99,1],20:[880,3],23:[783.99,1],24:[659.25,2],26:[587.33,1],27:[523.25,1],28:[493.88,2],30:[440,2]};
function musTick(){var c=AU.ctx;if(!c)return;if(c.state!='running'||!AU.on||!AU.mus){AU.nt=Math.max(AU.nt,c.currentTime+.1);return}
 var cel=AU.trk=='celt',e=cel?60/110/2:60/84/3;
 while(AU.nt<c.currentTime+.35){var t=AU.nt,s,f;
  if(cel){s=AU.step%32;var m=s%8,ev=CEV[s];
   if(ev)whs(ev[0],t,ev[1]*e*.95);
   if(m==0||m==3||m==4)tone(m==4?95:80,t,.2,'sine',.5,AU.mg);
   if(m==4)nburst(t,.09,2200,1,.12,AU.mg);else nburst(t,.03,5000,1,.05,AU.mg);
   if(s%16==0){tone(110,t,e*16,'sawtooth',.03,AU.mg,300);tone(164.81,t,e*16,'sawtooth',.02,AU.mg,300)}
   if(m==0){var rt=[110,87.31,98,110][(s/8)|0];tone(rt,t,.5,'triangle',.25,AU.mg,500);tone(rt*2,t,.25,'sine',.05,AU.mg)}}
  else{s=AU.step%24;f=MEL[s];
   if(f){tone(f,t,.55,'triangle',.2,AU.mg,2400);tone(f*2,t,.2,'sine',.04,AU.mg)}
   if(s%6==0){var bf=BAS[(s/6)|0];tone(bf/2,t,.9,'triangle',.28,AU.mg,600);tone(bf,t,.5,'sine',.1,AU.mg);tone(85,t,.16,'sine',.45,AU.mg)}
   else if(s%3==0)nburst(t,.05,2200,1,.08,AU.mg);
   if(s==0)tone(73.42,t,e*22,'sawtooth',.03,AU.mg,320)}
  AU.nt+=e;AU.step++}}
function say(t,i){if(!AU.voice||!AU.on||!window.speechSynthesis)return;try{var u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';u.rate=1.05;u.pitch=.75+(((i||0)*37)%7)/10;u.volume=.9;speechSynthesis.speak(u)}catch(e){}}
function setTrk(n){AU.trk=n;AU.step=0;auInit();auUi()}
function togV(){AU.voice=!AU.voice;auInit();auUi();if(AU.voice)say('Pas mou, le caillou !',0)}
function sfx(k,v){var c=AU.ctx;if(!c||!AU.on||!AU.sfx||c.state!='running')return;var t=c.currentTime,n=performance.now(),o=AU.sg;v=v==null?.7:v;
 if(k=='hit'||k=='wood'){if(n-(AU.last[k]||0)<50)return;AU.last[k]=n;
  if(k=='hit'){nburst(t,.05,1700+Math.random()*1800,3,.5*v+.08,o);tone(150+Math.random()*60,t,.07,'sine',.35*v,o)}
  else{nburst(t,.09,650+Math.random()*250,2,.55*v,o);tone(110,t,.1,'sine',.3*v,o)}}
 else if(k=='throw'){nburst(t,.28,500,.8,.3,o);nburst(t+.05,.2,1400,1,.12,o)}
 else if(k=='good')[523.25,659.25].forEach(function(f,i){tone(f,t+i*.11,.4,'triangle',.22,o,3000)});
 else if(k=='big')[523.25,659.25,783.99,1046.5].forEach(function(f,i){tone(f,t+i*.09,.6,'triangle',.24,o,3500);tone(f*2,t+i*.09,.3,'sine',.05,o)});
 else if(k=='bad')[329.63,261.63].forEach(function(f,i){tone(f,t+i*.2,.5,'sawtooth',.14,o,900)});
 else if(k=='win'){[392,493.88,587.33,783.99,987.77].forEach(function(f,i){tone(f,t+i*.14,.7,'triangle',.24,o,3500);tone(f/2,t+i*.14,.5,'sine',.1,o)});[392,493.88,587.33].forEach(function(f){tone(f,t+.75,1.3,'triangle',.16,o,3000)})}
 else if(k=='lose')[293.66,277.18,261.63,246.94].forEach(function(f,i){tone(f,t+i*.28,.7,'sawtooth',.16,o,700)})}
function togA(){AU.on=!AU.on;auInit();auVol();auUi()}
function togM(){AU.mus=!AU.mus;auInit();auVol();auUi()}
function togS(){AU.sfx=!AU.sfx;auInit();auVol();auUi();if(AU.sfx)sfx('hit',.8)}
function auUi(){[['sn',AU.on],['bm',AU.mus],['bs',AU.sfx],['bv',AU.voice],['tk1',AU.trk=='celt'],['tk0',AU.trk!='celt']].forEach(function(a){var e=document.getElementById(a[0]);if(e)e.setAttribute('aria-pressed',!!a[1])});var ok=AU.ctx&&AU.ctx.state=='running',sn=document.getElementById('sn'),st=document.getElementById('ast');if(sn)sn.classList.toggle('lock',!ok);if(st)st.textContent=!AU.ctx?'Touchez l’écran une fois pour activer le son.':ok?'Son actif. Si vous n’entendez rien, vérifiez le volume et le mode silencieux de l’appareil.':'Son bloqué par le navigateur : touchez « Tester le son ».'}
['click','touchend','pointerup','keydown'].forEach(function(ev){document.addEventListener(ev,function(){if(!AU.ctx||AU.ctx.state!='running')auInit()},true)});setInterval(function(){auUi()},1500);
document.addEventListener('visibilitychange',function(){if(AU.ctx)document.hidden?AU.ctx.suspend():AU.ctx.resume()});
function toast(m,kd){var el=document.getElementById('toast');if(!el)return;if(!m){el.className='toast';return}
 el.className='toast show '+(kd=='w'?'win':kd=='l'?'lose':kd=='g'?'good':kd=='b'?'bad':'');el.innerHTML=(kd=='l'?'Défaite… ':'')+m;clearTimeout(TO.t);if(kd!='w'&&kd!='l')TO.t=setTimeout(function(){el.className='toast'},kd?4200:2200)}
function cue(kd,m){if(kd=='w')sfx('win');else if(kd=='l')sfx('lose');else if(kd=='g'){var bg=/Cul de Chouette/.test(m);sfx(bg?'big':'good');if(bg)say('Cul de chouette !',G.c)}else if(kd=='b')sfx('bad')}
var HL=[],sheet='';try{HL=JSON.parse(localStorage.getItem('fad')||'[]')}catch(x){}
function hpush(e){e.d=Date.now();HL.push(e);if(HL.length>300)HL.shift();try{localStorage.setItem('fad',JSON.stringify(HL))}catch(x){}rh()}
function pt(h){var e=document.createElement('div');e.innerHTML=h;return e.textContent}
function hist(){var p=G.P[G.c];hpush({g:G.gid,r:G.rd,p:p.n,t:pt(G.m),s:G.P.map(function(q){return q.n+' '+q.s})})}
function rh(){var el=document.getElementById('hl');if(!el)return;el.innerHTML=HL.length?HL.slice().reverse().slice(0,60).map(function(e){return'<div class="he"><b>'+(e.r?'Tour '+e.r+' · ':'')+eh(e.p)+'</b><br>'+eh(e.t)+(e.s&&e.s.length?'<br><span class="nt">'+eh(e.s.join(' · '))+'</span>':'')+'</div>'}).join(''):'<p class="nt">Aucun lancer pour le moment.</p>'}
function cph(){var m=document.getElementById('hm');try{navigator.clipboard.writeText(JSON.stringify(HL)).then(function(){m.textContent='Historique copié. Collez-le dans l’artefact Historique.'},function(){m.textContent='Copie refusée par le navigateur.'})}catch(x){m.textContent='Copie impossible ici.'}}
function clh(){HL=[];try{localStorage.removeItem('fad')}catch(x){}rh()}
function openSh(n){sheet=n;[].forEach.call(document.querySelectorAll('.sc'),function(s){s.classList.toggle('on',s.id=='s-'+n)});document.getElementById('shT').textContent={des:'Dés',jr:'Joueurs',rg:'Règles du Cul de Chouette',hs:'Historique'}[n];document.getElementById('sh').classList.toggle('live',n=='des');document.getElementById('sh').classList.add('open');if(n=='jr')sjr();if(n=='hs')rh()}
function closeSh(){sheet='';document.getElementById('sh').classList.remove('open')}
function sjr(){document.getElementById('pl').innerHTML=G.P.map(function(p,i){return'<div class="pl"><span>'+eh(p.n)+(p.b?' (robot)':'')+(p.dc?'<i class="pdie" style="--c:'+p.dc.col+';--k:'+p.dc.ink+'" title="Ses dés"></i>':'')+'</span><span class="pla">'+(p.b?'':'<button class="b" aria-pressed="'+(G.ed===i)+'" onclick="edP('+i+')">Style</button>')+(G.on?'':'<button class="b" onclick="delP('+i+')">Retirer</button>')+'</span></div>'}).join('')||'<p class="nt">Aucun joueur pour le moment.</p>';document.getElementById('qt').style.display=G.on?'block':'none';mkSeat()}
function rg(){var hd=document.getElementById('hud'),old=hd.querySelector('.cards'),sl=old?old.scrollLeft:0;
 if(G.P.length){var HC=['#d4a63a','#4f8fd9','#5cb85c','#d96ca8','#a06cd5','#4fc2c2','#e08a3e','#9aa0a6'];
  hd.innerHTML=(G.on?'<div class="mt"><span>Tour<b>'+G.rd+'</b></span><span>Objectif<b>'+G.t+'</b></span></div>':'')+'<div class="cards">'+G.P.map(function(q,i){var ci=BN.indexOf(q.n);if(ci<0)ci=(q.n.length*7+q.n.charCodeAt(0))%8;var col=q.b?CH[ci].t:q.ap?q.ap.t:HC[i%8],o=PS[q.n]||(PS[q.n]={v:q.s,to:q.s});o.to=q.s;var pc=Math.max(0,Math.min(100,o.v/G.t*100));
   return'<div class="pc'+(G.on&&i==G.c?' on':'')+'"><div class="pt"><i class="dot" style="--c:'+col+'"></i><span class="pn2">'+eh(q.n)+'</span></div><b class="ps" data-k="'+eh(q.n)+'" data-v="'+q.s+'">'+Math.round(o.v)+'</b><u class="pb"><s style="width:'+pc+'%"></s></u>'+(q.cv||q.gr?'<div class="bg">'+(q.cv?'<em>Civet</em>':'')+(q.gr?'<em>Grelottine</em>':'')+'</div>':'')+'</div>'}).join('')+'</div>';
  var cs=hd.querySelector('.cards'),a=cs.querySelector('.pc.on');cs.scrollLeft=sl;if(a&&cs.scrollTo)cs.scrollTo({left:a.offsetLeft-(cs.clientWidth-a.offsetWidth)/2,behavior:'smooth'});
  if(G.on&&G.m!==TO.m){TO.m=G.m;toast(G.m,G.kd);var key=G.rd+'.'+G.c+(G.kd||'');if(TO.k!==key){TO.k=key;cue(G.kd,G.m)}}}
 else hd.innerHTML='';
 if(!G.on){toast('');TO.m=''}
 document.getElementById('ax').innerHTML=G.a;if(sheet=='jr')sjr()}
var PS={};
function hudTick(){[].forEach.call(document.querySelectorAll('#hud .ps'),function(e){var o=PS[e.dataset.k];if(!o)return;o.to=+e.dataset.v;var d=o.to-o.v;if(Math.abs(d)<.5)o.v=o.to;else o.v+=d*.1;e.textContent=Math.round(o.v);var b=e.parentNode.querySelector('.pb s');if(b)b.style.width=Math.max(0,Math.min(100,o.v/G.t*100))+'%'});requestAnimationFrame(hudTick)}
function setMode(m){S.mode=m;res('');document.getElementById('bk').style.display=m=='b'?'block':'none';document.getElementById('hn').textContent=m=='b'?'Glissez pour tourner · touchez une face pour la choisir':m=='t'?'Touchez la table pour lancer les dés':'';rg()}
function btn(){if(S.mode=='j'){if(G.wait){var w=G.wait;waitR(0);if(w==2)thr3(G.s3);else lance()}}else roll()}
function waitR(on){G.wait=on;var f=document.querySelector('.fab');if(f)f.classList.toggle('wait',!!on)}
function setP(v){S.pips=v;document.getElementById('st1').setAttribute('aria-pressed',v==1);document.getElementById('st0').setAttribute('aria-pressed',v==0)}
function viewB(){closeSh();setMode('b')}
function endG(){G.on=0;G.a='';waitR(0);if(S.bs)appDS(null);closeSh();setMode('t');initD()}

function pip(v,z){z=z/S.ds;cx.save();cx.rotate(Math.PI/4);var o=.4*z,r=.12*z,ink=cx.fillStyle,Q={1:[[0,0]],2:[[o,-o],[-o,o]],3:[[o,-o],[0,0],[-o,o]],4:[[-o,-o],[o,-o],[-o,o],[o,o]],5:[[-o,-o],[o,-o],[0,0],[-o,o],[o,o]],6:[[-o,-o],[o,-o],[-o,0],[o,0],[-o,o],[o,o]]}[v];
 Q.forEach(function(p){cx.fillStyle="rgba(0,0,0,.42)";cx.beginPath();cx.arc(p[0],p[1],r*1.2,0,7);cx.fill();cx.fillStyle=ink;cx.beginPath();cx.arc(p[0],p[1],r,0,7);cx.fill();var q=cx.createRadialGradient(p[0]-r*.35,p[1]-r*.35,r*.1,p[0],p[1],r);q.addColorStop(0,"rgba(255,255,255,.4)");q.addColorStop(1,"rgba(0,0,0,.3)");cx.fillStyle=q;cx.fill()});cx.fillStyle=ink;cx.restore()}
function fcell(pts,base,k,lm,bw){function path(){cx.beginPath();pts.forEach(function(p,j){j?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1])});cx.closePath()}
 function c(m){return"rgb("+base.map(function(v){return Math.min(255,Math.round(v*m))}).join(",")+")"}
 var x0=0,y0=0,R;pts.forEach(function(p){x0+=p[0]/pts.length;y0+=p[1]/pts.length});R=Math.max.apply(null,pts.map(function(p){return Math.hypot(p[0]-x0,p[1]-y0)}))*.8;
 path();cx.fillStyle=c(k);cx.fill();
 var g=cx.createLinearGradient(x0-R,y0-R,x0+R,y0+R);g.addColorStop(0,"rgba(255,255,255,"+(.06+.2*lm)+")");g.addColorStop(.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(0,0,0,.2)");path();cx.fillStyle=g;cx.fill();
 cx.lineJoin="round";path();cx.strokeStyle=c(Math.min(1.3,k*1.15+.08));cx.lineWidth=bw;cx.stroke();path();cx.strokeStyle="rgba(0,0,0,.4)";cx.lineWidth=1;cx.stroke()}
var NZP=null;function nz(){if(!NZP){var c=document.createElement('canvas');c.width=c.height=96;var x=c.getContext('2d');for(var i=0;i<1100;i++){x.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'255,255,255')+','+Math.random()*.09+')';x.fillRect(Math.random()*96,Math.random()*96,1.6,1.6)}NZP=cx.createPattern(c,'repeat')}return NZP}
function scr(s){var g=cx.createRadialGradient(s[0]-1.2,s[1]-1.2,.5,s[0],s[1],5);g.addColorStop(0,"#f3dc93");g.addColorStop(1,"#6f4f16");cx.fillStyle=g;cx.beginPath();cx.arc(s[0],s[1],4.6,0,7);cx.fill();cx.strokeStyle="rgba(0,0,0,.5)";cx.lineWidth=1;cx.beginPath();cx.moveTo(s[0]-3,s[1]-.8);cx.lineTo(s[0]+3,s[1]+.8);cx.stroke()}
function fgr(){var el=document.getElementById('fg');if(!el)return;el.innerHTML=S.nums.map(function(n,i){return'<button class="fc" aria-pressed="'+(i==S.sel)+'" aria-label="Face '+(i+1)+', numéro '+n+'" onclick="S.sel='+i+';ui()">'+n+'</button>'}).join('')}
function tab(t){[].forEach.call(document.querySelectorAll('.tab'),function(b){b.classList.toggle('on',b.dataset.t==t)});[].forEach.call(document.querySelectorAll('.pane'),function(p){p.classList.toggle('on',p.id=='t-'+t)})}

function hit(x,y){return GL.ok&&S.mode=='b'?glHit(x,y):hit2d(x,y)}
var DS=.45;var GL={ok:0,tried:0,w:0,h:0,sg:'',cm:'',k:0,nf:0,ms:[]};
function glBuild(){var F=S.F,N=F.length,cols=Math.ceil(Math.sqrt(N+1)),T=192,rows=Math.ceil((N+1)/cols),Wp=cols*T,Hp=rows*T,pos=[],nor=[],uv=[],tf=[],fr=[],P=[],E={},i,k,v;
 function vx(p,n,a){pos.push(p[0],p[1],p[2]);nor.push(n[0],n[1],n[2]);uv.push(a[0],a[1])}
 var solid=[((N%cols)*T+T/2)/Wp,1-(Math.floor(N/cols)*T+T/2)/Hp];
 F.forEach(function(f,i){var r=nrm(crs(f.u,f.n)),Rf=0,X=[],Y=[];f.id.forEach(function(t){var d=sub(VV[t],f.c);Rf=Math.max(Rf,Math.hypot(d[0],d[1],d[2]));X.push(dot(d,r));Y.push(dot(d,f.u))});
  fr.push({r:r,Rf:Rf,X:X,Y:Y});P.push(f.id.map(function(t){var d=sub(VV[t],f.c);return[f.c[0]+d[0]*S.bv,f.c[1]+d[1]*S.bv,f.c[2]+d[2]*S.bv]}))});
 function fuv(i,p){var q=fr[i],f=F[i],d=sub(p,f.c),tx=i%cols,ty=Math.floor(i/cols);return[(tx*T+(dot(d,q.r)/(2*q.Rf)+.5)*T)/Wp,1-(ty*T+(.5-dot(d,f.u)/(2*q.Rf))*T)/Hp]}
 F.forEach(function(f,i){var Q=P[i];for(k=1;k<Q.length-1;k++){[0,k,k+1].forEach(function(j){vx(Q[j],f.n,fuv(i,Q[j]))});tf.push(i)}
  f.id.forEach(function(a,k){E[a+'_'+f.id[(k+1)%f.id.length]]=[i,k]})});
 Object.keys(E).forEach(function(key){var s=key.split('_'),a=+s[0],b=+s[1];if(a>b)return;var A=E[key],B=E[b+'_'+a];if(!B)return;
  var LA=F[A[0]].id.length,LB=F[B[0]].id.length,nA=F[A[0]].n,nB=F[B[0]].n,
  q=[[P[A[0]][(A[1]+1)%LA],nA],[P[A[0]][A[1]],nA],[P[B[0]][(B[1]+1)%LB],nB],[P[B[0]][B[1]],nB]];
  [0,1,2,0,2,3].forEach(function(j){vx(q[j][0],q[j][1],solid)});tf.push(-1,-1)});
 for(v=0;v<VV.length;v++){var pts=[],ax=nrm(VV[v]),u0=nrm(crs(ax,Math.abs(ax[0])<.9?[1,0,0]:[0,1,0])),w0=crs(ax,u0),c0=[0,0,0];
  F.forEach(function(f,i){var k=f.id.indexOf(v);if(k>=0){pts.push({p:P[i][k],n:f.n});c0=[c0[0]+P[i][k][0],c0[1]+P[i][k][1],c0[2]+P[i][k][2]]}});
  if(pts.length<3)continue;c0=c0.map(function(x){return x/pts.length});
  pts.forEach(function(o){var d=sub(o.p,c0);o.a=Math.atan2(dot(d,w0),dot(d,u0))});pts.sort(function(x,y){return x.a-y.a});
  for(k=1;k<pts.length-1;k++){[0,k,k+1].forEach(function(j){vx(pts[j].p,pts[j].n,solid)});tf.push(-1)}}
 return{pos:pos,nor:nor,uv:uv,tf:tf,fr:fr,cols:cols,T:T,Wp:Wp,Hp:Hp,N:N}}
function gpip(x,v,h){var o=.5*h,r=.15*h,Q={1:[[0,0]],2:[[o,-o],[-o,o]],3:[[o,-o],[0,0],[-o,o]],4:[[-o,-o],[o,-o],[-o,o],[o,o]],5:[[-o,-o],[o,-o],[0,0],[-o,o],[o,o]],6:[[-o,-o],[o,-o],[-o,0],[o,0],[-o,o],[o,o]]}[v],ink=x.fillStyle;
 Q.forEach(function(p){x.fillStyle='rgba(0,0,0,.5)';x.beginPath();x.arc(p[0],p[1],r*1.22,0,7);x.fill();x.fillStyle=ink;x.beginPath();x.arc(p[0],p[1],r,0,7);x.fill();var g=x.createRadialGradient(p[0]-r*.3,p[1]-r*.3,r*.1,p[0],p[1],r);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(0,0,0,.3)');x.fillStyle=g;x.fill()});x.fillStyle=ink}
function glTex(){var G=GL.g,x=GL.c2.getContext('2d'),T=G.T,i;x.clearRect(0,0,GL.c2.width,GL.c2.height);
 for(i=0;i<=G.N;i++){x.save();x.translate((i%G.cols)*T,Math.floor(i/G.cols)*T);x.beginPath();x.rect(0,0,T,T);x.clip();x.fillStyle=S.col;x.fillRect(0,0,T,T);glOv(x,T,i);
  if(i<G.N){var q=G.fr[i],h=S.F[i].inr/(2*q.Rf)*T,n=S.nums[i],t=String(n),fs=h*1.3*S.ds*(t.length>1?.82:1);x.translate(T/2,T/2);
   if(S.mode=='b'&&i==S.sel){x.strokeStyle='#ffd36b';x.lineWidth=T*.035;x.beginPath();q.X.forEach(function(X,j){var a=X/(2*q.Rf)*T,b=-q.Y[j]/(2*q.Rf)*T;j?x.lineTo(a,b):x.moveTo(a,b)});x.closePath();x.stroke()}
   x.translate(0,S.dy/100*fs);x.rotate(S.dr*Math.PI/180);x.fillStyle=S.ink;
   if(S.pips&&S.k==6&&n>=1&&n<=6){x.rotate(Math.PI/4);gpip(x,n,h*S.ds)}
   else{x.font='700 '+fs+'px Cinzel,Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,0,0);if(t=='6'||t=='9'){var w=x.measureText(t).width/2;x.fillRect(-w*.55,fs*.5,w*1.1,fs*.07)}}}
  x.restore()}
 GL.tex.needsUpdate=true}
function glRebuild(){var d=glBuild();GL.g=d;GL.k=S.k;GL.nf=S.F.length;GL.bv=S.bv;GL.ds=DS;GL.c2.width=d.Wp;GL.c2.height=d.Hp;
 var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(d.pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(d.nor,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(d.uv,2));
 if(GL.geo)GL.geo.dispose();GL.geo=g;GL.ms.forEach(function(m){m.geometry=g});GL.bm.geometry=g;GL.sg=''}
function glMk(){var m=new THREE.Mesh(GL.geo,GL.mat);m.castShadow=true;return m}
var TH=[{n:'Feutre vert',f:'#2f4f2a',k:'200,255,170',r:'#2a1a10',w:'#5a3820'},{n:'Bordeaux',f:'#5e1c27',k:'255,190,190',r:'#17110e',w:'#3d2515'},{n:'Bleu nuit',f:'#1d3156',k:'170,200,255',r:'#241812',w:'#33200f'},{n:'Cuir',f:'#6e4a2a',k:'255,225,180',r:'#1c1410',w:'#45291a'},{n:'Taverne',tv:1,f:'#6b4a2b',r:'#3a2412',w:'#4e3220'}];
var COL=[['Ivoire','#e4dcc8'],['Blanc os','#f3eee2'],['Rubis','#8e1b2a'],['Orange','#c9561a'],['Or','#c9a24b'],['Émeraude','#1f6b45'],['Turquoise','#17868a'],['Saphir','#1d3f8e'],['Améthyste','#5b2f8a'],['Rose','#b83a76'],['Obsidienne','#26262e'],['Graphite','#4b4e55']],INK=[['Orange','#e0861f'],['Or','#f0c24f'],['Ivoire','#f4efe0'],['Noir','#14110f'],['Rouge','#b3261e'],['Argent','#d7d9de']];
function cvs(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return c}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function glTable(){var t=TH[S.tb],g=new THREE.Group(),c,x,i,rc=.36,enc=THREE.sRGBEncoding;GL.em=null;GL.fl=[];GL.seats=[];if(t.tv)return glTav(t);
 c=cvs(256,256);x=c.getContext('2d');x.fillStyle=t.f;x.fillRect(0,0,256,256);
 for(i=0;i<9000;i++){x.fillStyle='rgba('+(Math.random()<.5?'0,0,0':t.k)+','+Math.random()*.1+')';x.fillRect(Math.random()*256,Math.random()*256,1.5,1.5)}
 x.strokeStyle='rgba(0,0,0,.1)';x.lineWidth=1;for(i=0;i<256;i+=4){x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.moveTo(0,i);x.lineTo(256,i);x.stroke()}
 var ft=new THREE.CanvasTexture(c);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(4,3);ft.encoding=enc;
 var felt=new THREE.Mesh(new THREE.PlaneGeometry(2*TW,2*TD),new THREE.MeshStandardMaterial({map:ft,roughness:1,envMapIntensity:.3}));felt.rotation.x=-Math.PI/2;felt.receiveShadow=true;g.add(felt);
 c=cvs(1024,720);x=c.getContext('2d');x.strokeStyle='rgba(224,177,62,.55)';x.lineWidth=4;rr(x,16,16,992,688,40);x.stroke();x.strokeStyle='rgba(224,177,62,.25)';x.lineWidth=2;rr(x,34,34,956,652,28);x.stroke();
 var dt=new THREE.CanvasTexture(c);dt.encoding=enc;var dm=new THREE.Mesh(new THREE.PlaneGeometry(2*TW-.5,2*TD-.5),new THREE.MeshBasicMaterial({map:dt,transparent:true,depthWrite:false}));dm.rotation.x=-Math.PI/2;dm.position.y=.004;g.add(dm);
 c=cvs(256,256);x=c.getContext('2d');x.fillStyle=t.r;x.fillRect(0,0,256,256);for(i=0;i<7000;i++){x.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'255,230,200')+','+Math.random()*.09+')';x.fillRect(Math.random()*256,Math.random()*256,2,2)}
 var lt=new THREE.CanvasTexture(c);lt.wrapS=lt.wrapT=THREE.RepeatWrapping;lt.repeat.set(6,1);lt.encoding=enc;var lm=new THREE.MeshStandardMaterial({map:lt,roughness:.45,metalness:0,envMapIntensity:.6});
 var yc=rc*.7,Lx=2*(TW+2*rc),Lz=2*TD;
 [-1,1].forEach(function(s){var a=new THREE.Mesh(new THREE.CylinderGeometry(rc,rc,Lx,28),lm);a.rotation.z=Math.PI/2;a.position.set(0,yc,s*(TD+rc));a.castShadow=true;a.receiveShadow=true;g.add(a);
  var b=new THREE.Mesh(new THREE.CylinderGeometry(rc,rc,Lz,28),lm);b.rotation.x=Math.PI/2;b.position.set(s*(TW+rc),yc,0);b.castShadow=true;b.receiveShadow=true;g.add(b);
  [-1,1].forEach(function(u){var k=new THREE.Mesh(new THREE.SphereGeometry(rc,24,16),lm);k.position.set(s*(TW+rc),yc,u*(TD+rc));k.castShadow=true;g.add(k)})});
 c=cvs(512,128);x=c.getContext('2d');var gr=x.createLinearGradient(0,0,0,128);gr.addColorStop(0,t.w);gr.addColorStop(1,'#1e1209');x.fillStyle=gr;x.fillRect(0,0,512,128);
 for(i=0;i<170;i++){x.strokeStyle='rgba('+(Math.random()<.5?'20,10,2':'210,160,100')+','+Math.random()*.15+')';x.lineWidth=Math.random()*2+.5;var y=Math.random()*128;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(170,y+Math.random()*8-4,340,y+Math.random()*8-4,512,y+Math.random()*6-3);x.stroke()}
 var wt=new THREE.CanvasTexture(c);wt.wrapS=wt.wrapT=THREE.RepeatWrapping;wt.repeat.set(2,1);wt.encoding=enc;var wm=new THREE.MeshStandardMaterial({map:wt,roughness:.5,envMapIntensity:.5}),sw=2*(TW+2*rc)+1.2,sd=2*(TD+2*rc)+1.2;
 var sl=new THREE.Mesh(new THREE.BoxGeometry(sw,.5,sd),wm);sl.position.y=-.26;sl.receiveShadow=true;sl.castShadow=true;g.add(sl);
 var bm=new THREE.MeshStandardMaterial({color:0xc9a24b,metalness:.85,roughness:.35,envMapIntensity:.9});
 [[-1,-1],[1,-1],[-1,1],[1,1],[0,-1],[0,1]].forEach(function(p){var s=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.07,18),bm);s.position.set(p[0]*(sw/2-.3),.025,p[1]*(sd/2-.3));g.add(s)});
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:0x140d08,roughness:1}));fl.rotation.x=-Math.PI/2;fl.position.y=-.52;fl.receiveShadow=true;g.add(fl);
 return g}
function shd(h,k){var a=[1,3,5].map(function(i){return Math.min(255,Math.round(parseInt(h.substr(i,2),16)*k))});return'rgb('+a.join(',')+')'}
function glWood(t,np){var c=cvs(512,512),x=c.getContext('2d'),h=512/np,i,j;
 for(j=0;j<np;j++){var g=x.createLinearGradient(0,j*h,0,(j+1)*h),k=.85+Math.random()*.3;g.addColorStop(0,shd(t,k));g.addColorStop(1,shd(t,k*.82));x.fillStyle=g;x.fillRect(0,j*h,512,h);
  for(i=0;i<26;i++){x.strokeStyle='rgba('+(Math.random()<.6?'25,12,4':'220,170,110')+','+(.05+Math.random()*.14)+')';x.lineWidth=.6+Math.random()*1.6;var y=j*h+Math.random()*h;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(170,y+Math.random()*6-3,340,y+Math.random()*6-3,512,y+Math.random()*4-2);x.stroke()}
  x.fillStyle='rgba(15,7,2,.7)';x.fillRect(0,j*h,512,2);x.fillRect(Math.random()*512,j*h,2,h)}
 for(i=0;i<4;i++){x.strokeStyle='rgba(20,10,3,.22)';x.lineWidth=2;x.beginPath();x.arc(60+Math.random()*390,60+Math.random()*390,14+Math.random()*6,0,7);x.stroke()}
 var tx=new THREE.CanvasTexture(c);tx.encoding=THREE.sRGBEncoding;tx.anisotropy=4;return tx}
function glMug(wd,fe){var g=new THREE.Group(),a=new THREE.Mesh(new THREE.CylinderGeometry(.4,.34,.9,24),wd);a.position.y=.45;a.castShadow=true;g.add(a);
 [.18,.72].forEach(function(y){var t=new THREE.Mesh(new THREE.TorusGeometry(.34+.06*(y/.9)+.012,.03,8,28),fe);t.rotation.x=Math.PI/2;t.position.y=y;g.add(t)});
 var h=new THREE.Mesh(new THREE.TorusGeometry(.2,.05,8,16,Math.PI),wd);h.rotation.z=-Math.PI/2;h.position.set(.4,.47,0);h.castShadow=true;g.add(h);
 var b=new THREE.Mesh(new THREE.CylinderGeometry(.37,.37,.05,24),new THREE.MeshStandardMaterial({color:0xc98a1a,roughness:.25}));b.position.y=.84;g.add(b);
 var f=new THREE.Mesh(new THREE.SphereGeometry(.36,18,8),new THREE.MeshStandardMaterial({color:0xf2e4c0,roughness:.9}));f.scale.y=.3;f.position.y=.9;g.add(f);return g}
function glChair(m){var g=new THREE.Group();function b(w,h,d,x,y,z){var o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o)}
 b(1.5,.18,1.5,0,-1.59,0);[[-.62,-.62],[.62,-.62],[-.62,.62],[.62,.62]].forEach(function(p){b(.17,1.72,.17,p[0],-2.54,p[1])});
 [-.62,.62].forEach(function(x){b(.17,1.95,.17,x,-.52,-.62)});b(1.5,.3,.14,0,.38,-.62);[-.36,0,.36].forEach(function(x){b(.2,1,.07,x,-.35,-.62)});b(1.35,.09,.09,0,-2.55,.62);return g}
function glFloor(){var c=cvs(512,512),x=c.getContext('2d'),i,j;x.fillStyle='#120d09';x.fillRect(0,0,512,512);
 for(j=0;j<4;j++){var y=j*128,xx=-(j%2)*64;while(xx<512){var w=100+Math.random()*80,v=22+Math.random()*16;x.fillStyle='rgb('+(v+12)+','+(v+6)+','+v+')';x.fillRect(xx+3,y+3,w-6,122);xx+=w}}
 for(i=0;i<9000;i++){x.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'180,150,110')+','+Math.random()*.08+')';x.fillRect(Math.random()*512,Math.random()*512,2,2)}
 var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(10,10);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
function glCandle(g,x,z,iron){var wax=new THREE.MeshStandardMaterial({color:0xe9dcb8,roughness:.8}),c=new THREE.Mesh(new THREE.CylinderGeometry(.17,.19,.9,16),wax);c.position.set(x,.48,z);c.castShadow=true;g.add(c);
 var d=new THREE.Mesh(new THREE.CylinderGeometry(.42,.38,.06,20),iron);d.position.set(x,.03,z);g.add(d);
 var f=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),new THREE.MeshBasicMaterial({color:0xffc864}));f.scale.y=1.9;f.position.set(x,1.06,z);g.add(f);
 var l=new THREE.PointLight(0xffa84a,1.2,10,1.6);l.position.set(x,1.3,z);g.add(l);GL.fl.push({l:l,f:f,b:1.2,i:GL.fl.length*2.3})}
function glTav(t){var g=new THREE.Group(),sw=2*(TW+1.5),sd=2*(TD+1.5),i;GL.fl=[];
 function wm(c,n,s){var x=glWood(c,n);return new THREE.MeshStandardMaterial({map:x,bumpMap:x,bumpScale:s||.9,roughness:.62,envMapIntensity:.4})}
 var w2=wm(t.r,3),w3=wm(t.w,4),fe=new THREE.MeshStandardMaterial({color:0x2c2a28,metalness:.7,roughness:.45,envMapIntensity:.8}),
 pw=new THREE.MeshStandardMaterial({color:0x8a8d90,metalness:.7,roughness:.4,envMapIntensity:.9}),cl=new THREE.MeshStandardMaterial({color:0x6a3f26,roughness:.45,envMapIntensity:.5,side:THREE.DoubleSide}),go=new THREE.MeshStandardMaterial({color:0xd0a33a,metalness:.85,roughness:.3,envMapIntensity:.9});
 function bx(m,w,h,d,x,y,z){var b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=true;b.receiveShadow=true;g.add(b)}
 function put(o,x,z,r,s){o.position.set(x,0,z);o.rotation.y=r||0;if(s)o.scale.set(s,s,s);g.add(o)}
 for(i=0;i<5;i++){var zc=-sd/2+(i+.5)*sd/5;bx(wm(t.f,1),sw,.35,sd/5-.03,0,-.175+(Math.random()-.5)*.012,zc);
  [-1,1].forEach(function(s){var n=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.025,10),fe);n.position.set(s*(sw/2-.18),.012,zc);g.add(n)})}
 bx(w2,sw-.9,.5,sd-.9,0,-.6,0);
 [-1,1].forEach(function(a){[-1,1].forEach(function(b){bx(w2,.7,3.05,.7,a*(sw/2-.55),-1.875,b*(sd/2-.55))})});
 [-1,1].forEach(function(s){bx(w2,2*TW+.9,.3,.45,0,.15,s*(TD+.225));bx(w2,.45,.3,2*TD,s*(TW+.225),.15,0)});
 [[-3.2,TD+.95],[3,TD+.95]].forEach(function(p,i){put(glMug(w3,fe),p[0],p[1],i*1.7+1,.85)});
 var pl=new THREE.Group(),pt=new THREE.Mesh(new THREE.CylinderGeometry(.55,.45,.06,28),pw);pt.position.y=.03;pt.castShadow=true;pl.add(pt);
 var br=new THREE.Mesh(new THREE.SphereGeometry(.36,18,10),new THREE.MeshStandardMaterial({color:0xb98245,roughness:.9}));br.scale.set(1.3,.62,.85);br.position.y=.28;br.castShadow=true;pl.add(br);put(pl,TW+.95,.3,.5,.85);
 var P=[[0,0],[.3,0],[.42,.12],[.45,.45],[.38,.8],[.22,.95],[.25,1.1],[.3,1.14]].map(function(q){return new THREE.Vector2(q[0],q[1])}),jg=new THREE.Group(),jb=new THREE.Mesh(new THREE.LatheGeometry(P,24),cl);jb.castShadow=true;jg.add(jb);
 var jh=new THREE.Mesh(new THREE.TorusGeometry(.26,.055,8,16,Math.PI),cl);jh.rotation.z=-Math.PI/2;jh.position.set(.4,.62,0);jg.add(jh);put(jg,-TW-.95,-.1,1.2,.9);
 [[2.8,-TD-.95],[3.35,-TD-.85]].forEach(function(p,j){for(var k=0;k<3+j;k++){var cn=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.035,16),go);cn.position.set(p[0]+(k%2)*.02,.018+k*.036,p[1]);cn.castShadow=true;g.add(cn)}});
 glCandle(g,TW+.95,2.3,fe);glCandle(g,-TW-.95,-2,fe);
 var cm=wm(t.w,3);
 GL.seats=[[-2.4,-sd/2-.5,.08],[2.4,-sd/2-.45,-.1],[-sw/2-.5,-1.6,Math.PI/2-.1],[sw/2+.5,-2,-Math.PI/2+.12],[-sw/2-.5,2,Math.PI/2+.08],[sw/2+.5,1.6,-Math.PI/2-.1]];GL.seats.forEach(function(p){var c=glChair(cm);c.scale.set(1.35,1,1.15);c.position.set(p[0],0,p[1]);c.rotation.y=p[2];g.add(c)});
 var ft=glFloor(),fl=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.MeshStandardMaterial({map:ft,bumpMap:ft,bumpScale:1.2,roughness:.9}));fl.rotation.x=-Math.PI/2;fl.position.y=-3.42;fl.receiveShadow=true;g.add(fl);
 var N=70,pp=new Float32Array(N*3);for(i=0;i<N;i++){pp[i*3]=(Math.random()-.5)*14;pp[i*3+1]=Math.random()*6;pp[i*3+2]=(Math.random()-.5)*10}
 var eg=new THREE.BufferGeometry();eg.setAttribute('position',new THREE.BufferAttribute(pp,3));GL.em=eg;g.add(new THREE.Points(eg,new THREE.PointsMaterial({size:.07,color:0xffb060,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false})));
 glEnv(g,t,fe);
 return g}
function glStone(){var c=cvs(512,512),x=c.getContext('2d'),i,j;x.fillStyle='#17110c';x.fillRect(0,0,512,512);
 for(j=0;j<8;j++){var xx=-(j%2)*40;while(xx<512){var w=70+Math.random()*60,v=44+Math.random()*24;x.fillStyle='rgb('+(v+8)+','+(v+2)+','+(v-6)+')';x.fillRect(xx+3,j*64+3,w-6,58);
  for(i=0;i<40;i++){x.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'255,240,210')+','+Math.random()*.09+')';x.fillRect(xx+3+Math.random()*(w-6),j*64+3+Math.random()*58,3,3)}xx+=w}}
 var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
function glBarrel(wd,fe){var g=new THREE.Group(),P=[[0,0],[.62,0],[.72,.5],[.76,1.1],[.72,1.7],[.62,2.2],[0,2.2]].map(function(q){return new THREE.Vector2(q[0],q[1])}),b=new THREE.Mesh(new THREE.LatheGeometry(P,20),wd);b.castShadow=true;b.receiveShadow=true;g.add(b);
 [[.25,.68],[.75,.75],[1.45,.75],[1.95,.68]].forEach(function(q){var h=new THREE.Mesh(new THREE.TorusGeometry(q[1],.035,6,24),fe);h.rotation.x=Math.PI/2;h.position.y=q[0];g.add(h)});return g}
function glEnv(g,t,fe){var y0=-3.42,z=-12.5,r=Math.random,st=glStone(),i;
 function M(o){return new THREE.MeshStandardMaterial(o)}
 function bx(m,w,h,d,x,y,zz,sh){var b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,zz);b.receiveShadow=true;if(sh)b.castShadow=true;g.add(b);return b}
 function wd(c,n,rx,ry,rot){var x=glWood(c,n);x.wrapS=x.wrapT=THREE.RepeatWrapping;x.repeat.set(rx||1,ry||1);if(rot){x.center.set(.5,.5);x.rotation=rot}return M({map:x,bumpMap:x,bumpScale:.8,roughness:.7,envMapIntensity:.3})}
 function sto(rx,ry){var s=st.clone();s.needsUpdate=true;s.repeat.set(rx,ry);return M({map:s,bumpMap:s,bumpScale:2,roughness:.95,envMapIntensity:.2})}
 var dk=wd('#2a1a0e',5,4,1),bm=wd('#3a2414',3,1,4,Math.PI/2),cr=wd(t.r,4);
 // Murs de pierre, lambris et poutres
 var wb=new THREE.Mesh(new THREE.PlaneGeometry(36,18),sto(7,3.5));wb.position.set(0,y0+9,-13.1);wb.receiveShadow=true;g.add(wb);
 [-1,1].forEach(function(s){var w=new THREE.Mesh(new THREE.PlaneGeometry(36,18),sto(7,3.5));w.rotation.y=-s*Math.PI/2;w.position.set(s*17.2,y0+9,4.9);w.receiveShadow=true;g.add(w);
  bx(dk,.25,2.4,36,s*17,y0+1.2,4.9);[-3,7].forEach(function(zz){bx(bm,.9,18,.9,s*16.7,y0+9,zz)})});
 bx(dk,36,2.4,.25,0,y0+1.2,-12.95);bx(dk,36,.2,.4,0,y0+2.5,-12.85);
 [-16.6,-9.2,9.2,16.6].forEach(function(x){bx(bm,.9,18,.9,x,y0+9,-12.7)});bx(bm,36,.9,1,0,y0+12.6,-12.6);
 // Cheminée : foyer, manteau, hotte, bûches et feu
 var sm=sto(1.5,1.5);sm.color.set(0xd8c8b0);
 bx(sm,6.4,.35,2.6,0,y0+.175,z+.4);[-1,1].forEach(function(s){bx(sm,1.3,4.6,1.6,s*2.55,y0+2.3,z,1)});
 bx(sm,6.4,1.1,1.8,0,y0+5.15,z,1);bx(dk,7.2,.3,2.1,0,y0+5.85,z+.1,1);bx(sm,5.4,9,1.2,0,y0+10.5,z-.2);
 bx(M({color:0x050302,roughness:1}),3.8,4.4,.2,0,y0+2.4,z-.55);
 [[-.3,.35,0],[.3,-.35,0],[0,0,.28]].forEach(function(q){var l=new THREE.Mesh(new THREE.CylinderGeometry(.16,.18,2.2,8),cr);l.rotation.z=Math.PI/2;l.rotation.y=q[1];l.position.set(q[0],y0+.55+q[2],z+.1);l.castShadow=true;g.add(l)});
 var fl=new THREE.PointLight(0xff7a2a,2.2,20,1.4);fl.position.set(0,y0+1.6,z+1.4);g.add(fl);
 [[-.45,0xe0480c,.32,0],[.4,0xf05a10,.3,0],[0,0xff9a1e,.22,.05],[0,0xffd24a,.12,.1]].forEach(function(q,k){var f=new THREE.Mesh(new THREE.ConeGeometry(q[2],.6,10),new THREE.MeshBasicMaterial({color:q[1],transparent:true,opacity:.92,depthWrite:false,toneMapped:false,fog:false}));f.position.set(q[0],y0+1.15+q[3],z+.15+q[3]*2);g.add(f);GL.fl.push({l:fl,f:f,b:2.2,i:k*1.7+5})});
 [-2.4,2.4].forEach(function(x,k){var m=glMug(cr,fe);m.scale.set(.8,.8,.8);m.rotation.y=k*2.2;m.position.set(x,y0+6,z+.2);g.add(m)});
 // Blason au-dessus du manteau
 var sc=cvs(256,300),q=sc.getContext('2d');q.beginPath();q.moveTo(20,20);q.lineTo(236,20);q.lineTo(236,150);q.quadraticCurveTo(236,250,128,290);q.quadraticCurveTo(20,250,20,150);q.closePath();q.fillStyle='#1d3156';q.fill();q.lineWidth=12;q.strokeStyle='#d0a33a';q.stroke();
 q.fillStyle='#d0a33a';q.beginPath();q.moveTo(60,190);q.lineTo(128,110);q.lineTo(196,190);q.lineTo(196,215);q.lineTo(128,140);q.lineTo(60,215);q.closePath();q.fill();[[80,70],[176,70],[128,240]].forEach(function(p){q.beginPath();q.arc(p[0],p[1],14,0,7);q.fill()});
 var sct=new THREE.CanvasTexture(sc);sct.encoding=THREE.sRGBEncoding;var sh=new THREE.Mesh(new THREE.PlaneGeometry(1.8,2.1),M({map:sct,transparent:true,alphaTest:.5,roughness:.5,metalness:.3}));sh.position.set(0,y0+8.2,-12.08);g.add(sh);
 // Torches murales
 var stk=M({color:0x4a2e18,roughness:.9});
 [-4.1,4.1].forEach(function(x){bx(fe,.25,.6,.3,x,y0+4.6,-12.95);var s=new THREE.Mesh(new THREE.CylinderGeometry(.07,.05,1.1,8),stk);s.position.set(x,y0+5.05,-12.6);s.rotation.x=.45;g.add(s);
  var f=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8),new THREE.MeshBasicMaterial({color:0xffb04a,toneMapped:false,fog:false}));f.position.set(x,y0+5.6,-12.35);g.add(f);
  var l=new THREE.PointLight(0xff9a3a,1.1,10,1.6);l.position.set(x,y0+5.8,-11.9);g.add(l);GL.fl.push({l:l,f:f,b:1.1,i:x*3})});
 // Étagères à bouteilles
 [-6.6,6.6].forEach(function(x){bx(dk,2.8,.12,.6,x,y0+5.6,-12.65);[-1,1].forEach(function(s){bx(dk,.1,.4,.5,x+s*1.2,y0+5.35,-12.7)});
  for(i=0;i<5;i++){var h=.45+r()*.35,gm=M({color:[0x1e4a22,0x4a2a10,0x6b4a14,0x203a4a][Math.floor(r()*4)],roughness:.15,metalness:.1,envMapIntensity:1.2}),bo=new THREE.Mesh(new THREE.CylinderGeometry(.12,.13,h,12),gm),nk=new THREE.Mesh(new THREE.CylinderGeometry(.04,.06,.22,8),gm);
   bo.position.set(x-1.05+i*.52,y0+5.66+h/2,-12.62);nk.position.set(bo.position.x,y0+5.77+h,-12.62);g.add(bo);g.add(nk)}});
 // Tonneaux et caisses
 var bw=glWood(t.w,7);bw.center.set(.5,.5);bw.rotation=Math.PI/2;var bmt=M({map:bw,bumpMap:bw,bumpScale:.8,roughness:.65,side:THREE.DoubleSide,envMapIntensity:.4});
 [[-6.2,-11.4,0],[-7.7,-11.1,.8],[-6.9,-9.9,1.9]].forEach(function(p){var b=glBarrel(bmt,fe);b.position.set(p[0],y0,p[1]);b.rotation.y=p[2];g.add(b)});
 var lb=glBarrel(bmt,fe);lb.rotation.z=Math.PI/2;lb.position.set(-5.85,y0+2.95,-11.25);g.add(lb);
 [[6.4,y0+.7,-11.3,1.4,.1],[7.6,y0+.6,-9.9,1.2,-.3],[6.5,y0+2,-11.25,1.2,.35]].forEach(function(c){bx(cr,c[3],c[3],c[3],c[0],c[1],c[2],1).rotation.y=c[4]});
 // Bannières
 var bc=cvs(256,512),x=bc.getContext('2d');x.beginPath();x.moveTo(0,0);x.lineTo(256,0);x.lineTo(256,512);x.lineTo(128,430);x.lineTo(0,512);x.closePath();x.fillStyle='#6b1420';x.fill();
 x.save();x.clip();for(i=0;i<3000;i++){x.fillStyle='rgba('+(r()<.5?'0,0,0':'255,200,180')+','+r()*.08+')';x.fillRect(r()*256,r()*512,2,2)}x.restore();
 x.strokeStyle='#d0a33a';x.lineWidth=10;x.beginPath();x.moveTo(16,0);x.lineTo(16,478);x.lineTo(128,408);x.lineTo(240,478);x.lineTo(240,0);x.stroke();
 x.save();x.translate(128,200);x.rotate(Math.PI/4);x.fillStyle='#d0a33a';x.fillRect(-55,-55,110,110);x.fillStyle='#6b1420';[[-25,-25],[25,-25],[0,0],[-25,25],[25,25]].forEach(function(p){x.beginPath();x.arc(p[0],p[1],10,0,7);x.fill()});x.restore();
 var bt=new THREE.CanvasTexture(bc);bt.encoding=THREE.sRGBEncoding;var bn=M({map:bt,transparent:true,alphaTest:.5,side:THREE.DoubleSide,roughness:.95});
 [-12.9,12.9].forEach(function(xx){var p=new THREE.Mesh(new THREE.PlaneGeometry(2,4),bn);p.position.set(xx,y0+8.4,-12.75);g.add(p);var rd=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,2.5,8),fe);rd.rotation.z=Math.PI/2;rd.position.set(xx,y0+10.45,-12.7);g.add(rd)});
 // Tapis sous la table
 var rt=new THREE.CanvasTexture(glRug());rt.encoding=THREE.sRGBEncoding;rt.anisotropy=8;var rug=new THREE.Mesh(new THREE.PlaneGeometry(17,12),M({map:rt,alphaTest:.5,roughness:1}));rug.rotation.x=-Math.PI/2;rug.position.y=y0+.015;rug.receiveShadow=true;g.add(rug)}
// Tapis ancien : franges, bordure indigo à motifs, champ bordeaux usé, médaillon central
function glRug(){var W=1024,H=720,F=44,c=cvs(W,H),x=c.getContext('2d'),r=Math.random,i,j,k;
 x.strokeStyle='#c9b48a';x.lineWidth=2;for(i=4;i<H;i+=7){var l=F-4-r()*10;x.beginPath();x.moveTo(F,i);x.lineTo(F-l,i+r()*3-1.5);x.moveTo(W-F,i);x.lineTo(W-F+l,i+r()*3-1.5);x.stroke()}
 function rect(a,b,w,h,col){x.fillStyle=col;x.fillRect(a,b,w,h)}
 var X0=F,Y0=0,RW=W-2*F,RH=H;rect(X0,Y0,RW,RH,'#2a1310');
 rect(X0+10,10,RW-20,RH-20,'#1a1f2c');
 function band(o,w){x.strokeStyle='#9a7a44';x.lineWidth=w;x.strokeRect(X0+o,o,RW-2*o,RH-2*o)}
 band(14,3);band(70,3);
 for(k=0;k<2;k++){var o=42,n=k?Math.round((RH-2*o)/40):Math.round((RW-2*o)/40);for(i=0;i<=n;i++){var p=i/n;[[0,1],[1,-1]].forEach(function(s){var px=k?X0+(s[0]?RW-o:o):X0+o+p*(RW-2*o),py=k?o+p*(RH-2*o):(s[0]?RH-o:o);
  x.save();x.translate(px,py);x.rotate(Math.PI/4);x.fillStyle=i%2?'#7a2e22':'#a8834a';x.fillRect(-9,-9,18,18);x.fillStyle='#1a1f2c';x.fillRect(-3,-3,6,6);x.restore()})}}
 var fx=X0+80,fy=80,fw=RW-160,fh=RH-160;rect(fx,fy,fw,fh,'#47201a');
 for(j=0;j<fh;j+=6){x.fillStyle='rgba('+(r()<.5?'30,8,6':'120,60,40')+','+(r()*.12)+')';x.fillRect(fx,fy+j,fw,6)}
 band(80,2);band(88,1);
 var cx0=W/2,cy0=H/2;function star(R,col,rot){x.save();x.translate(cx0,cy0);x.rotate(rot||0);x.fillStyle=col;x.fillRect(-R,-R,2*R,2*R);x.rotate(Math.PI/4);x.fillRect(-R,-R,2*R,2*R);x.restore()}
 x.save();x.translate(cx0,cy0);x.scale(1.5,1);x.translate(-cx0,-cy0);star(120,'#9a7a44');star(114,'#1a1f2c');star(84,'#7a2e22');star(58,'#a8834a');star(52,'#1a1f2c');x.restore();
 x.fillStyle='#a8834a';x.beginPath();x.arc(cx0,cy0,16,0,7);x.fill();
 [[fx,fy,0],[fx+fw,fy,Math.PI/2],[fx+fw,fy+fh,Math.PI],[fx,fy+fh,-Math.PI/2]].forEach(function(q){x.save();x.translate(q[0],q[1]);x.rotate(q[2]);x.fillStyle='#9a7a44';x.beginPath();x.moveTo(0,0);x.arc(0,0,92,0,Math.PI/2);x.fill();x.fillStyle='#1a1f2c';x.beginPath();x.moveTo(0,0);x.arc(0,0,86,0,Math.PI/2);x.fill();x.fillStyle='#7a2e22';x.beginPath();x.moveTo(0,0);x.arc(0,0,48,0,Math.PI/2);x.fill();x.restore()});
 x.fillStyle='rgba(168,131,74,.35)';for(i=0;i<70;i++){var a=fx+20+r()*(fw-40),b=fy+20+r()*(fh-40);if(Math.abs(a-cx0)<200&&Math.abs(b-cy0)<130)continue;x.fillRect(a-5,b-1,10,2);x.fillRect(a-1,b-5,2,10)}
 for(j=0;j<H;j+=3){x.fillStyle='rgba(0,0,0,'+(.04+r()*.05)+')';x.fillRect(X0,j,RW,1)}
 var wr=x.createRadialGradient(cx0,cy0,60,cx0,cy0,W*.55);wr.addColorStop(0,'rgba(210,180,140,.14)');wr.addColorStop(1,'rgba(0,0,0,.25)');x.fillStyle=wr;x.fillRect(X0,0,RW,RH);
 for(i=0;i<16000;i++){x.fillStyle='rgba('+(r()<.5?'0,0,0':'230,200,160')+','+r()*.09+')';x.fillRect(X0+r()*RW,r()*RH,2,2)}
 return c}
var CH=[{t:'#7a3b2a',h:'#4a2c17',a:0,b:0,s:'#e2b48c'},{t:'#2f5a3a',h:'#a2431e',a:1,b:1,s:'#d9a27a'},{t:'#5a2f6b',h:'#9a9a9a',a:3,b:1,s:'#e0b08a'},{t:'#2b4c7e',h:'#caa45a',a:2,b:0,s:'#e6bf99'},{t:'#8a6a1f',h:'#2a1b10',a:4,b:0,s:'#c98f66'},{t:'#6b2a2a',h:'#3b3b3b',a:0,b:1,s:'#e2b48c'},{t:'#2f6d6b',h:'#6a4a2a',a:1,b:0,s:'#d9a27a'},{t:'#4a4a52',h:'#2a1b10',a:2,b:1,s:'#e0b08a'}];
function glLimb(g,a,b,r,m){var A=new THREE.Vector3(a[0],a[1],a[2]),B=new THREE.Vector3(b[0],b[1],b[2]),d=B.clone().sub(A),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),10),m);o.position.copy(A).add(B).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());o.castShadow=true;g.add(o)}
// Textures partagées : trame de tissu et mèches de cheveux (servent aussi de relief)
function glTexF(){if(GL.ctx)return GL.ctx;var c=cvs(128,128),x=c.getContext('2d'),i;x.fillStyle='#f2f2f2';x.fillRect(0,0,128,128);
 for(i=0;i<128;i+=2){x.fillStyle='rgba(0,0,0,'+(.02+Math.random()*.03)+')';x.fillRect(0,i,128,1);x.fillStyle='rgba(0,0,0,'+(.01+Math.random()*.02)+')';x.fillRect(i,0,1,128)}
 for(i=0;i<900;i++){x.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'255,255,255')+','+Math.random()*.05+')';x.fillRect(Math.random()*128,Math.random()*128,2,2)}
 var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(6,6);t.anisotropy=4;GL.ctx=t;return t}
function glTexH(){if(GL.htx)return GL.htx;var c=cvs(128,128),x=c.getContext('2d'),i;x.fillStyle='#ececec';x.fillRect(0,0,128,128);
 for(i=0;i<260;i++){var X=Math.random()*128;x.strokeStyle='rgba(0,0,0,'+(.08+Math.random()*.15)+')';x.lineWidth=1;x.beginPath();x.moveTo(X,0);x.bezierCurveTo(X+Math.random()*10-5,40,X+Math.random()*10-5,90,X+Math.random()*8-4,128);x.stroke()}
 var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,1);GL.htx=t;return t}
// Personnage assis : origine au niveau du plateau, regard vers +z. Bras articulés épaule > coude > main.
function glFig(c,nm){var g=new THREE.Group(),tr=new THREE.Group(),hd=new THREE.Group(),ct=glTexF(),ht=glTexH();
 function M(col,r,m,tx){var o={color:new THREE.Color(col).convertSRGBToLinear(),roughness:r==null?.85:r,metalness:m||0};if(tx){o.map=tx;o.bumpMap=tx;o.bumpScale=tx===ht?.25:.12}return new THREE.MeshStandardMaterial(o)}
 var tun=M(c.t,.9,0,ct),skin=M(c.s,.55),hair=M(c.h,.75,0,ht),dk=M('#2a1b12',.8),tro=M('#2e2a26',.9,0,ct),lea=M('#3a2414',.6),mt=M('#9aa0a6',.35,.85),gd=M('#d0a33a',.3,.85),lip=M(shd(c.s,.78),.5),wh=M('#f2ece0',.3),ir=M('#2a1b12',.2);
 tun.side=THREE.DoubleSide;
 function mesh(p,geo,m,x,y,z,sx,sy,sz){var o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(sx)o.scale.set(sx,sy,sz);o.castShadow=true;p.add(o);return o}
 function S(r){return new THREE.SphereGeometry(r,20,14)}
 function L(p){return new THREE.LatheGeometry(p.map(function(q){return new THREE.Vector2(q[0],q[1])}),24)}
 // Bassin et jambes assises, bottes
 mesh(g,S(.5),tro,0,-1.22,.05,1.1,.55,1);
 [-.3,.3].forEach(function(x){var X=x*1.05;glLimb(g,[x,-1.22,.1],[X,-1.25,1.2],.21,tro);mesh(g,S(.19),tro,X,-1.27,1.2);glLimb(g,[X,-1.3,1.2],[X,-2.95,1.12],.15,tro);
  glLimb(g,[X,-2.25,1.16],[X,-3.08,1.12],.175,lea);mesh(g,S(.18),lea,X,-3.22,1.32,1,.75,1.9)});
 // Buste, jupe de la tunique, ceinture, col, cou
 tr.position.set(0,-1,-.05);g.add(tr);var sw=[.86,1,1.16][c.w==null?1:c.w];tr.scale.set(sw,1,sw);
 mesh(tr,L([[0,-.05],[.44,-.05],[.46,.25],[.42,.7],[.47,1.2],[.54,1.7],[.56,2.02],[.42,2.28],[.17,2.38],[0,2.4]]),tun,0,0,0,1,1,.62);
 mesh(tr,L([[.45,.05],[.5,-.2],[.62,-.55]]),tun,0,0,.02,1,1,.85);
 mesh(tr,new THREE.CylinderGeometry(.47,.47,.13,24),lea,0,.05,0,1,1,.64);mesh(tr,new THREE.BoxGeometry(.16,.13,.05),gd,0,.05,.3);
 mesh(tr,new THREE.TorusGeometry(.19,.04,8,20),tun,0,2.33,0).rotation.x=Math.PI/2;
 mesh(tr,new THREE.CylinderGeometry(.12,.14,.36,14),skin,0,2.48,0);
 if(c.k){var cpm=M(c.k,.9,0,ct);cpm.side=THREE.DoubleSide;mesh(tr,new THREE.CylinderGeometry(.6,.85,2.3,18,1,true,Math.PI/2,Math.PI),cpm,0,1.12,-.03,1,1,.78);
  mesh(tr,new THREE.TorusGeometry(.45,.08,8,20),cpm,0,2.25,0,1,.66,1).rotation.x=Math.PI/2;[-1,1].forEach(function(s){mesh(tr,S(.065),gd,s*.33,2.18,.27)})}
 // Bras : au repos, avant-bras posés à plat sur la table
 var arms=[];
 [1,-1].forEach(function(s){var sh=new THREE.Group();sh.position.set(s*.6,2.2,0);sh.rotation.order='YXZ';tr.add(sh);mesh(sh,S(.21),tun,0,0,0,1,.9,.9);
  glLimb(sh,[0,0,0],[0,-1.08,0],.155,tun);var el=new THREE.Group();el.position.set(0,-1.08,0);sh.add(el);mesh(el,S(.14),tun,0,0,0);
  glLimb(el,[0,0,0],[0,-.86,0],.125,tun);mesh(el,new THREE.CylinderGeometry(.14,.14,.12,14),lea,0,-.84,0);mesh(el,new THREE.CylinderGeometry(.075,.08,.14,10),skin,0,-.95,0);
  var hg=new THREE.Group();hg.position.set(0,-1.02,0);el.add(hg);var pm=mesh(hg,S(.1),skin,0,-.1,0,.85,1.2,.55);mesh(hg,S(.085),skin,0,-.2,-.02,.95,.75,.75);glLimb(hg,[-s*.07,-.04,.02],[-s*.12,-.14,.06],.032,skin);
  sh.rotation.x=-.25;el.rotation.x=-1.32;arms.push({sh:sh,el:el,hg:hg,pm:pm})});
 // Tête : crâne ovale, mâchoire, oreilles, yeux, sourcils, nez, lèvres
 hd.position.set(0,3.04,0);hd.scale.set(1/sw,1,1/sw);tr.add(hd);
 mesh(hd,S(.36),skin,0,0,0,.92,1.12,1);mesh(hd,S(.27),skin,0,-.16,.07,1,.82,.95);
 [-1,1].forEach(function(s){mesh(hd,S(.075),skin,s*.33,-.02,0,.45,1,.8);mesh(hd,S(.055),wh,s*.115,.04,.325,1,.72,.55);mesh(hd,S(.028),ir,s*.115,.04,.35);
  mesh(hd,new THREE.BoxGeometry(.12,.026,.03),hair,s*.115,.125,.33).rotation.z=-s*.12});
 mesh(hd,S(.06),skin,0,-.03,.355,.75,1.5,1.1);mesh(hd,S(.045),skin,0,-.1,.39);mesh(hd,new THREE.BoxGeometry(.13,.028,.04),lip,0,-.18,.32);
 // Pilosité
 if(c.b==1||c.b==3||c.b===true)mesh(hd,S(.29),hair,0,-.2,.1,1,.85,.75);
 if(c.b==2)[-1,1].forEach(function(s){mesh(hd,new THREE.CylinderGeometry(.022,.03,.15,8),hair,s*.065,-.135,.35).rotation.z=s*1.25});
 if(c.b==3)mesh(hd,new THREE.ConeGeometry(.22,.62,14),hair,0,-.6,.16).rotation.x=Math.PI;
 if(c.l&&c.a!=1&&c.a!=5)mesh(hd,S(.36),hair,0,-.2,-.14,1,1.35,.72);
 if(c.a==0||c.a==3||c.a==6)mesh(hd,new THREE.SphereGeometry(.38,20,12,0,Math.PI*2,0,Math.PI*.5),hair,0,.03,-.02,.97,1.13,1.05).rotation.x=-.4;
 // Coiffes
 if(c.a==1){mesh(hd,new THREE.SphereGeometry(.46,20,12,0,Math.PI*2,0,Math.PI*.6),M(c.t,.9,0,ct),0,.02,-.07,1,1.05,1).rotation.x=-.5;mesh(tr,new THREE.CylinderGeometry(.42,.64,.4,18),M(c.t,.9,0,ct),0,2.28,-.02,1,1,.72)}
 if(c.a==2){mesh(hd,new THREE.SphereGeometry(.41,20,12,0,Math.PI*2,0,Math.PI*.5),mt,0,.04,0,.97,1.1,1.04);mesh(hd,new THREE.TorusGeometry(.4,.03,6,24),mt,0,.04,0,.97,1.04,1).rotation.x=Math.PI/2;mesh(hd,new THREE.BoxGeometry(.05,.28,.04),mt,0,-.04,.41)}
 if(c.a==3){mesh(hd,new THREE.CylinderGeometry(.33,.35,.18,10,1,true),gd,0,.36,0);for(var i=0;i<6;i++){var a=i/6*6.283;mesh(hd,new THREE.ConeGeometry(.055,.2,6),gd,Math.cos(a)*.33,.54,Math.sin(a)*.33)}mesh(hd,S(.04),M('#a01828',.2),0,.36,.35)}
 if(c.a==4){mesh(hd,new THREE.CylinderGeometry(.6,.6,.04,24),tun,0,.33,0);mesh(hd,new THREE.ConeGeometry(.32,.75,20),tun,0,.72,-.03).rotation.x=-.12}
 if(c.a==6){mesh(hd,new THREE.SphereGeometry(.36,16,8),M(c.k||'#6b1420',.9,0,ct),.04,.33,-.02,1.15,.32,1.1).rotation.z=-.25;mesh(hd,new THREE.ConeGeometry(.04,.55,6),M('#f3e6c4',.8),.32,.53,-.05).rotation.z=-.7}
 // Accessoires
 if(c.x==1){var sb=new THREE.Group();mesh(sb,new THREE.BoxGeometry(.08,1.6,.025),mt,0,.8,0);mesh(sb,new THREE.BoxGeometry(.45,.06,.09),gd,0,0,0);mesh(sb,new THREE.CylinderGeometry(.04,.04,.32,8),dk,0,-.19,0);mesh(sb,S(.055),gd,0,-.38,0);sb.position.set(.35,2.0,-.45);sb.rotation.z=Math.PI+.55;tr.add(sb)}
 if(c.x==2){var sg2=new THREE.Group();mesh(sg2,new THREE.CylinderGeometry(.62,.62,.08,28),M(c.k||c.t,.6,0,ct),0,0,0);mesh(sg2,new THREE.TorusGeometry(.62,.045,6,28),gd,0,0,0).rotation.x=Math.PI/2;mesh(sg2,S(.13),gd,0,.05,0);sg2.rotation.z=Math.PI/2;sg2.position.set(-1.25,-2.8,.55);g.add(sg2)}
 if(c.x==3){mesh(g,new THREE.CylinderGeometry(.05,.06,5.4,10),M('#5a3a1e',.8),1.15,-.72,.8);mesh(g,S(.15),new THREE.MeshBasicMaterial({color:0x9fd8ff,toneMapped:false}),1.15,2.12,.8)}
 // Prénom sans fond : lettres dorées cerclées de sombre
 var cv2=cvs(512,128),x=cv2.getContext('2d');x.font='700 60px Cinzel,Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=10;x.strokeStyle='rgba(10,6,3,.85)';x.strokeText(nm,256,66);
 x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=8;x.fillStyle='#f3dc93';x.fillText(nm,256,66);
 var tt=new THREE.CanvasTexture(cv2);tt.encoding=THREE.sRGBEncoding;var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tt,transparent:true,depthWrite:false}));sp.scale.set(2.8,.7,1);sp.position.set(0,3.35,0);g.add(sp);
 var mk=new THREE.Mesh(new THREE.ConeGeometry(.16,.3,8),new THREE.MeshBasicMaterial({color:0xffc84a}));mk.rotation.x=Math.PI;mk.position.set(0,3.85,0);mk.visible=false;g.add(mk);
 // Chope tenue par l'anse dans la main gauche, posée droite sur la table au repos
 var mo=new THREE.Group(),mi=glMug(M('#7a5230',.7),M('#3a3633',.5,.6));mi.rotation.y=Math.PI;mo.add(mi);mo.scale.set(.5,.5,.5);mo.rotation.x=Math.PI/2;mo.position.set(.26,-.12,-.15);arms[1].hg.add(mo);
 g.userData={tr:tr,hd:hd,mk:mk,arm:arms[0].sh,arm2:arms[1].sh,el:arms[0].el,el2:arms[1].el,hg2:arms[1].hg,mg:mo,mgP:mo.position.clone(),mgR:mo.rotation.clone(),mgS:mo.scale.clone(),hn:arms[0].pm};return g}
// Gorgée : hors de son tour, le personnage plie le coude et porte la chope à sa bouche ; la chope reste droite pendant la montée puis s'incline
function glDrink(o,t,act){var u=o.f.userData;if(o.nd==null)o.nd=t+2+Math.random()*8;
 function pose(e){var tl=e<.6?0:(e-.6)/.4*.83;u.arm2.rotation.set(-.25-.75*e,.6*e,0);u.el2.rotation.x=-1.32-.88*e;u.hg2.rotation.x=1.63*e-tl;u.hd.rotation.x=-.15*e}
 function rs(){o.dk=0;pose(0)}
 if(act||o.th){if(o.dk)rs();return}
 if(!o.dk&&t>o.nd)o.dk=t;if(!o.dk)return;
 var k=(t-o.dk)/3.2;if(k>=1){rs();o.nd=t+5+Math.random()*10;return}
 function sm(x){return x*x*(3-2*x)}pose(k<.35?sm(k/.35):k<.7?1:sm(1-(k-.7)/.3))}
function glFigs(){GL.fg.children.slice().forEach(function(o){GL.fg.remove(o)});GL.figs=[];
 G.P.forEach(function(p){var s=GL.seats[p.seat];if(!s)return;var ci=BN.indexOf(p.n);if(ci<0)ci=(p.n.length*7+p.n.charCodeAt(0))%8;var f=glFig(p.ap||CH[ci],p.n);f.position.set(s[0],0,s[1]);f.rotation.y=s[2];GL.fg.add(f);GL.figs.push({f:f,p:p})})}
function thrH(list,si){var p=G.on?G.P[G.c]:null,o=null;if(GL.ok&&GL.fg&&GL.fg.visible&&p)GL.figs.forEach(function(f){if(f.p===p)o=f});
 if(!o||o.th){list.forEach(function(d,k){thr(d,(si||0)+k)});sfx('throw');S.rt=true;return}
 list.forEach(function(d){d.v=2});o.th={t0:performance.now()/1000,list:list,rel:0}}
function glRel(list,v){var T=30,r=Math.random;sfx('throw');list.forEach(function(d){d.v=0;d.in=0;d.x=v.x+(r()-.5)*.2;d.z=v.z+(r()-.5)*.2;d.h=Math.max(v.y,.5);var tx=(r()-.5)*TW*1.1,tz=(r()-.5)*TD*1.1;d.vx=(tx-d.x)/T;d.vz=(tz-d.z)/T;d.vh=.11;d.w=[r()-.5,r()-.5,r()-.5].map(function(x){return x*.8})});S.rt=true}
function glThrowAnim(o,t){var u=o.f.userData,h=o.th;if(!h)return;
 if(!G.on){h.list.forEach(function(d){d.v=1});o.th=null;return}
 var ph=t-h.t0,th,k;
 if(ph<.45){k=ph/.45;th=-2.1*(1-(1-k)*(1-k))}else if(ph<.7){k=(ph-.45)/.25;th=-2.1+1.75*k*k}else{k=Math.min(1,(ph-.7)/.5);th=-.35*(1-k*k*(3-2*k))}
 u.arm.rotation.x=-.25+th;if(ph>.45&&ph<.9)u.tr.rotation.x+=.12;o.f.updateMatrixWorld(true);
 var v=new THREE.Vector3();u.hn.getWorldPosition(v);
 if(!h.rel){if(ph>=.7){h.rel=1;glRel(h.list,v)}else h.list.forEach(function(d,i){d.x=v.x+(i-(h.list.length-1)/2)*.2;d.z=v.z;d.h=Math.max(v.y,.4)})}
 if(ph>1.2){o.th=null;u.arm.rotation.x=-.25}}
// Réactions : Chouette velute = taper deux fois sur les genoux ; Suite = coup de poing sur la table
// Avant de réagir, le personnage repose sa chope sur la table ; il la reprend à la fin du geste
function glReact(p,k){(GL.figs||[]).forEach(function(o){if(o.p!==p)return;var u=o.f.userData;o.rx={k:k,t0:performance.now()/1000};o.dk=0;
 if(u.mg.parent===u.hg2){u.arm2.rotation.set(-.25-u.tr.rotation.x,0,0);u.el2.rotation.x=-1.32;u.hg2.rotation.x=0;u.hd.rotation.x=0;o.f.updateMatrixWorld(true);o.f.attach(u.mg)}})}
function glReactAnim(o,t){var r=o.rx;if(!r)return;var u=o.f.userData,k=(t-r.t0)/1.2;
 function sm(x){return x*x*(3-2*x)}
 if(k>=1){o.rx=null;u.arm.rotation.set(-.25,0,0);u.arm2.rotation.set(-.25-u.tr.rotation.x,0,0);u.el.rotation.x=u.el2.rotation.x=-1.32;u.hg2.rotation.x=0;
  if(u.mg.parent!==u.hg2){u.hg2.add(u.mg);u.mg.position.copy(u.mgP);u.mg.rotation.copy(u.mgR);u.mg.scale.copy(u.mgS)}return}
 if(r.k=='cv'){var env=k<.15?k/.15:k>.85?(1-k)/.15:1,w=.5-.5*Math.cos(k*Math.PI*4),d=w*env;
  u.arm.rotation.set(-.25+.6*d,0,0);u.arm2.rotation.set(-.25+.6*d,0,0);u.el.rotation.x=u.el2.rotation.x=-1.32+.62*d;u.hd.rotation.x=.15*d;u.tr.rotation.x+=.08*d;
  if(w>.95&&!r.s){r.s=1;sfx('hit',.45)}if(w<.5)r.s=0}
 else{var up=k<.55?sm(k/.55):Math.max(0,1-(k-.55)/.1);u.arm.rotation.x=-.25-.9*up;u.el.rotation.x=-1.32+.4*up;if(!r.s&&k>.64){r.s=1;sfx('wood',.9)}}}
function glAnim(b){var t=performance.now()/1000;GL.fl.forEach(function(o){o.l.intensity=o.b*S.li*(.85+.15*Math.sin(t*9+o.i)+.08*Math.sin(t*23+o.i*3));o.f.scale.y=1.8+.35*Math.sin(t*11+o.i)});
 GL.figs.forEach(function(o,i){var u=o.f.userData,act=G.on&&G.P[G.c]===o.p;u.tr.rotation.x=.03*Math.sin(t*1.3+i)+(act?.1:0);var L=u.tr.rotation.x;u.arm.rotation.set(-.25-L,0,0);u.el.rotation.x=-1.32;if(!o.dk&&!o.rx){u.arm2.rotation.set(-.25-L,0,0);u.el2.rotation.x=-1.32;u.hg2.rotation.x=0}u.hd.rotation.y=.28*Math.sin(t*.7+i*2);u.hd.rotation.x=act?.12*Math.sin(t*3):0;u.mk.visible=!!act;u.mk.position.y=3.85+.08*Math.sin(t*4);glDrink(o,t,act||o.rx);glThrowAnim(o,t);glReactAnim(o,t)});
 if(GL.em&&!b){var a=GL.em.attributes.position,i;for(i=0;i<a.count;i++){a.array[i*3+1]+=.004;a.array[i*3]+=Math.sin(t+i)*.0015;if(a.array[i*3+1]>6)a.array[i*3+1]=0}a.needsUpdate=true}}
var FIN=[{n:'Brillant',m:[.32,0,.7,.15]},{n:'Mat',m:[.85,0,0,.5]},{n:'Satiné',m:[.55,.05,.25,.5]},{n:'Métal',m:[.28,.85,.3,.3]},{n:'Nacré',m:[.2,.2,1,.1],tx:2},{n:'Marbré',m:[.3,0,.8,.12],tx:1},{n:'Bois',m:[.7,0,0,.5],tx:3},{n:'Moucheté',m:[.4,0,.5,.2],tx:4},{n:'Paillettes',m:[.3,.3,.8,.15],tx:5},{n:'Cristal',m:[.1,0,1,.05],tr:.72}];
function glOv(x,T,i){var t=FIN[S.fin]&&FIN[S.fin].tx;if(!t)return;var sd=i*7919+S.fin*131+7,r=function(){sd=(sd*1664525+1013904223)>>>0;return sd/4294967296},k;
 if(t==1){for(k=0;k<7;k++){x.strokeStyle=k%2?'rgba(255,255,255,.32)':'rgba(0,0,0,.22)';x.lineWidth=.8+r()*2.2;x.beginPath();x.moveTo(r()*T,0);x.bezierCurveTo(r()*T,T*.33,r()*T,T*.66,r()*T,T);x.stroke()}}
 else if(t==2){[['255,150,200',.2],['120,220,255',.2],['255,225,140',.18]].forEach(function(c){var g=x.createRadialGradient(r()*T,r()*T,2,T/2,T/2,T*.8);g.addColorStop(0,'rgba('+c[0]+','+c[1]+')');g.addColorStop(1,'rgba('+c[0]+',0)');x.fillStyle=g;x.fillRect(0,0,T,T)})}
 else if(t==3){for(k=0;k<34;k++){x.strokeStyle=r()<.6?'rgba(30,15,5,.16)':'rgba(255,220,170,.14)';x.lineWidth=.6+r()*1.6;var y=r()*T;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(T*.3,y+r()*8-4,T*.6,y+r()*8-4,T,y+r()*6-3);x.stroke()}}
 else if(t==4){for(k=0;k<170;k++){x.fillStyle=r()<.5?'rgba(0,0,0,.28)':'rgba(255,255,255,.3)';x.beginPath();x.arc(r()*T,r()*T,.7+r()*1.8,0,7);x.fill()}}
 else if(t==5){for(k=0;k<110;k++){x.fillStyle=r()<.5?'rgba(255,255,255,.9)':'rgba(255,215,120,.9)';x.beginPath();x.arc(r()*T,r()*T,.5+r()*1.1,0,7);x.fill()}}}
function glFin(){var f=FIN[S.fin]||FIN[0],P=f.m,m=GL.mat;m.roughness=P[0];m.metalness=P[1];m.clearcoat=P[2];m.clearcoatRoughness=P[3];m.transparent=!!f.tr;m.opacity=f.tr||1;m.side=f.tr?THREE.DoubleSide:THREE.FrontSide;m.needsUpdate=true;GL.sg=''}
function mkFn(){var el=document.getElementById('fn');el.innerHTML='';FIN.forEach(function(f,i){var b=document.createElement('button');b.className='b';b.textContent=f.n;b.onclick=function(){setF(i)};el.appendChild(b)})}
function setDS(v){var n=document.getElementById('dsn'),e=document.getElementById('dsl');if(G.on||S.rt){if(n)n.textContent='Disponible hors partie, quand les dés sont posés.';if(e)e.value=Math.round(DS*100);return}
 if(n)n.textContent='';DS=v;build(S.k);if(GL.bm)GL.bm.scale.set(.95/DS,.95/DS,.95/DS)}
function glInit(){GL.tried=1;try{if(!window.THREE)return;var r=new THREE.WebGLRenderer({antialias:true});r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.15;
 var d=r.domElement;d.style.pointerEvents='none';cv.parentNode.insertBefore(d,cv);GL.r=r;GL.sc=new THREE.Scene();GL.sc.background=new THREE.Color(0x0b0806);GL.sc.fog=new THREE.FogExp2(0x0b0806,.016);GL.cam=new THREE.PerspectiveCamera(40,1,.1,100);GL.m4=new THREE.Matrix4();
 try{var es=new THREE.Scene();es.add(new THREE.Mesh(new THREE.SphereGeometry(30,16,8),new THREE.MeshBasicMaterial({color:0x2b2118,side:THREE.BackSide})));
  [[0xfff0d0,6,10,.4,6,-6,12,6],[0xfff6ea,3,.4,8,6,12,6,-2],[0xffe0b0,2,8,.4,8,2,10,-8]].forEach(function(q){var m=new THREE.Mesh(new THREE.BoxGeometry(q[2],q[3],q[4]),new THREE.MeshBasicMaterial({color:new THREE.Color(q[0]).multiplyScalar(q[1])}));m.position.set(q[5],q[6],q[7]);es.add(m)});
  var pm=new THREE.PMREMGenerator(r);GL.sc.environment=pm.fromScene(es,.03).texture;pm.dispose()}catch(e){}
 GL.hl=new THREE.HemisphereLight(0xfff0d8,0x1a1008,.55);GL.sc.add(GL.hl);
 var sp=new THREE.SpotLight(0xffe2b8,1.5,70,.72,.7,1);sp.position.set(-3,13,5);sp.castShadow=true;sp.shadow.mapSize.set(2048,2048);sp.shadow.bias=-.0005;sp.shadow.camera.near=4;sp.shadow.camera.far=40;GL.sc.add(sp);GL.sp=sp;
 GL.c2=document.createElement('canvas');GL.tex=new THREE.CanvasTexture(GL.c2);GL.tex.encoding=THREE.sRGBEncoding;GL.tex.anisotropy=Math.min(8,r.capabilities.getMaxAnisotropy());
 GL.mat=new THREE.MeshPhysicalMaterial({map:GL.tex,roughness:.32,metalness:0,clearcoat:.7,clearcoatRoughness:.15,envMapIntensity:.9});
 GL.tbi=S.tb;GL.tb=glTable();GL.sc.add(GL.tb);GL.dg=new THREE.Group();GL.sc.add(GL.dg);GL.fg=new THREE.Group();GL.sc.add(GL.fg);GL.figs=[];GL.seats=GL.seats||[];
 GL.bm=new THREE.Mesh(new THREE.BufferGeometry(),GL.mat);GL.bm.castShadow=true;GL.bm.scale.set(.95/DS,.95/DS,.95/DS);GL.sc.add(GL.bm);GL.ok=1}catch(e){GL.ok=0;console.error(e)}}
function glHit(x,y){var W=cv.clientWidth,H=cv.clientHeight,rc=new THREE.Raycaster();rc.setFromCamera({x:x/W*2-1,y:-(y/H)*2+1},GL.cam);var h=rc.intersectObject(GL.bm)[0];return h&&h.faceIndex!=null?GL.g.tf[h.faceIndex]:-1}
function glDraw(){var W=cv.clientWidth,H=cv.clientHeight,b=S.mode=='b',i,R;if(!W||!H)return;
 if(GL.k!=S.k||GL.nf!=S.F.length||GL.bv!=S.bv||GL.ds!==DS)glRebuild();if(GL.fin!=S.fin){GL.fin=S.fin;glFin()}if(GL.tbi!==S.tb){GL.sc.remove(GL.tb);GL.tb=glTable();GL.sc.add(GL.tb);GL.tbi=S.tb;GL.bs=null}var bs=GL.seats.length?G.P.map(function(p){var a=p.ap;return p.n+'@'+p.seat+(a?KEYS.map(function(k){return a[k]}).join():'')}).join('|'):'';if(bs!==GL.bs){GL.bs=bs;glFigs()}GL.sp.intensity=1.5*S.li;GL.hl.intensity=.55*S.li;
 var sg=[S.col,S.ink,S.pips,S.ds,S.dr,S.dy,S.sel,b,S.fin,S.nums.join()].join('|');if(sg!=GL.sg){GL.sg=sg;glTex()}
 if(W!=GL.w||H!=GL.h){GL.w=W;GL.h=H;GL.r.setSize(W,H,false);GL.cam.aspect=W/H;GL.cam.updateProjectionMatrix();GL.cm=''}
 var key=(b?'b':'t')+W+'/'+S.tb;if(GL.cm!=key){GL.cm=key;
  if(b){GL.cam.position.set(0,0,4.9);GL.cam.lookAt(0,0,0)}
  else{var vf=GL.cam.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*W/H),el=.96,ex=TH[S.tb].tv?TW+2.7:TW+1.3,ey=TH[S.tb].tv?TD+2.4:TD+1.2,dist=Math.max(ex/Math.tan(hf/2),ey*Math.sin(el)/Math.tan(vf/2))*1.08;GL.cam.position.set(0,dist*Math.sin(el),.3+dist*Math.cos(el));GL.cam.lookAt(0,0,.3)}}
 GL.tb.visible=!b;GL.dg.visible=!b;GL.fg.visible=!b;GL.bm.visible=b;glMatUpd();if(GL.mt)GL.mt.visible=!b;
 function q(m,M){GL.m4.set(M[0][0],M[0][1],M[0][2],0,M[1][0],M[1][1],M[1][2],0,M[2][0],M[2][1],M[2][2],0,0,0,0,1);m.quaternion.setFromRotationMatrix(GL.m4)}
 if(b)q(GL.bm,S.R);
 else{S.dice.forEach(function(d,i){var m=GL.ms[i];if(!m){m=glMk();GL.ms[i]=m;GL.dg.add(m)}m.visible=true;m.position.set(d.x,d.h,d.z);q(m,d.R)});for(i=S.dice.length;i<GL.ms.length;i++)GL.ms[i].visible=false}
 glAnim(b);GL.r.render(GL.sc,GL.cam);cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height)}

var ICO={4:'<svg viewBox="0 0 24 24"><path d="M12 3L21 19H3z"/><path d="M12 3L12 14L3 19M12 14L21 19"/></svg>',6:'<svg viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12L4 7.5M12 12v9"/></svg>',8:'<svg viewBox="0 0 24 24"><path d="M12 2L21 12L12 22L3 12z"/><path d="M3 12H21"/></svg>',10:'<svg viewBox="0 0 24 24"><path d="M12 2l8 7-8 13L4 9z"/><path d="M4 9h16M12 2v20"/></svg>',12:'<svg viewBox="0 0 24 24"><path d="M12 3l8.5 6.2-3.2 10H6.7L3.5 9.2z"/><path d="M12 8l4 3-1.5 4.7h-5L8 11z"/></svg>',20:'<svg viewBox="0 0 24 24"><path d="M12 2l8.7 5v10L12 22l-8.7-5V7z"/><path d="M12 7l4.3 7.5H7.7z"/></svg>'};
function gem(c,on,fn,l){var b=document.createElement('button');b.className='gem';b.style.setProperty('--c',c);b.setAttribute('aria-label',l);b.setAttribute('aria-pressed',on);b.onclick=fn;return b}
function mkSw(){var sw=document.getElementById('sw'),ik=document.getElementById('ik');sw.innerHTML='';ik.innerHTML='';
 COL.forEach(function(c){sw.appendChild(gem(c[1],c[1]==S.col,function(){S.col=c[1];document.getElementById('pk').value=c[1];mkSw()},c[0]))});
 INK.forEach(function(c){ik.appendChild(gem(c[1],c[1]==S.ink,function(){S.ink=c[1];document.getElementById('pk2').value=c[1];mkSw()},c[0]))})}
function setF(n){S.fin=n;[].forEach.call(document.querySelectorAll('#fn .b'),function(b,i){b.setAttribute('aria-pressed',i==n)})}
var PH=(1+Math.sqrt(5))/2,Z0=1/(5+2*Math.sqrt(5)),cv=document.getElementById("cv"),cx=cv.getContext("2d"),dpr=window.devicePixelRatio||1;
var S={ds:1,dr:0,dy:0,bv:.85,fin:0,tb:4,li:1,mode:"t",cnt:3,k:6,pips:1,col:"#e4dcc8",ink:"#e0861f",sel:0,F:[],nums:[],R:[[1,0,0],[0,1,0],[0,0,1]],vx:0,vy:0,down:false,rolling:false,vis:[]};
function sg(a,b){return a.map(function(x){return b.map(function(y){return[x,y]})}).reduce(function(p,q){return p.concat(q)})}
function verts(k){var v=[],i,a,b,c;
 if(k==4)v=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]];
 else if(k==6)for(a=-1;a<2;a+=2)for(b=-1;b<2;b+=2)for(c=-1;c<2;c+=2)v.push([a,b,c]);
 else if(k==8)v=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 else if(k==10){for(i=0;i<10;i++)v.push([Math.cos(i*Math.PI/5),Math.sin(i*Math.PI/5),(i%2?-1:1)*Z0]);v.push([0,0,1],[0,0,-1])}
 else if(k==12){for(a=-1;a<2;a+=2)for(b=-1;b<2;b+=2){for(c=-1;c<2;c+=2)v.push([a,b,c]);v.push([0,a/PH,b*PH],[a/PH,b*PH,0],[b*PH,0,a/PH])}}
 else for(a=-1;a<2;a+=2)for(b=-1;b<2;b+=2)v.push([0,a,b*PH],[a,b*PH,0],[b*PH,0,a]);
 var m=Math.max.apply(null,v.map(function(p){return Math.hypot(p[0],p[1],p[2])}));return v.map(function(p){return p.map(function(x){return x/m})})}
function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function crs(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function nrm(a){var l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]}
function hull(V){var F=[],seen={},i,j,k,l,n,d,p,q,s,id,c,u,w;
 for(i=0;i<V.length;i++)for(j=i+1;j<V.length;j++)for(k=j+1;k<V.length;k++){
  n=crs(sub(V[j],V[i]),sub(V[k],V[i]));if(Math.hypot(n[0],n[1],n[2])<1e-9)continue;n=nrm(n);d=dot(n,V[i]);p=q=0;
  for(l=0;l<V.length;l++){s=dot(n,V[l])-d;if(s>1e-4)p++;else if(s<-1e-4)q++}
  if(p&&q)continue;if(p){n=n.map(function(x){return-x});d=-d}
  key=n.map(function(x){return Math.round(x*500)}).join(",");if(seen[key])continue;seen[key]=1;
  id=[];for(l=0;l<V.length;l++)if(Math.abs(dot(n,V[l])-d)<1e-4)id.push(l);
  c=[0,0,0];id.forEach(function(t){c=[c[0]+V[t][0]/id.length,c[1]+V[t][1]/id.length,c[2]+V[t][2]/id.length]});
  u=nrm(sub(V[id[0]],c));w=crs(n,u);
  id.sort(function(a,b){return Math.atan2(dot(sub(V[a],c),w),dot(sub(V[a],c),u))-Math.atan2(dot(sub(V[b],c),w),dot(sub(V[b],c),u))});
  var inr=Math.min.apply(null,id.map(function(t,x){var e=sub(V[id[(x+1)%id.length]],V[t]);return Math.abs(dot(sub(c,V[t]),nrm(crs(n,e))))}));
  F.push({id:id,n:n,c:c,u:u,inr:inr})}
 return F}
var VV=[];
function build(k){S.k=k;VV=verts(k).map(function(p){return p.map(function(x){return x*DS})});S.F=hull(VV);S.sel=0;auto();res("");if(S.dice)initD()}
function auto(){var N=S.F.length,a=[],cnt=1,i,j,b;
 for(i=0;i<N;i++){if(a[i])continue;b=cnt++;a[i]=b;for(j=i+1;j<N;j++)if(!a[j]&&dot(S.F[i].n,S.F[j].n)<-.99){a[j]=N+1-b;break}}
 S.nums=a;ui()}
function seq(){S.nums=S.F.map(function(_,i){return i+1});ui()}
function shuf(){var a=S.nums,i,j,t;for(i=a.length-1;i>0;i--){j=Math.floor(Math.random()*(i+1));t=a[i];a[i]=a[j];a[j]=t}ui()}
function setNum(v){var n=parseInt(v,10);if(!isNaN(n)){S.nums[S.sel]=Math.max(0,Math.min(999,n));ui(1)}}
function step(d){S.nums[S.sel]=Math.max(0,Math.min(999,S.nums[S.sel]+d));ui()}
function ui(keep){fgr();if(!keep)document.getElementById("num").value=S.nums[S.sel];
 var dup=S.nums.some(function(x,i){return S.nums.indexOf(x)!=i});
 document.getElementById("fi").textContent="Face "+(S.sel+1)+" sur "+S.F.length+(dup?" · certaines valeurs sont en double":"");
 [].forEach.call(document.querySelectorAll("#tp .b"),function(b){b.setAttribute("aria-pressed",b.dataset.k==S.k)})}
function mul(a,b){return a.map(function(r,i){return[0,1,2].map(function(j){return r[0]*b[0][j]+r[1]*b[1][j]+r[2]*b[2][j]})})}
function rx(a){var c=Math.cos(a),s=Math.sin(a);return[[1,0,0],[0,c,-s],[0,s,c]]}
function ry(a){var c=Math.cos(a),s=Math.sin(a);return[[c,0,s],[0,1,0],[-s,0,c]]}
function ap(p){var R=S.R;return[R[0][0]*p[0]+R[0][1]*p[1]+R[0][2]*p[2],R[1][0]*p[0]+R[1][1]*p[1]+R[1][2]*p[2],R[2][0]*p[0]+R[2][1]*p[1]+R[2][2]*p[2]]}
function rot(dx,dy){S.R=mul(rx(dy*.012),mul(ry(dx*.012),S.R))}
function hex(h){return[1,3,5].map(function(i){return parseInt(h.substr(i,2),16)})}
var L=nrm([-.35,.55,.75]),D=6;
function drawBench(){var W=cv.clientWidth,H=cv.clientHeight;
 if(cv.width!=W*dpr||cv.height!=H*dpr){cv.width=W*dpr;cv.height=H*dpr}
 cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,H);
 var s=Math.min(W,H)*.34/DS,ox=W/2,oy=H/2-6,base=hex(S.col);
 cx.fillStyle="rgba(0,0,0,.28)";cx.beginPath();cx.ellipse(ox,oy+s*DS*1.12,s*DS*.9,s*DS*.17,0,0,7);cx.fill();
 S.vis=[];
 function pr(p){var f=D/(D-p[2]);return[ox+p[0]*s*f,oy-p[1]*s*f,f]}
 S.F.forEach(function(f,i){var rn=ap(f.n);if(rn[2]<=.02)return;
  var pts=f.id.map(function(t){return pr(ap(VV[t]))}),lam=Math.max(0,dot(rn,L)),k=.32+.8*lam,sl=i==S.sel;
  if(sl)k+=.22;
  cx.beginPath();pts.forEach(function(p,j){j?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1])});cx.closePath();
  fcell(pts,base,k+(sl?.1:0),lam,s*.035);
  cx.lineJoin="round";cx.strokeStyle=sl?"#ffd36b":"rgba(0,0,0,.55)";cx.lineWidth=sl?3:1.3;cx.stroke();
  S.vis.push({i:i,pts:pts});
  var c=pr(ap(f.c)),u=ap(f.u),r=nrm(crs(u,rn)),t=String(S.nums[i]),fs=f.inr*s*c[2]*(t.length>1?1.05:1.3)*S.ds;
  cx.save();cx.transform(r[0]*c[2],-r[1]*c[2],-u[0]*c[2],u[1]*c[2],c[0],c[1]);cx.translate(0,S.dy/100*fs/c[2]);cx.rotate(S.dr*Math.PI/180);
  cx.font="700 "+(fs/c[2])+"px Cinzel,Georgia,serif";cx.textAlign="center";cx.textBaseline="middle";cx.fillStyle=S.ink;cx.globalAlpha=.55+.45*lam;
  if(S.pips&&S.k==6&&S.nums[i]>=1&&S.nums[i]<=6)pip(S.nums[i],fs/c[2]);else cx.fillText(t,0,0);if(!(S.pips&&S.k==6)&&(t=="6"||t=="9")){var w=cx.measureText(t).width/2;cx.fillRect(-w*.55,fs/c[2]*.5,w*1.1,fs/c[2]*.07)}
  cx.restore()});
 }
function loop(){if(!S.down&&(Math.abs(S.vx)+Math.abs(S.vy))>.05){rot(S.vx,S.vy);S.vx*=S.rolling?.975:.95;S.vy*=S.rolling?.975:.95}
 else if(S.rolling&&!S.down){S.rolling=false;var b=-1,bi=0;S.F.forEach(function(f,i){var z=ap(f.n)[2];if(z>b){b=z;bi=i}});S.sel=bi;res(S.nums[bi]);ui()}
 draw();requestAnimationFrame(loop)}
function res(t){document.getElementById("res").textContent=t;if(t&&S.mode=="t"&&typeof t=="string")hpush({g:0,r:0,p:"Lancer libre",t:t,s:[]})}
function rollB(){S.rolling=true;res("");var a=Math.random()*6.28;S.vx=(22+Math.random()*14)*Math.cos(a);S.vy=(22+Math.random()*14)*Math.sin(a)}
function hit2d(x,y){for(var n=0;n<S.vis.length;n++){var p=S.vis[n].pts,ins=false,i,j;for(i=0,j=p.length-1;i<p.length;j=i++){if((p[i][1]>y)!=(p[j][1]>y)&&x<(p[j][0]-p[i][0])*(y-p[i][1])/(p[j][1]-p[i][1])+p[i][0])ins=!ins}if(ins)return S.vis[n].i}return-1}
var px,py,mv=0,lx,ly;
cv.addEventListener("pointerdown",function(e){cv.setPointerCapture(e.pointerId);S.down=true;S.rolling=false;S.vx=S.vy=0;var b=cv.getBoundingClientRect();px=lx=e.clientX;py=ly=e.clientY;mv=0;cv.style.cursor="grabbing"});
cv.addEventListener("pointermove",function(e){if(!S.down)return;var dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;mv+=Math.abs(dx)+Math.abs(dy);rot(dx,dy);S.vx=dx;S.vy=dy});
function up(e){if(!S.down)return;S.down=false;cv.style.cursor="grab";if(mv<6&&S.mode=="t"){roll();return}if(mv<6){var b=cv.getBoundingClientRect(),i=hit(e.clientX-b.left,e.clientY-b.top);S.vx=S.vy=0;if(i>=0){S.sel=i;ui()}}}
cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
var tp=document.getElementById("tp"),sw=document.getElementById("sw"),ik=document.getElementById("ik");
[4,6,8,10,12,20].forEach(function(k){var b=document.createElement("button");b.className="b ty";b.innerHTML=ICO[k]+"<b>D"+k+"</b><small>"+k+" faces</small>";b.dataset.k=k;b.onclick=function(){build(k)};tp.appendChild(b)});


var TW=4.2,TD=3,AN=.96;
function mv3(M,p){return[M[0][0]*p[0]+M[0][1]*p[1]+M[0][2]*p[2],M[1][0]*p[0]+M[1][1]*p[1]+M[1][2]*p[2],M[2][0]*p[0]+M[2][1]*p[1]+M[2][2]*p[2]]}
function ra(a,t){var n=nrm(a),c=Math.cos(t),s=Math.sin(t),k=1-c,x=n[0],y=n[1],z=n[2];return[[c+x*x*k,x*y*k-z*s,x*z*k+y*s],[y*x*k+z*s,c+y*y*k,y*z*k-x*s],[z*x*k-y*s,z*y*k+x*s,c+z*z*k]]}
function rest(){return dot(S.F[0].n,VV[S.F[0].id[0]])}
function initD(){S.dice=[];for(var i=0;i<S.cnt;i++)S.dice.push({R:mul(rx(Math.random()*6),ry(Math.random()*6)),x:(i-(S.cnt-1)/2)*2.1*DS,z:.6,h:rest(),vx:0,vz:0,vh:0,w:[0,0,0],v:1});S.rt=false}
function topF(d){var b=-2,bi=0;S.F.forEach(function(f,i){var y=mv3(d.R,f.n)[1];if(y>b){b=y;bi=i}});return bi}
function rollT(){res("");sfx("throw");S.rt=true;var r=Math.random;S.dice.forEach(function(d,i){d.v=0;d.x=-TW+1+i*.9*DS;d.z=TD-1-r()*.5;d.h=3+r()*1.5;d.vx=.05+r()*.05;d.vz=-(.07+r()*.05);d.vh=.04+r()*.04;d.w=[r()-.5,r()-.5,r()-.5].map(function(x){return x*.7})})}
function roll(){S.mode=="t"?rollT():rollB()}
function stepT(){var g=.0075,rs=rest(),lx=TW-.9*DS,lz=TD-.9*DS,Q=S.dice,all=1,i,j;
 Q.forEach(function(d){if(d.v)return;all=0;d.vh-=g;d.h+=d.vh;d.x+=d.vx;d.z+=d.vz;var on=0;
  if(d.h<=rs){d.h=rs;if(d.vh<-.02){sfx('hit',Math.min(1,-d.vh*5));d.vh*=-.4;d.w=d.w.map(function(x){return x+(Math.random()-.5)*.25})}else d.vh=0;d.vx*=.965;d.vz*=.965;on=1}
  if(d.in===0&&Math.abs(d.x)<=lx&&Math.abs(d.z)<=lz)d.in=1;if(d.in!==0){if(d.x>lx||d.x<-lx){d.x=d.x>0?lx:-lx;d.vx*=-.5;sfx('wood',.6)}if(d.z>lz||d.z<-lz){d.z=d.z>0?lz:-lz;d.vz*=-.5;sfx('wood',.6)}}
  var m=Math.hypot(d.w[0],d.w[1],d.w[2]);if(m>1e-4)d.R=mul(ra(d.w,m),d.R);var k=on?.94:.995;d.w=d.w.map(function(x){return x*k});
  if(on&&Math.abs(d.vx)+Math.abs(d.vz)+m<.03){var n=mv3(d.R,S.F[topF(d)].n),ang=Math.acos(Math.min(1,n[1]));d.vx=d.vz=0;if(ang>.01)d.R=mul(ra(crs(n,[0,1,0]),Math.min(ang,.06)),d.R);else{d.v=1;d.w=[0,0,0]}}});
 for(i=0;i<Q.length;i++)for(j=i+1;j<Q.length;j++){var dx=Q[j].x-Q[i].x,dz=Q[j].z-Q[i].z,q=Math.hypot(dx,dz);if(q<1.9*DS&&q>0&&Q[i].v!=2&&Q[j].v!=2){var o=(1.9*DS-q)/2/q;Q[i].x-=dx*o;Q[i].z-=dz*o;Q[j].x+=dx*o;Q[j].z+=dz*o;if(!Q[i].v&&!Q[j].v){sfx('hit',.7);var t=Q[i].vx;Q[i].vx=Q[j].vx;Q[j].vx=t;t=Q[i].vz;Q[i].vz=Q[j].vz;Q[j].vz=t}}}
 if(all&&S.rt){S.rt=false;var vs=Q.map(function(d){return S.nums[topF(d)]});if(S.cb){var cb=S.cb;S.cb=null;cb(vs);return}res(vs.join(" · ")+(vs.length>1?" = "+vs.reduce(function(a,b){return a+b},0):""))}}
function drawTable(){var W=cv.clientWidth,H=cv.clientHeight;if(cv.width!=W*dpr||cv.height!=H*dpr){cv.width=W*dpr;cv.height=H*dpr}
 cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,H);
 var sc=Math.min(W/(2*(TW+1)),H/6.6),ox=W/2,oy=H/2+8,V=rx(AN),base=hex(S.col),rs=rest();
 function P(x,y,z){var q=mv3(V,[x,y,z]),f=30/(30-q[2]);return[ox+q[0]*sc*f,oy-q[1]*sc*f,f,q[2]]}
 function quad(a,b,fill){cx.beginPath();[[-a,-b],[a,-b],[a,b],[-a,b]].forEach(function(p,i){var t=P(p[0],0,p[1]);i?cx.lineTo(t[0],t[1]):cx.moveTo(t[0],t[1])});cx.closePath();cx.fillStyle=fill;cx.fill()}
 var gt=P(0,0,-TD-.8),gb=P(0,0,TD+.8),wg=cx.createLinearGradient(0,gt[1],0,gb[1]);wg.addColorStop(0,"#8a5e36");wg.addColorStop(.5,"#5e3d21");wg.addColorStop(1,"#3a2412");
 quad(TW+.8,TD+.8,wg);
 cx.strokeStyle="rgba(20,10,0,.22)";cx.lineWidth=1;for(var gk=-TD-.75;gk<TD+.8;gk+=.11){var w1=P(-TW-.8,0,gk),w2=P(TW+.8,0,gk+(gk%.3>.15?.05:-.04));cx.beginPath();cx.moveTo(w1[0],w1[1]);cx.lineTo(w2[0],w2[1]);cx.stroke()}
 quad(TW+.3,TD+.3,"#2a1a0d");
 var fg=cx.createRadialGradient(ox,oy-sc*.3,sc*.5,ox,oy,sc*5.6);fg.addColorStop(0,"#4d6532");fg.addColorStop(1,"#222f16");
 quad(TW,TD,fg);quad(TW,TD,nz());
 cx.strokeStyle="rgba(0,0,0,.14)";cx.lineWidth=1;for(var gi=-TW;gi<=TW+.01;gi+=.6){var a1=P(gi,0,-TD),a2=P(gi,0,TD);cx.beginPath();cx.moveTo(a1[0],a1[1]);cx.lineTo(a2[0],a2[1]);cx.stroke()}
 for(var gj=-TD;gj<=TD+.01;gj+=.6){var b1=P(-TW,0,gj),b2=P(TW,0,gj);cx.beginPath();cx.moveTo(b1[0],b1[1]);cx.lineTo(b2[0],b2[1]);cx.stroke()}
 cx.save();cx.beginPath();[[-TW,-TD],[TW,-TD],[TW,TD],[-TW,TD]].forEach(function(p,i){var t=P(p[0],0,p[1]);i?cx.lineTo(t[0],t[1]):cx.moveTo(t[0],t[1])});cx.closePath();cx.clip();cx.strokeStyle="rgba(0,0,0,.5)";cx.lineWidth=16;cx.stroke();cx.restore();
 [-TW+.4,0,TW-.4].forEach(function(x){[-1,1].forEach(function(z){scr(P(x,0,z*(TD+.55)))})});[-1.2,1.2].forEach(function(z){[-1,1].forEach(function(x){scr(P(x*(TW+.55),0,z))})});
 var vg=cx.createRadialGradient(ox,oy,sc*1.6,ox,oy,sc*6.4);vg.addColorStop(0,"rgba(255,214,140,.1)");vg.addColorStop(1,"rgba(0,0,0,.6)");cx.fillStyle=vg;cx.fillRect(0,0,W,H);
 var od=S.dice.slice().sort(function(a,b){return P(a.x,a.h,a.z)[3]-P(b.x,b.h,b.z)[3]});
 od.forEach(function(d){var p=P(d.x,0,d.z),e=d.h-rs,a=sc*p[2]*DS*(1.25+Math.min(.8,e*.15)),al=.55/(1+e*1.2);cx.save();cx.translate(p[0]+a*.18,p[1]);cx.scale(1,.55);var g=cx.createRadialGradient(0,0,a*.12,0,0,a);g.addColorStop(0,"rgba(0,0,0,"+al+")");g.addColorStop(1,"rgba(0,0,0,0)");cx.fillStyle=g;cx.beginPath();cx.arc(0,0,a,0,7);cx.fill();cx.restore()});
 od.forEach(function(d){S.F.forEach(function(f,i){var rn=mv3(d.R,f.n),vn=mv3(V,rn);if(vn[2]<=.02)return;
  var pts=f.id.map(function(t){var a=mv3(d.R,VV[t]);return P(d.x+a[0],d.h+a[1],d.z+a[2])}),lm=Math.max(0,dot(rn,L)),k=.32+.8*lm;
  cx.beginPath();pts.forEach(function(p,j){j?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1])});cx.closePath();
  fcell(pts,base,k,lm,sc*.07);
  var cw=mv3(d.R,f.c),c=P(d.x+cw[0],d.h+cw[1],d.z+cw[2]),u=mv3(d.R,f.u),r=nrm(crs(u,rn)),uv=mv3(V,u),rv=mv3(V,r),t=String(S.nums[i]),fs=f.inr*sc*c[2]*(t.length>1?1.05:1.3)*S.ds;
  cx.save();cx.transform(rv[0],-rv[1],-uv[0],uv[1],c[0],c[1]);cx.translate(0,S.dy/100*fs);cx.rotate(S.dr*Math.PI/180);
  cx.font="700 "+fs+"px Cinzel,Georgia,serif";cx.textAlign="center";cx.textBaseline="middle";cx.fillStyle=S.ink;cx.globalAlpha=.55+.45*lm;if(S.pips&&S.k==6&&S.nums[i]>=1&&S.nums[i]<=6)pip(S.nums[i],fs);else cx.fillText(t,0,0);
  if(!(S.pips&&S.k==6)&&(t=="6"||t=="9")){var w=cx.measureText(t).width/2;cx.fillRect(-w*.55,fs*.5,w*1.1,fs*.07)}cx.restore()})})}
function draw(){if(S.mode!="b")stepT();if(!GL.tried)glInit();if(GL.ok){try{glDraw();return}catch(e){GL.ok=0;GL.r.domElement.style.display="none";console.error(e)}}if(S.mode!="b")drawTable();else drawBench()}
var cn=document.getElementById("cn");[1,2,3,4].forEach(function(n){var b=document.createElement("button");b.className="b";b.textContent=n+(n>1?" dés":" dé");b.setAttribute("aria-pressed",n==S.cnt);b.onclick=function(){S.cnt=n;initD();res("");[].forEach.call(cn.children,function(x){x.setAttribute("aria-pressed",x==b)})};cn.appendChild(b)});
function rz(){S.ds=1;S.dr=S.dy=0;[].forEach.call(document.querySelectorAll("#s-des .sl input"),function(e,i){e.value=[100,0,0][i]})}
var G={on:0,P:[],c:0,t:343,m:'',a:'',bt:0,ne:0,R:0,ed:-1},BN=['Perceval','Karadoc','Léodagan','Bohort','Lancelot','Yvain','Gauvain','Kay'],CB={ch:'Chouette',ve:'Velute',cv:'Chouette velute',cd:'Cul de Chouette',su:'Suite',ne:'Néant'},gm=document.getElementById('gm');
function eh(s){return String(s).replace(/[&<>"']/g,function(c){return'&#'+c.charCodeAt(0)+';'})}
function act(h){G.a=h;rg()}
// 6 places autour de la table : un joueur ajouté prend la place réservée (G.ns) ou la première libre, les robots ne prennent jamais la place réservée
function sAt(i){return G.P.filter(function(p){return p.seat===i})[0]}
function fSeat(ex){for(var i=0;i<6;i++)if(i!==ex&&!sAt(i))return i;return -1}
function addH(){var i=document.getElementById('pn'),n=i.value.trim();if(n&&G.P.length<6){var st=G.ns!=null?G.ns:fSeat(),oc=sAt(st);if(oc)oc.seat=fSeat(st);
 G.P.push({n:n.slice(0,16),b:0,s:0,cv:0,gr:0,ap:cpA(DR),seat:st});G.ns=null;G.ed=G.P.length-1;i.value='';mkCh();rg()}}
function addB(){if(G.P.length>=6)return;var n=BN.filter(function(x){return!G.P.some(function(p){return p.n==x})})[0]||'Robot '+G.P.length;G.P.push({n:n,b:1,s:0,cv:0,gr:0,seat:fSeat(G.ns),dc:rDice()});rg()}
// Dés des robots : style tiré au hasard (couleur, encre lisible, finition, points ou chiffres), appliqué au début de leur tour ; U garde le style du joueur humain
var U=null;
function lum(h){var a=hex(h);return(.299*a[0]+.587*a[1]+.114*a[2])/255}
function rDice(){var r=Math.random,c=COL[Math.floor(r()*COL.length)][1],ks=INK.filter(function(k){return Math.abs(lum(k[1])-lum(c))>.35});ks=ks.length?ks:INK;
 return{col:c,ink:ks[Math.floor(r()*ks.length)][1],fin:Math.floor(r()*FIN.length),pips:r()<.7?1:0}}
// Tapis de jeu posé sur la table, sous les dés : matière, couleur, bordure, motif, inscription, forme
var MATC=['#1f4a2c','#2b5d3a','#5e1c27','#1d3156','#151515','#5a3a22','#4a2a5a','#c9b48a'],MATB=['#d0a33a','#c9ccd0','#b8683a','#efe6cf','#111111'],
 MOPT=[['mmt','m',['Aucun','Feutre','Cuir','Velours']],['mbd','b',['Aucune','Simple','Double','Ornée']],['mem','e',['Aucun','Chouette','Dé','Blason','Rose']],['mtx','t',['Sans','Inscription']],['mfm','f',['Rectangle','Ovale']]];
S.mat={m:1,c:'#1f4a2c',b:2,bc:'#d0a33a',e:1,t:1,f:0};
function setMat(k,v){S.mat[k]=v;mkMat()}
function mkMat(){var o=S.mat,e=document.getElementById('mmt');if(!e)return;
 MOPT.forEach(function(q){var el=document.getElementById(q[0]);el.innerHTML='';q[2].forEach(function(n,i){var b=document.createElement('button');b.className='b';b.textContent=n;b.setAttribute('aria-pressed',o[q[1]]==i);b.onclick=function(){setMat(q[1],i)};el.appendChild(b)})});
 [['mcl','c',MATC,'Tapis'],['mbc','bc',MATB,'Bordure']].forEach(function(q){var el=document.getElementById(q[0]);el.innerHTML='';q[2].forEach(function(c){el.appendChild(gem(c,o[q[1]]==c,function(){setMat(q[1],c)},q[3]+' '+c))})});
 document.getElementById('mpk').value=o.c}
function glMatTex(o){var W=1024,H=732,c=cvs(W,H),x=c.getContext('2d'),r=Math.random,i,bc=o.bc;
 function sh(n){x.beginPath();if(o.f==1)x.ellipse(W/2,H/2,W/2-n,H/2-n,0,0,7);else x.rect(n,n,W-2*n,H-2*n)}
 function dia(px,py,s){x.beginPath();x.moveTo(px,py-s);x.lineTo(px+s,py);x.lineTo(px,py+s);x.lineTo(px-s,py);x.closePath();x.fill()}
 if(o.f==1){sh(2);x.clip()}
 x.fillStyle=o.c;x.fillRect(0,0,W,H);
 if(o.m==1)for(i=0;i<26000;i++){var a=r()*6.28,l=2+r()*5,px=r()*W,py=r()*H;x.strokeStyle='rgba('+(r()<.5?'0,0,0':'255,255,255')+','+r()*.09+')';x.lineWidth=1;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke()}
 if(o.m==2){for(i=0;i<5000;i++){x.fillStyle='rgba(0,0,0,'+r()*.12+')';x.beginPath();x.arc(r()*W,r()*H,1+r()*3,0,7);x.fill()}
  var vg=x.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,W*.62);vg.addColorStop(0,'rgba(255,255,255,.06)');vg.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=vg;x.fillRect(0,0,W,H);
  x.setLineDash([10,8]);x.strokeStyle='rgba(240,220,180,.55)';x.lineWidth=3;sh(16);x.stroke();x.setLineDash([])}
 if(o.m==3){var sg=x.createLinearGradient(0,0,W,H);sg.addColorStop(0,'rgba(255,255,255,.12)');sg.addColorStop(.5,'rgba(0,0,0,.15)');sg.addColorStop(1,'rgba(255,255,255,.08)');x.fillStyle=sg;x.fillRect(0,0,W,H);
  for(i=0;i<9000;i++){x.fillStyle='rgba(0,0,0,'+r()*.05+')';x.fillRect(r()*W,r()*H,2,2)}}
 x.strokeStyle=bc;x.fillStyle=bc;
 if(o.b>=1){x.lineWidth=7;sh(34);x.stroke()}
 if(o.b>=2){x.lineWidth=2.5;sh(52);x.stroke()}
 if(o.b==3){if(o.f==1)[[W/2,43],[W/2,H-43],[43,H/2],[W-43,H/2]].forEach(function(p){dia(p[0],p[1],10)});
  else{[[52,52,0],[W-52,52,1],[W-52,H-52,2],[52,H-52,3]].forEach(function(q){x.save();x.translate(q[0],q[1]);x.rotate(q[2]*Math.PI/2);x.lineWidth=3;x.beginPath();x.arc(0,0,40,0,Math.PI/2);x.stroke();x.beginPath();x.arc(0,0,24,0,Math.PI/2);x.stroke();dia(28,28,9);x.restore()});
   for(i=130;i<W-120;i+=64){dia(i,43,6);dia(i,H-43,6)}for(i=130;i<H-120;i+=64){dia(43,i,6);dia(W-43,i,6)}}}
 x.save();x.translate(W/2,H/2-(o.t&&o.e?22:0));x.globalAlpha=.75;x.lineWidth=5;x.lineJoin='round';x.lineCap='round';
 if(o.e==1){x.beginPath();x.ellipse(0,20,70,92,0,0,7);x.stroke();x.beginPath();x.moveTo(-58,-48);x.lineTo(-46,-98);x.lineTo(-18,-62);x.moveTo(58,-48);x.lineTo(46,-98);x.lineTo(18,-62);x.stroke();
  [-28,28].forEach(function(ex){x.beginPath();x.arc(ex,-34,24,0,7);x.stroke();x.beginPath();x.arc(ex,-34,9,0,7);x.fill()});
  x.beginPath();x.moveTo(-8,-10);x.lineTo(8,-10);x.lineTo(0,8);x.closePath();x.fill();
  [[0,40],[-24,40],[24,40],[-12,62],[12,62],[0,84]].forEach(function(p){x.beginPath();x.moveTo(p[0]-9,p[1]-6);x.lineTo(p[0],p[1]+4);x.lineTo(p[0]+9,p[1]-6);x.stroke()});
  x.beginPath();x.moveTo(-68,0);x.quadraticCurveTo(-92,60,-50,100);x.moveTo(68,0);x.quadraticCurveTo(92,60,50,100);x.moveTo(-90,116);x.lineTo(90,116);x.stroke();
  [-22,22].forEach(function(fx){x.beginPath();[-10,0,10].forEach(function(d){x.moveTo(fx+d,116);x.lineTo(fx+d,d?108:105)});x.stroke()})}
 if(o.e==2){rr(x,-80,-80,160,160,24);x.stroke();[[-44,-44],[44,-44],[0,0],[-44,44],[44,44]].forEach(function(p){x.beginPath();x.arc(p[0],p[1],14,0,7);x.fill()})}
 if(o.e==3){x.beginPath();x.moveTo(-80,-95);x.lineTo(80,-95);x.lineTo(80,10);x.quadraticCurveTo(80,80,0,110);x.quadraticCurveTo(-80,80,-80,10);x.closePath();x.stroke();
  x.beginPath();x.moveTo(-60,40);x.lineTo(0,-25);x.lineTo(60,40);x.lineTo(60,62);x.lineTo(0,0);x.lineTo(-60,62);x.closePath();x.fill();[[-40,-62],[40,-62]].forEach(function(p){x.beginPath();x.arc(p[0],p[1],10,0,7);x.fill()})}
 if(o.e==4){x.beginPath();for(i=0;i<16;i++){var an=i*Math.PI/8-Math.PI/2,R=i%2?30:i%4?72:118;x.lineTo(Math.cos(an)*R,Math.sin(an)*R)}x.closePath();x.stroke();x.beginPath();x.arc(0,0,48,0,7);x.stroke();x.beginPath();x.arc(0,0,8,0,7);x.fill()}
 x.restore();
 if(o.t){x.save();x.globalAlpha=.75;x.fillStyle=bc;x.font='700 38px Cinzel,Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText('CUL DE CHOUETTE',W/2,H/2+(o.e?150:0));x.restore()}
 return c}
function glMatUpd(){var sig=JSON.stringify(S.mat);if(sig===GL.msig)return;GL.msig=sig;
 if(GL.mt){GL.sc.remove(GL.mt);GL.mt.geometry.dispose();GL.mt.material.map.dispose();GL.mt.material.dispose();GL.mt=null}if(!S.mat.m)return;
 var t=new THREE.CanvasTexture(glMatTex(S.mat));t.encoding=THREE.sRGBEncoding;t.anisotropy=8;
 var m=new THREE.MeshStandardMaterial({map:t,bumpMap:t,bumpScale:S.mat.m==2?.8:.4,roughness:[1,1,.5,.75][S.mat.m],alphaTest:.5,envMapIntensity:.3});
 GL.mt=new THREE.Mesh(new THREE.PlaneGeometry(2*TW-.5,2*TD-.5),m);GL.mt.rotation.x=-Math.PI/2;GL.mt.position.y=.012;GL.mt.receiveShadow=true;GL.sc.add(GL.mt)}
function appDS(p){if(!S.bs)U={col:S.col,ink:S.ink,fin:S.fin,pips:S.pips};if(p&&p.b&&!p.dc)p.dc=rDice();var d=p&&p.b?p.dc:U;
 ['col','ink','fin','pips'].forEach(function(k){S[k]=d[k]});S.bs=!!(p&&p.b);
 setP(S.pips);setF(S.fin);document.getElementById('pk').value=S.col;document.getElementById('pk2').value=S.ink;mkSw()}
function pickSeat(i){if(G.on)return;var tg=G.ed>=0?G.P[G.ed]:null,oc=sAt(i);
 if(oc&&!oc.b&&oc!==tg){G.ed=G.P.indexOf(oc);mkCh();sjr();return}
 if(tg){if(oc&&oc!==tg)oc.seat=tg.seat;tg.seat=i}else G.ns=G.ns===i?null:i;
 mkSeat();rg()}
function mkSeat(){var el=document.getElementById('cseat');if(!el)return;var tg=G.ed>=0?G.P[G.ed]:null,h='',i;
 for(i=0;i<6;i++){var p=sAt(i),on=tg?tg.seat===i:G.ns===i;
  h+='<button class="pn-seat s'+i+(p?(p.b?' bot':' hum'):'')+'" aria-pressed="'+on+'" onclick="pickSeat('+i+')"'+(G.on?' disabled':'')+'><b>'+(i+1)+'</b><span>'+(p?eh(p.n):on?'Réservée':'Libre')+'</span></button>'}
 el.innerHTML=h+'<div class="pn-tbl">Table</div><div class="pn-cam">Vue de la caméra</div>';
 document.getElementById('cseatn').textContent=G.on?'Les places sont fixées pendant la partie.':tg?'Touchez une place pour y installer '+tg.n+'.':'Touchez une place pour le prochain joueur ajouté.'}
function delP(i){G.P.splice(i,1);G.ed=-1;mkCh();rg()}
// Personnage des joueurs : tenue, cape, cheveux, peau, coiffe, coupe, pilosité, carrure, accessoire.
// DR est le style du prochain joueur ajouté.
var KEYS=['t','k','h','s','a','l','b','w','x'],AD={k:'',l:0,b:0,w:1,x:0},
 PRE=[{n:'Chevalier',ap:{t:'#2b4c7e',k:'#6b2a2a',h:'#caa45a',s:'#e6bf99',a:2,l:0,b:0,w:2,x:1}},{n:'Roi',ap:{t:'#6b2a2a',k:'#5a2f6b',h:'#a2431e',s:'#e2b48c',a:3,l:1,b:1,w:1,x:0}},
  {n:'Enchanteur',ap:{t:'#5a2f6b',k:'',h:'#e8e0cc',s:'#e0b08a',a:4,l:1,b:3,w:0,x:3}},{n:'Garde',ap:{t:'#4a4a52',k:'',h:'#4a2c17',s:'#c98f66',a:2,l:0,b:2,w:2,x:2}},
  {n:'Paysan',ap:{t:'#8a6a1f',k:'',h:'#4a2c17',s:'#c98f66',a:0,l:0,b:0,w:1,x:0}},{n:'Moine',ap:{t:'#4a4a52',k:'',h:'#2a1b10',s:'#e2b48c',a:1,l:0,b:0,w:1,x:0}},
  {n:'Barde',ap:{t:'#2f6d6b',k:'#8a6a1f',h:'#2a1b10',s:'#a8714a',a:6,l:1,b:2,w:0,x:0}},{n:'Brigand',ap:{t:'#2f5a3a',k:'#2a1b10',h:'#2a1b10',s:'#c98f66',a:1,l:1,b:1,w:1,x:1}}],
 CTU=['#7a3b2a','#6b2a2a','#8a6a1f','#2f5a3a','#2f6d6b','#2b4c7e','#5a2f6b','#4a4a52'],CCA=['#6b2a2a','#2b4c7e','#2f5a3a','#5a2f6b','#8a6a1f','#2a1b10','#4a4a52','#d8c9a8'],
 CHR=['#2a1b10','#4a2c17','#a2431e','#caa45a','#9a9a9a','#e8e0cc'],CSK=['#f1d0b0','#e6bf99','#e2b48c','#c98f66','#a8714a','#7a4e30'],
 OPT={a:['Cheveux','Capuche','Casque','Couronne','Chapeau','Chauve','Béret'],l:['Courts','Longs'],b:['Rasé','Barbe','Moustache','Longue barbe'],w:['Mince','Normal','Costaud'],x:['Aucun','Épée','Bouclier','Bâton']},
 DR=cpA(PRE[0].ap);
function cpA(a){var o={};KEYS.forEach(function(k){o[k]=a[k]==null?AD[k]:a[k]});return o}
function apT(){return G.ed>=0&&G.P[G.ed]?G.P[G.ed].ap:DR}
function setAp(k,v){apT()[k]=v;mkCh();rg()}
function setPre(i){var a=apT(),p=PRE[i].ap;for(var k in p)a[k]=p[k];mkCh();rg()}
function edP(i){G.ed=G.ed===i?-1:i;mkCh();sjr()}
function cSvg(a){var t=a.t,h=a.h,s=a.s,k=a.k,d='#2a1b12',W=[.86,1,1.16][a.w==null?1:a.w],hair='<path d="M36 52Q34 26 60 26Q86 26 84 52Q78 36 60 36Q42 36 36 52Z" fill="'+h+'"/>',o='<svg viewBox="0 0 120 140" aria-hidden="true">';
 function X(v){return Math.round((60+(v-60)*W)*10)/10}
 function body(l1,l2,r1,r2,f){return'<path d="M'+X(l1)+' 140L'+X(l2)+' 94Q60 80 '+X(r2)+' 94L'+X(r1)+' 140Z" fill="'+f+'"/>'}
 if(a.x==3)o+='<rect x="102" y="22" width="4" height="118" fill="#6b4a2a"/><circle cx="104" cy="18" r="7" fill="#9fd8ff"/>';
 if(a.x==1)o+='<g transform="rotate(35 60 96)"><rect x="57" y="14" width="6" height="84" fill="#c9ccd0"/><rect x="49" y="94" width="22" height="5" fill="#d0a33a"/><rect x="57" y="99" width="6" height="14" fill="#4a2e18"/></g>';
 if(k)o+=body(12,22,108,98,k)+body(12,22,108,98,'rgba(0,0,0,.28)');
 if(a.a==1)o+='<path d="M22 96Q22 16 60 16Q98 16 98 96Z" fill="'+t+'"/><path d="M22 96Q22 16 60 16Q98 16 98 96Z" fill="rgba(0,0,0,.3)"/>';
 if(a.l&&a.a!=1&&a.a!=5)o+='<path d="M34 50Q30 92 40 102L80 102Q90 92 86 50Z" fill="'+h+'"/>';
 o+=body(18,28,102,92,t)+'<path d="M'+X(28)+' 96Q60 82 '+X(92)+' 96L'+X(88)+' 104Q60 92 '+X(32)+' 104Z" fill="rgba(0,0,0,.25)"/><rect x="'+X(24)+'" y="122" width="'+(X(96)-X(24))+'" height="6" fill="'+d+'"/><rect x="56" y="121" width="8" height="8" fill="#d0a33a"/><rect x="52" y="72" width="16" height="14" fill="'+s+'"/>';
 if(k)o+='<circle cx="'+X(38)+'" cy="94" r="3.5" fill="#d0a33a"/><circle cx="'+X(82)+'" cy="94" r="3.5" fill="#d0a33a"/>';
 if(a.x==2){var sx=X(14);o+='<circle cx="'+sx+'" cy="114" r="15" fill="'+(k||t)+'" stroke="#d0a33a" stroke-width="3"/><circle cx="'+sx+'" cy="114" r="4" fill="#d0a33a"/>'}
 o+='<circle cx="60" cy="52" r="24" fill="'+s+'"/>';
 if(a.a==0||a.a==3||a.a==6)o+=hair;
 if(a.a==6)o+='<ellipse cx="56" cy="30" rx="30" ry="9" fill="'+(k||'#6b1420')+'" transform="rotate(-12 56 30)"/><path d="M74 26Q96 8 104 2" stroke="#f3e6c4" stroke-width="4" fill="none" stroke-linecap="round"/>';
 if(a.a==1)o+='<path d="M34 64Q34 30 60 30Q86 30 86 64" fill="none" stroke="'+t+'" stroke-width="7"/>';
 if(a.a==2)o+='<path d="M34 50Q34 22 60 22Q86 22 86 50Z" fill="#9aa0a6"/><path d="M34 50H86" stroke="#6b7076" stroke-width="3"/><rect x="57" y="46" width="6" height="16" fill="#9aa0a6"/>';
 if(a.a==3)o+='<path d="M38 34L38 18L46 27L53 14L60 26L67 14L74 27L82 18L82 34Z" fill="#d0a33a" stroke="#8a6a1f" stroke-width="1.5"/>';
 if(a.a==4)o+='<path d="M40 34L66 2L80 34Z" fill="'+t+'"/><ellipse cx="60" cy="34" rx="34" ry="6" fill="'+t+'"/><ellipse cx="60" cy="34" rx="34" ry="6" fill="rgba(0,0,0,.2)"/>';
 o+='<circle cx="51" cy="52" r="2.4" fill="'+d+'"/><circle cx="69" cy="52" r="2.4" fill="'+d+'"/><circle cx="60" cy="58" r="3" fill="rgba(0,0,0,.12)"/>';
 if(a.b==1)o+='<path d="M38 56Q40 86 60 90Q80 86 82 56Q74 70 60 70Q46 70 38 56Z" fill="'+h+'"/>';
 if(a.b==3)o+='<path d="M38 56Q40 104 60 124Q80 104 82 56Q74 70 60 70Q46 70 38 56Z" fill="'+h+'"/>';
 o+='<rect x="54" y="64" width="12" height="2" fill="'+d+'"/>';
 if(a.b==2)o+='<path d="M47 64Q54 58 60 61Q66 58 73 64Q66 67 60 65Q54 67 47 64Z" fill="'+h+'"/>';
 return o+'</svg>'}
function mkCh(){var a=apT(),e=document.getElementById('cprev');if(!e)return;e.innerHTML=cSvg(a);
 document.getElementById('ced').textContent=G.ed>=0&&G.P[G.ed]?'Vous modifiez le style de '+G.P[G.ed].n+'. Touchez « Style » sur sa ligne pour préparer un autre joueur.':'Ce style sera donné au prochain joueur ajouté.';mkSeat();
 var pr=document.getElementById('cpre');pr.innerHTML='';PRE.forEach(function(p,i){var b=document.createElement('button');b.className='b';b.textContent=p.n;b.setAttribute('aria-pressed',KEYS.every(function(k){return a[k]==p.ap[k]}));b.onclick=function(){setPre(i)};pr.appendChild(b)});
 [['cct','t',CTU,'Tenue'],['cck','k',CCA,'Cape'],['cch','h',CHR,'Cheveux'],['csk','s',CSK,'Peau']].forEach(function(q){var el=document.getElementById(q[0]);el.innerHTML='';
  if(q[1]=='k'){var n=gem('transparent',!a.k,function(){setAp('k','')},'Sans cape');n.classList.add('gno');el.appendChild(n)}
  q[2].forEach(function(c){el.appendChild(gem(c,a[q[1]]==c,function(){setAp(q[1],c)},q[3]+' '+c))})});
 [['chd','a'],['chl','l'],['cbd','b'],['cwd','w'],['cxa','x']].forEach(function(q){var el=document.getElementById(q[0]);el.innerHTML='';OPT[q[1]].forEach(function(n,i){var b=document.createElement('button');b.className='b';b.textContent=n;b.setAttribute('aria-pressed',+a[q[1]]==i);b.onclick=function(){setAp(q[1],i)};el.appendChild(b)})})}
function startG(){var t=+document.getElementById('tg').value||343;if(G.P.length<2){document.getElementById('sm').textContent='Ajoutez au moins 2 joueurs.';return}
 G.t=Math.max(50,t);G.P.forEach(function(p){p.s=0;p.cv=p.gr=0});G.on=1;G.c=0;G.rd=1;G.gid=Date.now();PS={};if(S.k!=6)build(6);else auto();closeSh();setMode('j');turn()}
function nd(){return{R:mul(rx(Math.random()*6),ry(Math.random()*6)),x:0,z:.6,h:rest(),vx:0,vz:0,vh:0,w:[0,0,0],v:1}}
function thr(d,i){var r=Math.random;d.v=0;d.x=-TW+1+i*1.2*DS;d.z=TD-1-r()*.5;d.h=3+r()*1.5;d.vx=.05+r()*.05;d.vz=-(.07+r()*.05);d.vh=.04+r()*.04;d.w=[r()-.5,r()-.5,r()-.5].map(function(x){return x*.7})}
function turn(){var p=G.P[G.c];appDS(p);G.bt=0;G.ne=0;G.kd='';G.m='Au tour de '+eh(p.n)+'.';if(!grel())civ()}
// Grelottine : au début du tour d'un joueur qui a une Grelottine, un autre joueur qui en a une aussi peut le défier (le plus petit score d'abord)
function gMx(a,b){return Math.max(10,Math.floor(.3*Math.min(a.s,b.s)))}
function grel(){var p=G.P[G.c];if(!p.gr)return 0;
 var cs=G.P.map(function(q,j){return j}).filter(function(j){return j!=G.c&&G.P[j].gr}).sort(function(x,y){return G.P[x].s-G.P[y].s}),i;
 for(i=0;i<cs.length;i++){var j=cs[i],q=G.P[j];if(!q.b){form(2,j);return 1}
  if(Math.random()<.5){var mx=gMx(q,p),st=Math.max(5,Math.floor(mx*(.3+Math.random()*.7))),cb=['ch','ch','ve','su','cd'][Math.floor(Math.random()*5)];
   G.bt={t:2,by:j,cb:cb,st:st};G.m+=' '+eh(q.n)+' crie « Grelottine ! » : défi '+CB[cb]+' pour '+st+' pts.';say('Grelottine !',j);act('');setTimeout(prep,1800);return 1}}
 return 0}
function civ(){var p=G.P[G.c];if(p.cv&&p.b&&Math.random()<.3){G.bt={t:1,cb:'ch',st:5+Math.floor(Math.random()*16)};G.m+=' Civet de '+G.bt.st+' sur une Chouette.'}
 if(p.cv&&!p.b)form(1,G.c);else prep()}
function prep(){var p=G.P[G.c];S.dice=[nd(),nd()];S.dice[0].x=-DS;S.dice[1].x=DS;
 act('');if(p.b)setTimeout(lance,1000);else waitR(1)}
function lance(){if(!G.on)return;act('');S.cb=chs;thrH(S.dice)}
function chs(v){if(!G.on)return;var p=G.P[G.c],a=v[0];if(a!=v[1]){cul(0);return}
 G.m=eh(p.n)+' fait une Chouette de '+a+' ('+a*a+' pts).';if(p.b)say('Chouette !',G.c);
 if(p.b){act('');setTimeout(function(){var sr=a<4||Math.random()<.15?1:0;if(sr)say('Je sirote !',G.c);cul(sr)},1200)}
 else act('<div class="ax-card"><div class="ax-k">Chouette de '+a+'</div><div class="ax-t">Siroter pour tenter un Cul de Chouette ?</div><div class="ax-act"><button class="ax-no" onclick="cul(0)">Passer</button><button class="ax-ok" onclick="cul(1)">Siroter</button></div></div>')}
function cul(s){if(!G.on)return;if(!G.P[G.c].b){G.s3=s;G.m+=s?' Lancez le 3ᵉ dé pour siroter.':' Lancez le 3ᵉ dé.';act('');waitR(2);return}act('');thr3(s)}
function thr3(s){var d=nd();S.dice.push(d);S.cnt=3;S.cb=function(v){res3(v,s)};thrH([d],2)}
function ev(a,b,c){var s=[a,b,c].sort(function(x,y){return x-y}),f={},p=0;
 if(a==b&&b==c){f.cd=1;p=40+10*a}else{var ve=s[0]+s[1]==s[2],pr=s[0]==s[1]?s[0]:s[1]==s[2]?s[1]:0;if(ve&&pr)f.cv=1;else if(ve)f.ve=1;else if(pr)f.ch=1;if(s[1]==s[0]+1&&s[2]==s[1]+1)f.su=1;p=ve?2*s[2]*s[2]:pr?pr*pr:0;if(!f.cv&&!f.ve&&!f.ch&&!f.su)f.ne=1}
 return{f:f,p:p}}
function res3(v,sir){if(!G.on)return;var p=G.P[G.c],a=v[0],r=ev(a,v[1],v[2]),f=r.f,pts=r.p,b=G.bt,t=v.join('-')+' : ';
 if(sir&&!f.cd){pts=-a*a;f={};t+='sirotage raté ('+pts+' pts)';if(!p.cv){p.cv=1;t+=', gagne un Civet'}}
 else t+=Object.keys(f).map(function(k){return CB[k]}).join(' + ')+(pts?' ('+pts+' pts)':'')+(f.cd&&sir?' avec sirotage':'');
 var vp=pts;if(f.cv)pts=0;p.s+=pts;G.kd=(pts>0||f.cv)?'g':(pts<0||f.ne)?'b':'n';
 if(f.ne&&!p.gr){p.gr=1;t+=' · Grelottine gagnée'}
 G.ne=f.ne?1:0;
 if(b){var ok=!!(f[b.cb]||(f.cv&&(b.cb=='ve'||b.cb=='ch')));
  if(b.t==1){p.s+=ok?b.st:-b.st;p.cv=0;t+=' · Civet '+(ok?'réussi (+':'raté (-')+b.st+')'}
  else{var q=G.P[b.by];p.s+=ok?b.st:-b.st;q.s+=ok?-b.st:b.st;q.gr=0;p.gr=f.ne?1:0;t+=' · Grelottine '+(ok?'relevée (+':'perdue (-')+b.st+')'}}
 G.P.forEach(function(p){if(p.s<0)p.s=0});G.m=t;if(f.cv||f.su)react(f,vp);else done()}
function react(f,vp){G.R={t:{},f:f,vp:vp,st:Date.now()};var lab=f.cv?'Pas mou, le caillou !':'Grelotte ça picote !';
 var gs=f.cv?'Tapez sur vos genoux':'Tapez du poing sur la table';G.m+=' '+gs+' en criant « '+lab+' »';
 var hb=G.P.map(function(p,i){return p.b?'':'<button class="ax-ok" onclick="rx2('+i+');this.disabled=true">'+eh(p.n)+'</button>'}).join('');
 act(hb?'<div class="ax-card"><div class="ax-k">'+gs+(f.cv?' — le premier gagne':' — le dernier perd 10')+'</div><div class="ax-t">« '+lab+' »</div><div class="ax-act">'+hb+'</div></div>':'');
 G.P.forEach(function(p,i){if(p.b)setTimeout(function(){rx2(i)},500+Math.random()*2200)});G.rt=setTimeout(rsv,4500)}
function rx2(i){var R=G.R;if(!R||R.t[i]!=null)return;R.t[i]=Date.now()-R.st;glReact(G.P[i],R.f.cv?'cv':'su');if(G.P[i].b&&!R.said){R.said=1;say(R.f.cv?'Pas mou, le caillou !':'Grelotte ça picote !',i)}if(Object.keys(R.t).length==G.P.length)rsv()}
function rsv(){var R=G.R;if(!R)return;G.R=0;clearTimeout(G.rt);var ids=Object.keys(R.t).sort(function(x,y){return R.t[x]-R.t[y]}),t='';
 if(R.f.cv){if(ids.length){var w=G.P[ids[0]];w.s+=R.vp;t=' '+eh(w.n)+' est le plus rapide et gagne '+R.vp+' pts.'}else t=' Personne n’a réagi : pas de points.'}
 else if(ids.length){var lo=G.P.map(function(p,i){return i}).filter(function(i){return R.t[i]==null});if(!lo.length)lo=[+ids[ids.length-1]];lo.forEach(function(i){G.P[i].s-=10});t=' Dernier(s) : '+lo.map(function(i){return eh(G.P[i].n)}).join(', ')+' (-10 pts).'}
 G.m+=t;done()}
function done(){if(!G.on)return;G.P.forEach(function(p){if(p.s<0)p.s=0});hist();act('');setTimeout(nxt,2400)}
function form(k,w){var X=G.P[G.c],mx=k==1?102:gMx(G.P[w],X),o=['ch','ve','cv','cd','su'];
 act('<div class="ax-card"><div class="ax-k">'+(k==1?'Civet':'Grelottine')+'</div><div class="ax-t">'+eh(G.P[w].n)+(k==1?', utiliser votre Civet ?':', vous avez une Grelottine : défier '+eh(X.n)+', qui en a une aussi ?')+'</div>'
  +'<div class="ax-l">Combinaison</div><div class="ax-opts" id="cs" data-v="ch" role="radiogroup" aria-label="Combinaison">'+o.map(function(x){return'<button role="radio" data-v="'+x+'" aria-pressed="'+(x=='ch')+'" onclick="pickC(this)">'+CB[x]+'</button>'}).join('')+'</div>'
  +'<div class="ax-l">Mise<span>max '+mx+'</span></div><div class="ax-st"><button onclick="stM(-5,'+mx+')" aria-label="Diminuer la mise">−</button><input id="cst" type="number" inputmode="numeric" min="1" max="'+mx+'" value="'+Math.min(mx,10)+'" aria-label="Mise"><button onclick="stM(5,'+mx+')" aria-label="Augmenter la mise">+</button><button class="mx" onclick="stM('+mx+','+mx+')">Max</button></div>'
  +'<div class="ax-act"><button class="ax-no" onclick="noF('+k+')">Non</button><button class="ax-ok" onclick="okF('+k+','+w+','+mx+')">Valider</button></div></div>')}
function pickC(b){var c=b.parentNode;c.dataset.v=b.dataset.v;[].forEach.call(c.children,function(x){x.setAttribute('aria-pressed',x==b)})}
function stM(d,mx){var e=document.getElementById('cst');e.value=Math.max(1,Math.min(mx,(+e.value||1)+d))}
function okF(k,w,mx){var cb=document.getElementById('cs').dataset.v,st=Math.max(1,Math.min(mx,+document.getElementById('cst').value||1));G.bt={t:k,by:w,cb:cb,st:st};G.m+=' Mise de '+st+' sur '+CB[cb]+'.';prep()}
function noF(k){k==1?prep():civ()}
function nxt(){var w=G.P.filter(function(p){return p.s>=G.t});if(w.length){w.sort(function(a,b){return b.s-a.s});G.m='Victoire de '+eh(w[0].n)+' avec '+w[0].s+' points !';G.kd=G.P.some(function(q){return!q.b})?(w[0].b?'l':'w'):'w';act('<button class="go" onclick="endG()">Nouvelle partie</button>');return}
 G.c=(G.c+1)%G.P.length;if(!G.c)G.rd++;turn()}
build(6);initD();setP(1);mkSw();mkFn();setF(0);mkCh();mkMat();auUi();setMode("t");rh();hudTick();loop();
