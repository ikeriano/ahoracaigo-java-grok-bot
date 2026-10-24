"use strict";
var C=document.getElementById('c'),X=C.getContext('2d');X.imageSmoothingEnabled=false;
var W=240,H=320;
function fit(){var s=Math.min(innerWidth/W,innerHeight/H);if(s>=1)s=Math.floor(s*4)/4;C.style.width=W*s+'px';C.style.height=H*s+'px';C.style.left=((innerWidth-W*s)/2)+'px';C.style.top=((innerHeight-H*s)/2)+'px';}
addEventListener('resize',fit);fit();
// ---------- fuente bitmap 5x7 ----------
var G={A:"0E11111F111111",B:"1E11111E11111E",C:"0E11101010110E",D:"1E11111111111E",E:"1F10101E10101F",F:"1F10101E101010",G:"0E11101711110F",H:"1111111F111111",I:"0E04040404040E",J:"07020202021 20C".replace(' ',''),K:"11121418141211",L:"1010101010101F",M:"111B1515111111",N:"11111915131111",O:"0E11111111110E",P:"1E11111E101010",Q:"0E11111115120D",R:"1E11111E141211",S:"0F10100E01011E",T:"1F040404040404",U:"1111111111110E",V:"1111111111 0A04".replace(' ',''),W:"1111111515150A",X:"11110A040A1111",Y:"11110A04040404",Z:"1F01020408101F",
"0":"0E111315191 10E".replace(' ',''),"1":"040C040404040E","2":"0E11010204081F","3":"1F02040201110E","4":"02060A121F0202","5":"1F101E0101110E","6":"0608101E11110E","7":"1F010204080808","8":"0E11110E11110E","9":"0E11110F01020C",
".":"00000000000C0C",",":"000000000C0408","!":"04040404040004","¡":"04000404040404","?":"0E110102040004","¿":"0400040810110E",":":"000C0C000C0C00","-":"0000001F000000","€":"07081E081E0807","\"":"0A0A0000000000","'":"04040000000000","(":"02040808080402",")":"08040202020408","/":"01010204081010","%":"18190204081303","+":"0004041F040400",">":"08040201020408","<":"02040810080402"," ":"00000000000000","X2":"0"};
var ACC={"Á":["A",1],"É":["E",1],"Í":["I",1],"Ó":["O",1],"Ú":["U",1],"Ñ":["N",2],"Ü":["U",3]};
function glyph(ctx,ch,x,y,s){var a=0;if(ACC[ch]){a=ACC[ch][1];ch=ACC[ch][0];}var g=G[ch];if(!g)g=G["?"];
 for(var r=0;r<7;r++){var v=parseInt(g.substr(r*2,2),16);for(var c=0;c<5;c++)if(v&(16>>c))ctx.fillRect(x+c*s,y+(r+2)*s,s,s);}
 if(a==1){ctx.fillRect(x+2*s,y+s,s,s);ctx.fillRect(x+3*s,y,s,s);}else if(a==2){ctx.fillRect(x,y+s,s,s);ctx.fillRect(x+s,y,2*s,s);ctx.fillRect(x+3*s,y+s,s,s);ctx.fillRect(x+4*s,y,s,s);}else if(a==3){ctx.fillRect(x+s,y,s,s);ctx.fillRect(x+3*s,y,s,s);}}
