"use strict";
var CIFRAS=[5000,5000,2000,2000,1000,1000,500,500,10000,20000];
var PRUEBAS=["clasico","entretres","adivina","vayalio","sino","dameletra"];
var PNAME={clasico:"CLÁSICO",entretres:"ENTRE TRES",adivina:"¡ADIVINA!",vayalio:"¡VAYA LÍO!",sino:"¿SÍ O NO?",dameletra:"¡DAME LETRA!"};
var PDICHO={clasico:"DUELO CLÁSICO: COMPLETAD LA PALABRA ANTES DE QUE SE ACABE VUESTRO RELOJ.",entretres:"¡OS TOCA ENTRE TRES! TRES RESPUESTAS Y SOLO CINCO SEGUNDOS PARA ELEGIR.",adivina:"¡PRUEBA ADIVINA! LAS PISTAS SALEN UNA A UNA: EL PRIMERO QUE LO SEPA, QUE PULSE.",vayalio:"¡VAYA LÍO! LAS LETRAS ESTÁN REVUELTAS: LEED LA DEFINICIÓN Y ESCRIBID LA PALABRA BIEN ORDENADA.",sino:"¿SÍ O NO? UNA PREGUNTA CADA UNO, CINCO SEGUNDOS Y SOLO DOS BOTONES.",dameletra:"¡DAME LETRA! PEDID UNA LETRA POR TURNOS Y, SI SABÉIS LA FRASE, DECIDLA ENTERA EN DIEZ SEGUNDOS."};
function rname(){return S.riv[S.cur].n;}
function skill(){return Math.min(0.92,0.5+S.duelo*0.04);}
async function fallAnim(who){S.fall={who:who,t:0};sFall();await wait(1400);S.fall=null;if(who<0)S.meOut=true;else S.riv[who].out=true;}
// ---------- palabra con letras que faltan ----------
function parseP(p){var w="",hid=[];for(var i=0;i<p.length;i++){var c=p[i];if(c=='['){hid._n=1;continue;}if(c==']'){hid._n=0;continue;}w+=c;hid.push(!!hid._n);}var miss=[];for(var i=0;i<w.length;i++)if(hid[i]){var n=nrm(w[i]);if(miss.indexOf(n)<0)miss.push(n);}return {word:w,hid:hid,miss:miss,rev:[]};}
function newWordQ(kind){if(kind=='vayalio'){var t=pick('vl');var w=U(t[2]);var hid=[];for(var i=0;i<w.length;i++)hid.push(w[i]!=' ');return {q:t[0],extra:"LETRAS: "+U(t[1]),word:w,hid:hid,exact:w.split('').filter(function(c){return c!=' '}).map(nrm),pos:0,rev:[]};}
 var t=pick('cl');var o=parseP(U(t[1]));o.q=t[0];return o;}
function showWord(o){var s="";for(var i=0,k=0;i<o.word.length;i++){var c=o.word[i];if(!o.hid[i]||c==' '){s+=c;continue;}if(o.exact){s+=(k<o.pos?c:"_");k++;}else s+=(o.rev.indexOf(nrm(c))>=0?c:"_");}return s;}
function wordDone(o){return o.exact?o.pos>=o.exact.length:o.miss.every(function(m){return o.rev.indexOf(m)>=0});}
function tryLetter(o,ch){var n=nrm(ch);if(!/^[A-ZÑ0-9]$/.test(n))return 0;if(o.exact){if(o.exact[o.pos]==n){o.pos++;return 1;}return -1;}
 if(o.miss.indexOf(n)>=0&&o.rev.indexOf(n)<0){o.rev.push(n);return 1;}return -1;}
function drawWord(o,y){var s=showWord(o),L=wrap(s,18);for(var l=0;l<L.length&&l<2;l++){var t=L[l],w=t.length*12;var x0=Math.round((W-w)/2);
  for(var i=0;i<t.length;i++){var c=t[i];if(c!=' '){box(x0+i*12,y+l*20,11,18,c=='_'?'#203080':'#f0f0ff','#000');if(c!='_')txt(c,x0+i*12+1,y+l*20+1,'#102060',1);}}}}
function clocksBar(y,c0,c1,turn){box(2,y,116,14,turn==0?'#c01040':'#303050','#fff');txt("TÚ "+clk(c0),6,y+2,'#fff','#000');box(122,y,116,14,turn==1?'#c01040':'#303050','#fff');var t=rname()+" "+clk(c1);txt(t,236-tw(U(t))-2,y+2,'#fff','#000');}
function comIcons(y){for(var j=0;j<2;j++){for(var i=0;i<S.com[j];i++){var x=j==0?4+i*10:W-12-i*10;box(x,y,8,8,'#ffd040','#000');txt("P",x+1,y-2,'#000');}}}
// ---------- duelo clásico / vaya lío ----------
function duelWord(kind){return new Promise(function(done){var cl=[30,30],turn=1,q=newWordQ(kind),flash=0,ended=false,ai=null;S.inDuel=1;
 function aiPlan(){var sk=skill();ai={t:0,T:2+Math.random()*12*(1.15-sk),step:0,pass:S.com[1]>0&&Math.random()<0.25*(1-sk)+0.1};}
 function next(newq){turn=1-turn;S.turn=turn;if(newq)q=newWordQ(kind);if(turn==1){aiPlan();kbd(false);}}
 function end(loser){if(ended)return;ended=true;S.tick=null;KEYH=null;kbd(false);S.inDuel=0;done(loser==0?'lose':'win');}
 S.turn=turn;aiPlan();
 KEYH=function(ch){if(turn!=0||ended)return;if(ch=='\n'||ch=='\b')return;var r=tryLetter(q,ch);if(r==1){sLetter();if(wordDone(q)){sOk();setTimeout(function(){},0);next(true);}}else if(r==-1){sBad();flash=0.4;}};
 S.tick=function(dt){if(ended)return;cl[turn]-=dt;flash=Math.max(0,flash-dt);if(cl[turn]<=0){cl[turn]=0;end(turn);return;}
  if(cl[turn]<5&&Math.floor(cl[turn]*2)!=Math.floor((cl[turn]+dt)*2))sTick();
  if(turn==1){ai.t+=dt;if(ai.pass&&ai.t>2.5){ai.pass=false;S.com[1]--;sTap();next(false);return;}
   var need=q.exact?q.exact.length:q.miss.length;var want=Math.floor(need*Math.min(1,ai.t/ai.T));while(ai.step<want){ai.step++;if(q.exact)q.pos++;else{for(var i=0;i<q.miss.length;i++)if(q.rev.indexOf(q.miss[i])<0){q.rev.push(q.miss[i]);break;}}sLetter();}
   if(ai.t>=ai.T&&wordDone(q)){sOk();next(true);}}};
 V={mode:'plato',soft:["MENÚ","PASAR"],onSoftR:function(){if(turn!=0||ended)return;sTap();if(S.com[0]>0){S.com[0]--;next(false);}else{q=newWordQ(kind);}},
  onTap:function(){if(turn==0)kbd(true);},
  panel:function(){var L=wrap(U(q.q),38);for(var i=0;i<L.length&&i<4;i++)ctxtIn(L[i],0,W,177+i*10,'#fff','#000');var y=179+Math.min(4,L.length)*10;
   if(q.extra){ctxtIn(q.extra,0,W,y,'#ffd040','#000');y+=11;}
   drawWord(q,y+2);if(flash>0){X.fillStyle='rgba(255,0,0,.35)';X.fillRect(0,y,W,40);}
   clocksBar(269,cl[0],cl[1],turn);comIcons(286);
   ctxtIn(turn==0?(Math.floor(S.blink*2)%2?"TOCA AQUÍ Y ESCRIBE":"¡TU TURNO!"):"RESPONDE "+rname(),0,W,285,turn==0?'#ffd040':'#aaa','#000');}};});}