function txt(t,x,y,col,s,sh){t=(t+"").replace(/[«»“”]/g,'"').replace(/[‘’]/g,"'");if(typeof s=="string"){var q=sh;sh=s;s=q;}s=s||1;t=(t+"").toUpperCase();if(sh){X.fillStyle=sh;for(var i=0;i<t.length;i++)glyph(X,t[i],x+i*6*s+s,y+s,s);}X.fillStyle=col;for(var i=0;i<t.length;i++)glyph(X,t[i],x+i*6*s,y,s);}
function tw(t,s){return t.length*6*(s||1)-(s||1);}
function ctxt(t,y,col,s,sh){txt(t,Math.round((W-tw(t,s))/2),y,col,s,sh);}
function wrap(t,max){var w=t.split(' '),L=[],l='';for(var i=0;i<w.length;i++){var n=l?l+' '+w[i]:w[i];if(n.length>max){if(l)L.push(l);l=w[i];}else l=n;}if(l)L.push(l);return L;}
// ---------- audio: solo pitidos 8-bit ----------
var AC=null,SND=true;
function beep(f,d,type,f2,vol){if(!SND)return;try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type=type||'square';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(vol||0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+0.02);}catch(e){}}
function sOk(){beep(660,0.08);setTimeout(function(){beep(990,0.15)},90);}
function sBad(){beep(200,0.3,'sawtooth',90);}
function sFall(){beep(880,0.7,'square',60,0.06);}
function sTap(){beep(1200,0.03);}
function sTick(){beep(1500,0.02,'square',0,0.04);}
function sJingle(){[523,659,784,1046].forEach(function(f,i){setTimeout(function(){beep(f,0.12)},i*120)});}
G[";"]="000C0C000C0408";G["_"]="0000000000001F";G["="]="00001F001F0000";G["*"]="00150E1F0E1500";
// ---------- audio: solo pitidos 8-bit (sin voces) ----------
var AC=null,SND=true;
function beep(f,d,type,f2,vol){if(!SND)return;try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type=type||'square';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(vol||0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+0.02);}catch(e){}}
function sOk(){beep(660,0.08);setTimeout(function(){beep(990,0.15)},90);}
function sBad(){beep(200,0.25,'sawtooth',90);}
function sFall(){beep(880,0.8,'square',60,0.06);}
function sTap(){beep(1200,0.03);}
function sTick(){beep(1500,0.02,'square',0,0.035);}
function sLetter(){beep(880,0.05,'triangle',0,0.1);}
function sCoin(){for(var i=0;i<6;i++)(function(i){setTimeout(function(){beep(1300+i*120,0.05)},i*70)})(i);}
function sJingle(){[523,659,784,1046,784,1046].forEach(function(f,i){setTimeout(function(){beep(f,0.12)},i*120)});}
// ---------- utilidades ----------
function U(s){return (s+"").toUpperCase();}
function nrm(c){return U(c).normalize('NFD').replace(/[\u0300-\u0302\u0304-\u036f]/g,'').replace(/N\u0303/g,'Ñ');}
function rnd(n){return Math.floor(Math.random()*n);}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t;}return a;}
var USED={};function pick(k){var b=D[k];USED[k]=USED[k]||{};var ks=Object.keys(USED[k]);if(ks.length>=b.length)USED[k]={};var i;do i=rnd(b.length);while(USED[k][i]);USED[k][i]=1;return b[i];}
function fmt(n){return (""+Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function clk(s){s=Math.max(0,s);var m=Math.floor(s/60),r=s-m*60;return (m<10?"0":"")+m+":"+(r<10?"0":"")+r.toFixed(1);}
// ---------- gráficos ----------
var HOST=new Image();HOST.src='host.png';var LOGO=new Image();LOGO.src='logo.png';
function mk(w,h,f){var c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'));return c;}
var BG=mk(W,160,function(b){var gr=b.createLinearGradient(0,0,0,160);gr.addColorStop(0,'#14003a');gr.addColorStop(1,'#40004a');b.fillStyle=gr;b.fillRect(0,0,W,160);
 b.fillStyle='#ff2a55';b.fillRect(40,14,160,4);b.fillRect(40,14,4,60);b.fillRect(196,14,4,60);b.fillStyle='#1a1060';b.fillRect(44,18,152,56);
 for(var r=60,k=0;r>4;r-=8,k++){b.fillStyle=k%2?'#ff4020':'#ffa040';b.beginPath();b.ellipse(120,52,r,r/3.2,0,0,7);b.fill();}
 for(var i=0;i<12;i++){b.fillStyle=i%2?'#ff60ff':'#60c0ff';b.fillRect(6+i*20,4,4,4);}
 for(var y=78;y<110;y+=6){b.fillStyle='#c01848';b.fillRect(0,y,W,3);}
 b.fillStyle='#d8d0f0';b.fillRect(0,110,W,50);b.fillStyle='#b8a8e0';for(var y=112;y<160;y+=8)b.fillRect(0,y,W,1);
 b.fillStyle='rgba(0,0,0,.22)';for(var y=0;y<110;y+=2)for(var x=(y/2)%2;x<W;x+=2)b.fillRect(x,y,1,1);});
// fondo del presentador (estilo Glu: fondo de color con aros del logo)
var HBG=mk(W,184,function(b){var gr=b.createRadialGradient(120,80,10,120,90,170);gr.addColorStop(0,'#3a6cff');gr.addColorStop(1,'#0a1660');b.fillStyle=gr;b.fillRect(0,0,W,184);
 for(var r=120,k=0;r>20;r-=14,k++){b.strokeStyle=k%2?'rgba(255,80,40,.55)':'rgba(255,200,80,.45)';b.lineWidth=4;b.beginPath();b.ellipse(120,96,r,r*0.42,0,0,7);b.stroke();}
 for(var i=0;i<40;i++){b.fillStyle='rgba(255,255,255,'+(0.2+Math.random()*0.5)+')';b.fillRect(rnd(W),rnd(120),1,1);}
 b.fillStyle='rgba(0,0,0,.18)';for(var y=0;y<184;y+=2)for(var x=(y/2)%2;x<W;x+=2)b.fillRect(x,y,1,1);});
function desk(y){X.fillStyle='#000';X.fillRect(10,y-1,220,30);X.fillStyle='#f4f0ff';X.fillRect(11,y,218,6);X.fillStyle='#b0a8d0';X.fillRect(11,y+5,218,1);
 var g=X.createLinearGradient(0,y+6,0,y+28);g.addColorStop(0,'#e02050');g.addColorStop(1,'#700020');X.fillStyle=g;X.fillRect(11,y+6,218,22);
 X.fillStyle='#ffd040';X.fillRect(11,y+26,218,2);if(LOGO.complete)X.drawImage(LOGO,0,0,180,120,96,y+6,33,22);}
var NAMES=["LOLA","PACO","MARI","JUANJO","ROCÍO","TONI","CARMEN","RAÚL","NURIA","PEPE"];
var COLS=["#e04040","#40a0e0","#e0c040","#40c060","#c060e0","#e08040","#40e0d0","#a0a0a0","#ff80c0","#8060ff"];
var HAIR=["#3a2010","#101010","#c09040","#5a3010","#101010","#806040","#d0d0d0","#202020","#a03010","#402010"];
var POS=[];for(var i=0;i<10;i++){var a=Math.PI*(0.06+0.88*i/9);POS.push([Math.round(120-Math.cos(a)*106),Math.round(136-Math.sin(a)*34+(i%2?5:0))]);}
var ME=[120,150];
function person(x,y,col,hair,me){X.fillStyle='#000';X.fillRect(x-4,y-17,9,13);X.fillStyle=col;X.fillRect(x-3,y-10,7,8);X.fillStyle='#f0c090';X.fillRect(x-2,y-16,5,5);X.fillStyle=hair;X.fillRect(x-2,y-17,5,2);X.fillStyle='#000';X.fillRect(x-1,y-14,1,1);X.fillRect(x+1,y-14,1,1);if(me){X.fillStyle='#ffd040';X.fillRect(x-3,y-3,7,1);}}
function foot(x,y){X.fillStyle='#000';X.fillRect(x-4,y-9,4,8);X.fillRect(x+1,y-9,4,8);X.fillStyle='#ffd020';X.fillRect(x-3,y-8,2,6);X.fillRect(x+2,y-8,2,6);}
function tramp(x,y,open,hl){X.fillStyle=hl?'#ffff40':'#606080';X.beginPath();X.ellipse(x,y,11,4,0,0,7);X.fill();X.fillStyle=open?'#000':'#e8e8ff';X.beginPath();X.ellipse(x,y,9,3,0,0,7);X.fill();}
// ---------- reloj de juego y corrutinas ----------
var NOW=0,MENU=false,WAITS=[],SKIP=false;
function wait(ms){return new Promise(function(r){WAITS.push([NOW+ms/1000,r]);});}
// ---------- estado ----------
var S={scene:'title',puntos:0,duelo:0,riv:[],cur:-1,com:[2,2],view:null,blink:0};
var V=null; // vista actual: {mode:'host'|'plato', text, panel:fn, soft:[l,r], onTap:fn, onSoftR:fn}
var TAPR=null;function waitTap(){return new Promise(function(r){TAPR=r;});}
async function say(t,auto){if(SKIP)return;V={mode:'host',text:t,soft:["MENÚ","OMITIR"],tapNext:1};
 var p=waitTap();if(auto){await Promise.race([p,wait(auto)]);}else await p;TAPR=null;}
// ---------- entrada de texto (teclado del móvil) ----------
var INP=document.createElement('input');INP.setAttribute('autocomplete','off');INP.setAttribute('autocorrect','off');INP.setAttribute('autocapitalize','characters');INP.setAttribute('spellcheck','false');INP.setAttribute('enterkeyhint','go');
INP.style.cssText='position:absolute;left:0;bottom:0;width:1px;height:1px;opacity:0;border:0;padding:0;font-size:16px';document.body.appendChild(INP);
var KEYH=null; // function(ch) ; ch '\n' enter, '\b' borrar
INP.addEventListener('input',function(){var v=INP.value;INP.value='';if(KEYH)for(var i=0;i<v.length;i++)KEYH(v[i]);});
INP.addEventListener('keydown',function(e){if(!KEYH)return;if(e.key=='Enter'){e.preventDefault();KEYH('\n');}else if(e.key=='Backspace'&&!INP.value){KEYH('\b');}});
document.addEventListener('keydown',function(e){if(document.activeElement===INP||!KEYH)return;if(e.key.length==1)KEYH(e.key);else if(e.key=='Enter')KEYH('\n');else if(e.key=='Backspace')KEYH('\b');});
function kbd(on){if(on){INP.focus();}else{INP.blur();}}
// ---------- dibujo común ----------
function box(x,y,w,h,f,b){X.fillStyle=b||'#000';X.fillRect(x,y,w,h);X.fillStyle=f;X.fillRect(x+1,y+1,w-2,h-2);}
function ctxtIn(t,x,w,y,c,sh){txt(t,x+Math.round((w-tw(U(t)))/2),y,c,1,sh);}
function btn(x,y,w,h,label,state){var f=['#2040c0','#20a040','#c02020','#c0a020','#505060'][state||0];box(x,y,w,h,f,'#fff');X.fillStyle='rgba(255,255,255,.25)';X.fillRect(x+2,y+2,w-4,2);
 var L=wrap(U(label),Math.floor((w-6)/6));for(var i=0;i<L.length&&i<2;i++)ctxtIn(L[i],x,w,y+Math.floor((h-L.length*10)/2)+i*10-1,'#fff','#000');}
function soft(l,r){X.fillStyle='#000';X.fillRect(0,H-18,W,18);X.fillStyle='#606080';X.fillRect(0,H-18,W,1);
 var g=X.createLinearGradient(0,H-17,0,H);g.addColorStop(0,'#c0d0ff');g.addColorStop(1,'#304080');X.fillStyle=g;X.fillRect(74,H-14,92,10);X.fillStyle='#fff';X.fillRect(74,H-14,92,2);
 if(l)txt(l,4,H-15,'#fff','#000');if(r)txt(r,W-tw(U(r))-4,H-15,'#fff','#000');}
function header(){X.fillStyle='#000';X.fillRect(0,0,W,13);X.fillStyle='#1040c0';X.fillRect(0,11,W,2);txt(fmt(S.puntos)+" PTS",3,1,'#ffd040');var d="DUELO "+Math.min(10,S.duelo)+"/10";txt(d,W-tw(d)-3,1,'#fff');}
function panelText(t,y,h,col){var L=wrap(U(t),37);var y0=y+Math.max(2,Math.floor((h-L.length*10)/2));for(var i=0;i<L.length;i++)ctxtIn(L[i],0,W,y0+i*10,col||'#fff','#000');}
function plato(){X.drawImage(BG,0,13);
 for(var i=0;i<10;i++){var r=S.riv[i];if(!r)continue;var p=POS[i],y=p[1];var fl=S.fall&&S.fall.who==i;tramp(p[0],y,r.out||fl,S.cur==i||(S.hl&&!r.out&&!r.shown&&Math.floor(S.blink*3)%2));
  if(r.out&&!fl)continue;if(!r.shown&&S.huellas){foot(p[0],y);txt(""+(i+1),p[0]-(i==9?5:2),y+3,'#ffd040','#000');continue;}
  var dy=fl?Math.min(30,S.fall.t*S.fall.t*40):0;X.save();X.beginPath();X.rect(0,0,W,y);X.clip();person(p[0],y+dy,r.c,r.h);X.restore();}
 var my=ME[1],mf=S.fall&&S.fall.who==-1;tramp(ME[0],my,mf||S.meOut,S.turn==0&&S.inDuel);if(!S.meOut){X.save();X.beginPath();X.rect(0,0,W,my);X.clip();person(ME[0],my+(mf?Math.min(30,S.fall.t*S.fall.t*40):0),'#ffffff','#202020',1);X.restore();}
 txt("TÚ",ME[0]-5,my+4,'#ffd040','#000');}
function draw(){X.fillStyle='#000';X.fillRect(0,0,W,H);
 if(S.scene=='title'){X.drawImage(HBG,0,0,W,184,0,0,W,320);if(LOGO.complete)X.drawImage(LOGO,30,26);
  txt("EDICIÓN MÓVIL 2008",Math.round((W-tw("EDICIÓN MÓVIL 2008"))/2),156,'#ffd040','#000');ctxtIn("CON ARTURO VALLS",0,W,170,'#fff','#000');
  if(Math.floor(S.blink*2)%2)ctxtIn("TOCA PARA JUGAR",0,W,236,'#fff','#000');ctxtIn("FAN-GAME NO OFICIAL",0,W,284,'#8090d0');soft("MENÚ","JUGAR");}
 else if(V){if(V.mode=='host'){X.drawImage(HBG,0,13);if(HOST.complete)X.drawImage(HOST,40,13);desk(158);header();
   X.fillStyle='#000';X.fillRect(0,186,W,116);var g=X.createLinearGradient(0,187,0,301);g.addColorStop(0,'#a02890');g.addColorStop(1,'#601060');X.fillStyle=g;X.fillRect(0,187,W,115);
   if(V.text)panelText(V.text,190,V.panel?56:108);if(V.panel)V.panel();}
  else{header();plato();X.fillStyle='#101030';X.fillRect(0,173,W,129);X.fillStyle='#1040c0';X.fillRect(0,173,W,1);if(V.text)panelText(V.text,176,40);if(V.panel)V.panel();}
  soft(V.soft&&V.soft[0],V.soft&&V.soft[1]);}
 if(MENU){X.fillStyle='rgba(0,0,0,.75)';X.fillRect(0,0,W,H);box(36,70,168,150,'#202060','#fff');ctxtIn("MENÚ",36,168,76,'#ffd040');var it=menuItems();for(var i=0;i<it.length;i++)btn(48,92+i*30,144,24,it[i],0);soft("","VOLVER");}
}
function menuItems(){return ["CONTINUAR","SONIDO: "+(SND?"SÍ":"NO"),"CÓMO SE JUEGA","SALIR AL TÍTULO"];}
// ---------- botones táctiles de la vista ----------
var BTNS=[];function addBtn(x,y,w,h,f){BTNS.push([x,y,w,h,f]);}
C.addEventListener('pointerdown',function(e){e.preventDefault();var b=C.getBoundingClientRect();tap((e.clientX-b.left)*W/b.width,(e.clientY-b.top)*H/b.height);});
function tap(x,y){var sL=y>=H-20&&x<80,sR=y>=H-20&&x>W-90;
 if(MENU){if(sR){MENU=false;sTap();return;}var it=menuItems();for(var i=0;i<it.length;i++)if(x>=48&&x<192&&y>=92+i*30&&y<116+i*30){sTap();if(i==0)MENU=false;if(i==1)SND=!SND;if(i==2){MENU=false;help();}if(i==3){location.reload();}}return;}
 if(sL&&S.scene!='title'){MENU=true;sTap();kbd(false);return;}
 if(S.scene=='title'){sTap();if(sL){MENU=true;return;}S.scene='game';game();return;}
 if(V&&V.tapNext){sTap();if(sR)SKIP=true;if(TAPR){var r=TAPR;TAPR=null;r();}return;}
 if(sR&&V&&V.onSoftR){V.onSoftR();return;}
 for(var i=BTNS.length-1;i>=0;i--){var b=BTNS[i];if(x>=b[0]&&x<b[0]+b[2]&&y>=b[1]&&y<b[1]+b[3]){b[4](x,y);return;}}
 if(V&&V.onTap)V.onTap(x,y);}
async function help(){var old=V,sk=SKIP;SKIP=false;var L=["ELIGE UNA HUELLA: DETRÁS HAY UN OPONENTE Y UNA PRUEBA.","EN EL CLÁSICO CADA UNO TIENE SU RELOJ DE 30 SEGUNDOS. EMPIEZA EL OPONENTE.","ESCRIBE CON EL TECLADO LAS LETRAS QUE FALTAN. AL ACERTAR, EL TURNO PASA AL RIVAL.","PASAR: CON COMODÍN LA MISMA PREGUNTA PASA AL RIVAL. SIN COMODÍN, OTRA PREGUNTA Y TU RELOJ SIGUE.","GANA EL DUELO Y TIRA LA MONEDA. TRAS DIEZ DUELOS: PLÁNTATE CON LA MITAD O JUEGA EL JUEGO FINAL."];
 for(var i=0;i<L.length;i++)await say(L[i]);SKIP=sk;V=old;}
// ---------- bucle ----------
var last=0;function loop(t){var dt=Math.min(0.1,(t-last)/1000);last=t;S.blink+=dt;if(!MENU){NOW+=dt;if(S.tick)S.tick(dt);if(S.fall)S.fall.t+=dt;
 for(var i=WAITS.length-1;i>=0;i--)if(NOW>=WAITS[i][0]){var r=WAITS[i][1];WAITS.splice(i,1);r();}}
 BTNS=[];draw();requestAnimationFrame(loop);}requestAnimationFrame(loop);