// ---------- entre tres / sí o no ----------
function duelQuick(kind){return new Promise(function(done){var turn=1,q,t=0,ans=-1,sel=-1,stage='ask',ended=false;S.inDuel=1;
 function newQ(){if(kind=='entretres'){var e=pick('e3');var o=shuf([0,1,2]);q={q:e[0],o:o.map(function(k){return e[1][k]}),c:o.indexOf(e[2])};}else{var s=pick('sn');q={q:s[0],o:["SÍ","NO"],c:s[1]?0:1};}sel=-1;t=0;stage='ask';S.turn=turn;}
 function choose(i){if(stage!='ask')return;sel=i;stage='res';t=0;if(i==q.c)sOk();else sBad();}
 newQ();
 S.tick=function(dt){if(ended)return;t+=dt;if(stage=='ask'){if(Math.floor(5-t)!=Math.floor(5-t+dt))sTick();if(t>=5){sel=-2;stage='res';t=0;sBad();return;}
   if(turn==1&&t>ai){var ok=Math.random()<skill()+0.12;choose(ok?q.c:(q.c+1+rnd(q.o.length-1))%q.o.length);}}
  else if(stage=='res'&&t>1.2){if(sel!=q.c){ended=true;S.tick=null;S.inDuel=0;done(turn==0?'lose':'win');return;}turn=1-turn;newQ();ai=1+Math.random()*2.5;}};
 var ai=1+Math.random()*2.5;
 V={mode:'plato',soft:["MENÚ",""],panel:function(){ctxtIn("RESPONDE: "+(turn==0?"TÚ":rname()),0,W,176,turn==0?'#ffd040':'#8cf','#000');
   var L=wrap(U(q.q),38);for(var i=0;i<L.length&&i<4;i++)ctxtIn(L[i],0,W,188+i*10,'#fff','#000');var y=190+Math.min(4,L.length)*10+2;
   var left=stage=='ask'?Math.max(0,5-t):0;X.fillStyle='#400';X.fillRect(20,y,200,4);X.fillStyle=left<2?'#f22':'#2f4';X.fillRect(20,y,200*left/5|0,4);y+=8;
   var n=q.o.length,bw=n==2?110:W-16;for(var i=0;i<n;i++){var st=0;if(stage=='res'){if(i==q.c)st=1;else if(i==sel)st=2;}else if(turn==1)st=4;
    var bx=n==2?(8+i*116):8,by=n==2?y+4:y+i*22;btn(bx,by,bw,n==2?40:20,(n==3?["A","B","C"][i]+": ":"")+q.o[i],st);
    (function(i){addBtn(bx,by,bw,n==2?40:20,function(){if(turn==0){sTap();choose(i);}});})(i);}}};});}
// ---------- ¡adivina! ----------
function duelAdivina(){return new Promise(function(done){var it,clue,t,stage,buf="",tt=0,ended=false,who=-1;S.inDuel=1;S.turn=-1;
 function newItem(){it=pick('adv');clue=0;t=0;stage='clues';buf="";who=-1;}
 function finish(res){ended=true;S.tick=null;KEYH=null;kbd(false);S.inDuel=0;setTimeout(function(){done(res)},1200);}
 function check(){var ok=nrm(buf).replace(/[^A-ZÑ0-9]/g,'')==nrm(it.r).replace(/[^A-ZÑ0-9]/g,'');stage='res';tt=0;if(ok){sOk();finish('win');}else{sBad();finish('lose');}}
 newItem();
 KEYH=function(ch){if(stage!='typing')return;if(ch=='\n'){check();return;}if(ch=='\b'){buf=buf.slice(0,-1);return;}if(buf.length<18)buf+=U(ch);};
 S.tick=function(dt){if(ended)return;t+=dt;
  if(stage=='clues'){if(t>3.5){t=0;if(clue<it.pistas.length-1){clue++;sTap();}else{newItem();return;}}
   if(Math.random()<dt*(0.05+clue*0.09*skill())){stage='rival';tt=0;who=1;sTap();}}
  else if(stage=='rival'){tt+=dt;buf=U(it.r).slice(0,Math.floor(tt*4));if(tt>2.5){var ok=Math.random()<0.55+0.35*skill();if(ok){buf=U(it.r);sOk();stage='res';finish('lose');}else{buf="¡FALLO!";sBad();stage='res';finish('win');}}}
  else if(stage=='typing'){tt+=dt;if(tt>=10){sBad();stage='res';finish('lose');}}};
 V={mode:'plato',soft:["MENÚ",""],onTap:function(){if(stage=='typing')kbd(true);},
  panel:function(){ctxtIn("CATEGORÍA: "+U(it.cat),0,W,176,'#ffd040','#000');for(var i=0;i<=clue;i++){var L=wrap((i+1)+". "+U(it.pistas[i]),38);ctxtIn(L[0],0,W,188+i*11,'#fff','#000');}
   var y=246;if(stage=='clues'){btn(50,y,140,26,"¡LO SÉ!",3);addBtn(50,y,140,26,function(){if(stage!='clues')return;stage='typing';tt=0;who=0;buf="";sTap();kbd(true);});}
   else{box(8,y,224,16,'#fff','#000');txt(buf+(Math.floor(S.blink*3)%2&&stage=='typing'?"_":""),12,y+3,'#102060');
    ctxtIn(stage=='typing'?"ESCRIBE Y PULSA OK  "+clk(10-tt):(who==1?"RESPONDE "+rname():""),0,W,y+19,'#ffd040','#000');
    if(stage=='typing'){btn(186,y+30,46,18,"OK",1);addBtn(186,y+30,46,18,function(){check();});}}}};});}
// ---------- ¡dame letra! ----------
function duelDameLetra(){return new Promise(function(done){var e=pick('dl'),cat=U(e[0]),fr=U(e[1]),rev=[],turn=1,stage='letra',t=0,buf="",ended=false,msg="",used=[];S.inDuel=1;S.turn=1;
 function show(){var s="";for(var i=0;i<fr.length;i++){var n=nrm(fr[i]);s+=/[A-ZÑ]/.test(n)&&rev.indexOf(n)<0?"_":fr[i];}return s;}
 function letters(){var a=[];for(var i=0;i<fr.length;i++){var n=nrm(fr[i]);if(/[A-ZÑ]/.test(n)&&a.indexOf(n)<0)a.push(n);}return a;}
 function ratio(){var a=letters();return a.filter(function(c){return rev.indexOf(c)>=0}).length/a.length;}
 function ask(L){L=nrm(L);if(!/^[A-ZÑ]$/.test(L)||used.indexOf(L)>=0)return false;used.push(L);if(fr.split('').map(nrm).indexOf(L)>=0){rev.push(L);sLetter();msg="HAY "+L;}else{sBad();msg="NO HAY "+L;}stage='decide';t=0;return true;}
 function pass(){turn=1-turn;S.turn=turn;stage='letra';t=0;buf="";if(turn==0)msg="PIDE UNA LETRA";}
 function finish(r){ended=true;S.tick=null;KEYH=null;kbd(false);S.inDuel=0;setTimeout(function(){done(r)},1400);}
 function solve(txt){var ok=nrm(txt).replace(/[^A-ZÑ]/g,'')==nrm(fr).replace(/[^A-ZÑ]/g,'');if(ok){rev=letters();sOk();msg="¡CORRECTO!";finish(turn==0?'win':'lose');}else{sBad();msg="¡FALLO!";finish(turn==0?'lose':'win');}stage='res';}
 KEYH=function(ch){if(turn!=0)return;if(stage=='letra'){ask(ch);return;}if(stage=='solve'){if(ch=='\n'){solve(buf);return;}if(ch=='\b'){buf=buf.slice(0,-1);return;}buf+=U(ch);}};
 var freq="EAOSRNIDLCTUMPBGVYQHFZJÑXKW";
 S.tick=function(dt){if(ended)return;t+=dt;
  if(turn==1){if(stage=='letra'&&t>1.2){for(var i=0;i<freq.length;i++)if(used.indexOf(freq[i])<0){ask(freq[i]);break;}}
   else if(stage=='decide'&&t>1.5){if(ratio()>0.85-0.35*skill()||ratio()>=1){stage='rsolve';t=0;msg=rname()+" RESUELVE...";}else{pass();}}
   else if(stage=='rsolve'&&t>2){solve(fr);}}
  else{if((stage=='decide'||stage=='solve')&&t>=10){if(stage=='solve'){sBad();msg="¡TIEMPO!";stage='res';finish('lose');}else pass();}}};
 msg="";V={mode:'plato',soft:["MENÚ",""],onTap:function(){if(turn==0&&(stage=='letra'||stage=='solve'))kbd(true);},
  panel:function(){ctxtIn(cat,0,W,176,'#ffd040','#000');var L=wrap(show(),36);for(var i=0;i<L.length&&i<4;i++)ctxtIn(L[i],0,W,188+i*11,'#fff','#000');
   ctxtIn("USADAS: "+used.join(""),0,W,234,'#8090c0');ctxtIn(msg||(turn==1?"PIDE LETRA "+rname():""),0,W,245,'#8cf','#000');
   if(turn==0){if(stage=='letra')ctxtIn(Math.floor(S.blink*2)%2?"TOCA Y ESCRIBE UNA LETRA":"¡PIDE UNA LETRA!",0,W,260,'#ffd040','#000');
    else if(stage=='decide'){ctxtIn("¿RESUELVES? "+clk(10-t),0,W,258,'#ffd040','#000');btn(8,270,110,20,"¡RESOLVER!",3);btn(122,270,110,20,"PASO",0);
     addBtn(8,270,110,20,function(){stage='solve';buf="";sTap();kbd(true);});addBtn(122,270,110,20,function(){sTap();kbd(false);pass();});}
    else if(stage=='solve'){box(4,258,232,14,'#fff','#000');var b=buf.slice(-37);txt(b,6,260,'#102060');ctxtIn("ENTER/OK PARA RESOLVER "+clk(10-t),0,W,276,'#ffd040','#000');btn(196,286,40,14,"OK",1);addBtn(196,284,40,18,function(){solve(buf);});}}}};});}
// ---------- moneda ----------
async function moneda(){var c=CIFRAS[S.duelo-1];var vals=shuf([c,c*2]);var side=-1,spin=0,res=-1;
 await new Promise(function(r){V={mode:'host',text:"ESCOGE UN LADO DE LA MONEDA Y VEAMOS QUÉ SUMAMOS A TU MARCADOR.",soft:["MENÚ",""],panel:function(){
  btn(14,250,100,30,"HUELLA BLANCA",0);btn(126,250,100,30,"HUELLA NEGRA",0);addBtn(14,250,100,30,function(){side=0;r();});addBtn(126,250,100,30,function(){side=1;r();});}};});
 sCoin();var t0=NOW;V={mode:'host',text:"",soft:["MENÚ",""],panel:function(){var k=Math.min(1,(NOW-t0)/1.6);var w=Math.abs(Math.cos(k*Math.PI*7))*24+2;
  X.fillStyle='#000';X.beginPath();X.ellipse(120,226,w+1,25,0,0,7);X.fill();X.fillStyle='#ffd040';X.beginPath();X.ellipse(120,226,w,24,0,0,7);X.fill();X.fillStyle='#c09020';X.beginPath();X.ellipse(120,226,Math.max(1,w-5),19,0,0,7);X.fill();
  if(k>=1){foot(120,236);ctxtIn("+"+fmt(vals[side])+" PUNTOS",0,W,262,'#fff','#000');}}};
 await wait(1700);S.puntos+=vals[side];sOk();await wait(1300);await say("¡SUMAS "+fmt(vals[side])+" PUNTOS! LLEVAS "+fmt(S.puntos)+".");}
// ---------- juego final ----------
function juegoFinal(){return new Promise(function(done){var Q=[];for(var i=0;i<10;i++)Q.push(newWordQ('clasico'));var ok=0,cl=120,flash=0,ended=false;S.turn=0;
 function fin(r){ended=true;S.tick=null;KEYH=null;kbd(false);done(r);}
 KEYH=function(ch){if(ended||ch=='\n'||ch=='\b')return;var q=Q[0];var r=tryLetter(q,ch);if(r==1){sLetter();if(wordDone(q)){sOk();Q.shift();ok++;if(ok>=10)fin(true);}}else if(r==-1){sBad();flash=0.4;}};
 S.tick=function(dt){cl-=dt;flash=Math.max(0,flash-dt);if(cl<10&&Math.floor(cl)!=Math.floor(cl+dt))sTick();if(cl<=0){cl=0;fin(false);}};
 V={mode:'plato',soft:["MENÚ","PASAR"],onSoftR:function(){if(ended)return;sTap();Q.push(Q.shift());},onTap:function(){kbd(true);},
  panel:function(){var q=Q[0];if(!q)return;box(0,174,W,12,'#c0a020','#000');ctxtIn("JUEGO FINAL  ACIERTOS "+ok+"/10  "+clk(cl),0,W,175,'#000');
   var L=wrap(U(q.q),38);for(var i=0;i<L.length&&i<4;i++)ctxtIn(L[i],0,W,190+i*10,'#fff','#000');var y=194+Math.min(4,L.length)*10;drawWord(q,y);if(flash>0){X.fillStyle='rgba(255,0,0,.35)';X.fillRect(0,y,W,40);}
   ctxtIn(Math.floor(S.blink*2)%2?"TOCA AQUÍ Y ESCRIBE":"PASAR: LA DEJAS PARA LUEGO",0,W,286,'#ffd040','#000');}};});}
// ---------- elección de huella ----------
function elegirHuella(){return new Promise(function(r){S.huellas=1;S.hl=1;V={mode:'plato',text:"¡ELIGE UNA HUELLA! DETRÁS DE CADA HUELLA HAY UN OPONENTE.",soft:["MENÚ",""],onTap:function(x,y){var best=-1,bd=500;for(var i=0;i<10;i++){var rv=S.riv[i];if(rv.out||rv.shown)continue;var dx=x-POS[i][0],dy=y-(POS[i][1]-5),d=dx*dx+dy*dy;if(d<bd){bd=d;best=i;}}
  if(best>=0){sTap();S.hl=0;S.cur=best;S.riv[best].shown=1;r(best);}}};});}
// ---------- partida ----------
async function game(){S.puntos=0;S.duelo=0;S.com=[2,2];S.meOut=false;S.riv=[];var pr=shuf(PRUEBAS.concat(shuf(PRUEBAS).slice(0,3)));pr[0]="clasico";
 for(var i=0;i<10;i++)S.riv.push({n:NAMES[i],c:COLS[i],h:HAIR[i],out:false,shown:0,p:pr[i]});SKIP=false;
 await say("¡HOLA! SOY ARTURO VALLS Y ESTO ES ¡AHORA CAIGO!");await say("DIEZ OPONENTES TE RODEAN. TÚ ESTÁS EN LA TRAMPILLA CENTRAL.");await say("GANA DIEZ DUELOS, TIRA LA MONEDA Y LLÉVATE EL PREMIO. ¡SI PIERDES, TE CAES!");
 for(var d=1;d<=10;d++){S.duelo=d;SKIP=false;var who=await elegirHuella();var r=S.riv[who];S.huellas=1;
  V={mode:'plato',text:"¡"+r.n+"! PRUEBA: "+PNAME[r.p],soft:["MENÚ",""]};await wait(1500);
  await say(PDICHO[r.p]);SKIP=false;S.com[1]=2;
  var res=await Promise.race([new Promise(function(z){window.__force=z;}),(r.p=='clasico'||r.p=='vayalio'?duelWord(r.p):r.p=='adivina'?duelAdivina():r.p=='dameletra'?duelDameLetra():duelQuick(r.p))]);S.tick=null;KEYH=null;S.inDuel=0;
  V={mode:'plato',text:res=='win'?"¡AHORA CAIGO... "+r.n+"!":"¡OOOH! ¡TE HAS CAÍDO!",soft:["MENÚ",""]};await wait(500);await fallAnim(res=='win'?who:-1);await wait(500);
  if(res!='win'){await say("¡QUÉ PENA! TE HAS CAÍDO EN EL DUELO "+d+". PIERDES "+fmt(S.puntos)+" PUNTOS.");return endScreen(false,0);}
  S.cur=-1;await moneda();}
 SKIP=false;var dec=await new Promise(function(r){V={mode:'host',text:"¿TE PLANTAS CON LA MITAD DE LO QUE HAS ACUMULADO O TE ATREVES CON EL JUEGO FINAL PARA DOBLAR?",soft:["MENÚ",""],panel:function(){
  btn(10,262,106,30,"ME PLANTO ("+fmt(S.puntos/2)+")",0);btn(124,262,106,30,"JUEGO FINAL",3);addBtn(10,262,106,30,function(){sTap();r(0);});addBtn(124,262,106,30,function(){sTap();r(1);});}};});
 if(dec==0){await say("¡TE PLANTAS! TE LLEVAS "+fmt(S.puntos/2)+" PUNTOS.");return endScreen(true,S.puntos/2);}
 await say("¡JUEGO FINAL! DIEZ PREGUNTAS EN DOS MINUTOS. SI LO CONSIGUES, ¡DOBLAS TU MARCADOR!");SKIP=false;
 var ok=await juegoFinal();if(ok){sJingle();await say("¡PERFECTO! HAS COMPLETADO EL JUEGO FINAL.");return endScreen(true,S.puntos*2);}
 V={mode:'plato',text:"¡SE ACABÓ EL TIEMPO!",soft:["MENÚ",""]};await fallAnim(-1);await say("¡SE ACABÓ EL TIEMPO! TE HAS CAÍDO CON TODO EL BOTE.");endScreen(false,0);}
function endScreen(win,p){if(win)sJingle();V={mode:'host',text:"",soft:["MENÚ","SALIR"],onSoftR:function(){location.reload();},onTap:function(){S.scene='game';game();},panel:function(){
 box(10,192,220,104,win?'#20a040':'#a01020','#fff');ctxtIn(win?"¡ENHORABUENA!":"¡TE HAS CAÍDO!",10,220,200,'#fff','#000');ctxtIn("PREMIO: "+fmt(p)+" PUNTOS",10,220,222,'#ffd040','#000');
 ctxtIn("DUELOS GANADOS: "+(win?10:S.duelo-1),10,220,240,'#fff');ctxtIn("TOCA PARA JUGAR OTRA",10,220,272,Math.floor(S.blink*2)%2?'#fff':'#aaa');}};}
