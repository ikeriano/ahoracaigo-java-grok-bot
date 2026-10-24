
import javax.microedition.midlet.*;
import javax.microedition.lcdui.*;
import javax.microedition.media.*;
import java.util.*;
import java.io.*;

public class AhoraCaigo extends MIDlet {
  G g;
  public void startApp(){ if(g==null){ g=new G(this); Display.getDisplay(this).setCurrent(g); new Thread(g).start(); } }
  public void pauseApp(){}
  public void destroyApp(boolean u){ if(g!=null) g.run=false; }
  void quit(){ destroyApp(true); notifyDestroyed(); }
}

class G extends Canvas implements Runnable, CommandListener {
static final String FC="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.,!\u00a1?\u00bf:-\u20ac\"'()/%+>< ";
static final String FD="0E11131519110E040C040404040E0E11010204081F1F02040201110E02060A121F02021F101E0101110E0608101E11110E1F0102040808080E11110E11110E0E11110F01020C0E11111F1111111E11111E11111E0E11101010110E1E11111111111E1F10101E10101F1F10101E1010100E11101711110F1111111F1111110E04040404040E0702020202120C111214181412111010101010101F111B1515111111111119151311110E11111111110E1E11111E1010100E11111115120D1E11111E1412110F10100E01011E1F0404040404041111111111110E11111111110A041111111515150A11110A040A111111110A040404041F01020408101F00000000000C0C000000000C040804040404040004040004040404040E1101020400040400040810110E000C0C000C0C000000001F00000007081E081E08070A0A000000000004040000000000020408080804020804020202040801010204081010181902040813030004041F040400080402010204080204081008040200000000000000";

  static final String FC2="_;=";
  static final String FD2="0000000000001F000C0C000C040800001F001F0000";
  static final String[] NAMES={"LOLA","PACO","MARI","JUANJO","ROC\u00cdO","TONI","CARMEN","RA\u00daL","NURIA","PEPE"};
  static final int[] COLS={0xe04040,0x40a0e0,0xe0c040,0x40c060,0xc060e0,0xe08040,0x40e0d0,0xa0a0a0,0xff80c0,0x8060ff};
  static final int[] CIFRAS={5000,5000,2000,2000,1000,1000,500,500,10000,20000};
  static final String[] PNAME={"CL\u00c1SICO","ENTRE TRES","\u00a1ADIVINA!","\u00a1VAYA L\u00cdO!","\u00bfS\u00cd O NO?","\u00a1DAME LETRA!"};
  static final String[] PDICHO={"DUELO CL\u00c1SICO: COMPLETAD LA PALABRA ANTES DE QUE SE ACABE VUESTRO RELOJ.","\u00a1OS TOCA ENTRE TRES! TRES RESPUESTAS Y SOLO CINCO SEGUNDOS PARA ELEGIR.","\u00a1PRUEBA ADIVINA! LAS PISTAS SALEN UNA A UNA: EL PRIMERO QUE LO SEPA, QUE PULSE.","\u00a1VAYA L\u00cdO! LAS LETRAS EST\u00c1N REVUELTAS: LEED LA DEFINICI\u00d3N Y ESCRIBID LA PALABRA BIEN ORDENADA.","\u00bfS\u00cd O NO? UNA PREGUNTA CADA UNO, CINCO SEGUNDOS Y SOLO DOS BOTONES.","\u00a1DAME LETRA! PEDID UNA LETRA POR TURNOS Y, SI SAB\u00c9IS LA FRASE, DECIDLA ENTERA EN DIEZ SEGUNDOS."};
  static final int W=240,H=320;
  static final int M_TITLE=0,M_SAY=1,M_HUELLA=2,M_ANN=3,M_DUEL=4,M_FALL=5,M_COIN=6,M_SPIN=7,M_PLANT=8,M_FINAL=9,M_END=10;
  AhoraCaigo mid; boolean run=true; Image host,logo,bg,hbg; Random rnd=new Random();
  Vector qC=new Vector(),qE=new Vector(),qS=new Vector(),qA=new Vector(),qL=new Vector(),qV=new Vector();
  int ox,oy,mode=M_TITLE,next; float mt; Vector says=new Vector(); boolean skip,menu,snd=true;
  int puntos,duelo,cur=-1,meFallWho=-99; int[] com=new int[2]; boolean meOut; boolean[] out=new boolean[10],shown=new boolean[10]; int[] prueba=new int[10];
  int[][] pos=new int[10][2]; float fallT; int fallWho; boolean lastWin; int endPrize; boolean endWin;
  // botones
  int[][] bt=new int[12][5]; int nb;
  // duelo
  int ptype,turn; float[] cl=new float[2]; float t,ait,aiT,flash; int aistep; boolean aipass; int stage; String buf=""; String msg="";
  // pregunta de palabra
  String wq,wextra,word,miss,rev,exact; boolean[] hid; int wpos;
  // quick
  String qq; String[] qo; int qc,qsel; float aiAt;
  // adivina
  String[] adv; int clue; int who;
  // dame letra
  String dcat,dfr,dused,drev;
  // final
  Vector fq=new Vector(); int fok; float fcl;
  // moneda
  int[] cv=new int[2]; int side;
  TextBox tb; Command ok=new Command("OK",Command.OK,1);

  G(AhoraCaigo m){ mid=m; setFullScreenMode(true);
    try{ host=Image.createImage("/host.png"); logo=Image.createImage("/logo.png"); }catch(Exception e){}
    load();
    for(int i=0;i<10;i++){ double a=Math.PI*(0.06+0.88*i/9.0); pos[i][0]=(int)(120-Math.cos(a)*106); pos[i][1]=(int)(136-Math.sin(a)*34)+(i%2==1?5:0); }
    bg=Image.createImage(W,160); Graphics b=bg.getGraphics();
    for(int y=0;y<160;y++){ b.setColor(0x14+(0x2c*y/160),0,0x3a+(0x10*y/160)); b.drawLine(0,y,W,y); }
    b.setColor(0xff2a55); b.fillRect(40,14,160,4); b.fillRect(40,14,4,60); b.fillRect(196,14,4,60);
    b.setColor(0x1a1060); b.fillRect(44,18,152,56);
    for(int r=60,k=0;r>4;r-=8,k++){ b.setColor(k%2==1?0xff4020:0xffa040); int h=(int)(r/3.2); b.fillArc(120-r,52-h,2*r,2*h,0,360); }
    for(int i=0;i<12;i++){ b.setColor(i%2==1?0xff60ff:0x60c0ff); b.fillRect(6+i*20,4,4,4); }
    for(int y=78;y<110;y+=6){ b.setColor(0xc01848); b.fillRect(0,y,W,3); }
    b.setColor(0xd8d0f0); b.fillRect(0,110,W,50); b.setColor(0xb8a8e0); for(int y=112;y<160;y+=8) b.drawLine(0,y,W,y);
    hbg=Image.createImage(W,184); b=hbg.getGraphics();
    for(int y=0;y<184;y++){ int k=Math.abs(y-90); b.setColor(0x3a-k/6,0x6c-k/3,0xff-k/2); b.drawLine(0,y,W,y); }
    for(int r=120,k=0;r>20;r-=14,k++){ b.setColor(k%2==1?0xc05040:0xc0a060); int h=(int)(r*0.42); b.drawArc(120-r,96-h,2*r,2*h,0,360); b.drawArc(121-r,97-h,2*r-2,2*h-2,0,360); }
  }
  // ---------- datos ----------
  void load(){ try{ InputStream is=getClass().getResourceAsStream("/data.txt"); Reader rd=new InputStreamReader(is,"UTF-8"); StringBuffer sb=new StringBuffer(); int c;
      while((c=rd.read())!=-1){ if(c=='\n'){ line(sb.toString()); sb.setLength(0);} else sb.append((char)c);} if(sb.length()>0) line(sb.toString()); rd.close(); }catch(Exception e){} }
  void line(String s){ Vector v=new Vector(); int i=0; while(true){ int j=s.indexOf('\t',i); if(j<0){ v.addElement(s.substring(i)); break;} v.addElement(s.substring(i,j)); i=j+1; }
    String[] a=new String[v.size()-1]; for(int k=1;k<v.size();k++) a[k-1]=(String)v.elementAt(k); char t=s.charAt(0);
    if(t=='C') qC.addElement(a); else if(t=='E') qE.addElement(a); else if(t=='S') qS.addElement(a); else if(t=='A') qA.addElement(a); else if(t=='L') qL.addElement(a); else if(t=='V') qV.addElement(a); }
  String[] pick(Vector v){ return (String[])v.elementAt(r(v.size())); }
  int r(int n){ return (rnd.nextInt()>>>1)%n; }
  float rf(){ return r(10000)/10000f; }
  static String up(String s){ StringBuffer b=new StringBuffer(); for(int i=0;i<s.length();i++){ char c=s.charAt(i); if((c>='a'&&c<='z')||(c>=0xe0&&c<=0xfe&&c!=0xf7)) c=(char)(c-32); b.append(c);} return b.toString(); }
  static final String AC1="\u00c1\u00c0\u00c4\u00c2\u00c9\u00c8\u00cb\u00ca\u00cd\u00cc\u00cf\u00ce\u00d3\u00d2\u00d6\u00d4\u00da\u00d9\u00dc\u00db", AC2="AAAAEEEEIIIIOOOOUUUU";
  static char nc(char c){ if((c>='a'&&c<='z')||(c>=0xe0&&c<=0xfe&&c!=0xf7)) c=(char)(c-32); int k=AC1.indexOf(c); return k>=0?AC2.charAt(k):c; }
  static boolean isL(char c){ return (c>='A'&&c<='Z')||c=='\u00d1'||(c>='0'&&c<='9'); }
  static String nrm(String s){ StringBuffer b=new StringBuffer(); for(int i=0;i<s.length();i++){ char c=nc(s.charAt(i)); if(isL(c)) b.append(c);} return b.toString(); }
  float skill(){ return Math.min(0.92f,0.5f+duelo*0.04f); }
  // ---------- sonido ----------
  void beep(int n,int ms){ if(!snd) return; try{ Manager.playTone(n,ms,60);}catch(Exception e){} }
  void sOk(){beep(76,80);} void sBad(){beep(45,200);} void sTap(){beep(90,25);} void sLet(){beep(81,40);} void sFall(){beep(60,500);} void sTick(){beep(96,15);}
  // ---------- fuente ----------
  void glyph(Graphics g,char c,int x,int y,int s){ int a=0;
    switch(c){case '\u00c1':c='A';a=1;break;case '\u00c9':c='E';a=1;break;case '\u00cd':c='I';a=1;break;case '\u00d3':c='O';a=1;break;case '\u00da':c='U';a=1;break;case '\u00d1':c='N';a=2;break;case '\u00dc':c='U';a=3;break;}
    String D=FD; int k=FC.indexOf(c); if(k<0){ k=FC2.indexOf(c); D=FD2; } if(k<0){ D=FD; k=FC.indexOf('?'); }
    for(int rr=0;rr<7;rr++){ int v=Integer.parseInt(D.substring(k*14+rr*2,k*14+rr*2+2),16); for(int cc=0;cc<5;cc++) if((v&(16>>cc))!=0) g.fillRect(x+cc*s,y+(rr+2)*s,s,s); }
    if(a==1){g.fillRect(x+2*s,y+s,s,s);g.fillRect(x+3*s,y,s,s);} else if(a==2){g.fillRect(x,y+s,s,s);g.fillRect(x+s,y,2*s,s);g.fillRect(x+3*s,y+s,s,s);g.fillRect(x+4*s,y,s,s);} else if(a==3){g.fillRect(x+s,y,s,s);g.fillRect(x+3*s,y,s,s);} }
  void txt(Graphics g,String t,int x,int y,int col,int sh){ t=up(t); if(sh>=0){ g.setColor(sh); for(int i=0;i<t.length();i++) glyph(g,t.charAt(i),x+i*6+1,y+1,1);} g.setColor(col); for(int i=0;i<t.length();i++) glyph(g,t.charAt(i),x+i*6,y,1); }
  int tw(String t){ return t.length()*6-1; }
  void ct(Graphics g,String t,int y,int col,int sh){ txt(g,t,(W-tw(t))/2,y,col,sh); }
  void ctx(Graphics g,String t,int x,int w,int y,int col,int sh){ txt(g,t,x+(w-tw(t))/2,y,col,sh); }
  String[] wrap(String t,int max){ Vector L=new Vector(); String l=""; int i=0;
    while(i<=t.length()){ int j=t.indexOf(' ',i); if(j<0) j=t.length(); String w=t.substring(i,j); String nn=l.length()>0?l+" "+w:w; if(nn.length()>max&&l.length()>0){ L.addElement(l); l=w; } else l=nn; i=j+1; }
    if(l.length()>0) L.addElement(l); String[] R=new String[L.size()]; L.copyInto(R); return R; }
  void para(Graphics g,String t,int y,int max,int col){ String[] L=wrap(up(t),37); for(int i=0;i<L.length&&i<max;i++) ct(g,L[i],y+i*10,col,0); }
  String fmt(int v){ String s=""+v; StringBuffer b=new StringBuffer(); for(int i=0;i<s.length();i++){ if(i>0&&(s.length()-i)%3==0) b.append('.'); b.append(s.charAt(i)); } return b.toString(); }
  String clk(float s){ if(s<0) s=0; int ds=(int)(s*10); int m=ds/600, sec=(ds/10)%60, d=ds%10; return (m<10?"0":"")+m+":"+(sec<10?"0":"")+sec+"."+d; }
  void box(Graphics g,int x,int y,int w,int h,int f,int b){ g.setColor(b); g.fillRect(x,y,w,h); g.setColor(f); g.fillRect(x+1,y+1,w-2,h-2); }
  void btn(Graphics g,int x,int y,int w,int h,String l,int s,int id){ int[] F={0x2040c0,0x20a040,0xc02020,0xc0a020,0x505060}; box(g,x,y,w,h,F[s],0xffffff); g.setColor(0x7090f0); g.fillRect(x+2,y+2,w-4,2);
    String[] L=wrap(up(l),(w-6)/6); for(int i=0;i<L.length&&i<2;i++) ctx(g,L[i],x,w,y+(h-L.length*10)/2+i*10-1,0xffffff,0);
    if(id>=0&&nb<bt.length){ bt[nb][0]=x;bt[nb][1]=y;bt[nb][2]=w;bt[nb][3]=h;bt[nb][4]=id; nb++; } }
  // ---------- flujo ----------
  void say(String s){ says.addElement(s); }
  void flush(int nx){ next=nx; if(skip||says.size()==0){ says.removeAllElements(); go(nx); } else { mode=M_SAY; mt=0; } }
  void go(int m){ mode=m; mt=0; nb=0; skip=false;
    if(m==M_DUEL) startDuel(); if(m==M_FINAL){ fq.removeAllElements(); for(int i=0;i<10;i++){ newWord(0); fq.addElement(saveW()); } loadW((Object[])fq.elementAt(0)); fok=0; fcl=120; } }
  void newGame(){ puntos=0; duelo=0; com[0]=com[1]=2; meOut=false; for(int i=0;i<10;i++){ out[i]=false; shown[i]=false; prueba[i]=r(6);} prueba[r(10)]=0;
    say("\u00a1HOLA! SOY ARTURO VALLS Y ESTO ES \u00a1AHORA CAIGO!"); say("DIEZ OPONENTES TE RODEAN. T\u00da EST\u00c1S EN LA TRAMPILLA CENTRAL."); say("GANA DIEZ DUELOS, TIRA LA MONEDA Y LL\u00c9VATE EL PREMIO. \u00a1SI PIERDES, TE CAES!");
    duelo=1; flush(M_HUELLA); }
  void afterFall(){ if(fallWho<0){ if(mode==M_FALL&&next==M_FINAL){} meOut=true; say("\u00a1QU\u00c9 PENA! TE HAS CA\u00cdDO. PIERDES "+fmt(puntos)+" PUNTOS."); endWin=false; endPrize=0; flush(M_END); }
    else { out[fallWho]=true; cur=-1; int c=CIFRAS[duelo-1]; if(r(2)==0){cv[0]=c;cv[1]=c*2;}else{cv[0]=c*2;cv[1]=c;} go(M_COIN);} }
  // ---------- palabras ----------
  void newWord(int kind){ if(kind==3){ String[] v=pick(qV); wq=v[0]; wextra="LETRAS: "+up(v[1]); word=up(v[2]); hid=new boolean[word.length()]; for(int i=0;i<word.length();i++) hid[i]=word.charAt(i)!=' '; exact=nrm(word); wpos=0; miss=""; rev=""; return; }
    String[] v=pick(qC); wq=v[0]; wextra=null; exact=null; String p=up(v[1]); StringBuffer w=new StringBuffer(); Vector hv=new Vector(); boolean in=false;
    for(int i=0;i<p.length();i++){ char c=p.charAt(i); if(c=='['){in=true;continue;} if(c==']'){in=false;continue;} w.append(c); hv.addElement(in?"1":"0"); }
    word=w.toString(); hid=new boolean[word.length()]; miss=""; rev=""; for(int i=0;i<word.length();i++){ hid[i]=hv.elementAt(i).equals("1"); if(hid[i]){ char n=nc(word.charAt(i)); if(miss.indexOf(n)<0) miss+=n; } } }
  Object[] saveW(){ return new Object[]{wq,wextra,word,miss,rev,exact,hid,new Integer(wpos)}; }
  void loadW(Object[] o){ wq=(String)o[0]; wextra=(String)o[1]; word=(String)o[2]; miss=(String)o[3]; rev=(String)o[4]; exact=(String)o[5]; hid=(boolean[])o[6]; wpos=((Integer)o[7]).intValue(); }
  boolean wDone(){ if(exact!=null) return wpos>=exact.length(); for(int i=0;i<miss.length();i++) if(rev.indexOf(miss.charAt(i))<0) return false; return true; }
  int tryL(char ch){ char n=nc(ch); if(!isL(n)) return 0; if(exact!=null){ if(exact.charAt(wpos)==n){ wpos++; return 1;} return -1; } if(miss.indexOf(n)>=0&&rev.indexOf(n)<0){ rev+=n; return 1;} return -1; }
  String showW(){ StringBuffer s=new StringBuffer(); int k=0; for(int i=0;i<word.length();i++){ char c=word.charAt(i); if(!hid[i]||c==' '){ s.append(c); continue;} if(exact!=null){ s.append(k<wpos?c:'_'); k++; } else s.append(rev.indexOf(nc(c))>=0?c:'_'); } return s.toString(); }
  void drawW(Graphics g,int y){ String[] L=wrap(showW(),18); for(int l=0;l<L.length&&l<2;l++){ String t=L[l]; int x0=(W-t.length()*12)/2; for(int i=0;i<t.length();i++){ char c=t.charAt(i); if(c==' ') continue; box(g,x0+i*12,y+l*20,11,18,c=='_'?0x203080:0xf0f0ff,0); if(c!='_'){ g.setColor(0x102060); glyph(g,c,x0+i*12+1,y+l*20+1,1);} } } }
  // ---------- duelos ----------
  void startDuel(){ ptype=prueba[cur]; com[1]=2; turn=1; t=0; stage=0; buf=""; msg=""; flash=0;
    if(ptype==0||ptype==3){ cl[0]=cl[1]=30; newWord(ptype); aiPlan(); }
    else if(ptype==1||ptype==4){ newQuick(); }
    else if(ptype==2){ adv=pick(qA); clue=0; who=-1; }
    else { String[] v=pick(qL); dcat=up(v[0]); dfr=up(v[1]); dused=""; drev=""; } }
  void aiPlan(){ float sk=skill(); ait=0; aiT=2+rf()*12*(1.15f-sk); aistep=0; aipass=com[1]>0&&rf()<0.25f*(1-sk)+0.1f; }
  void nextTurn(boolean nq){ turn=1-turn; if(nq) newWord(ptype); if(turn==1) aiPlan(); }
  void newQuick(){ if(ptype==1){ String[] e=pick(qE); qq=e[0]; int c=Integer.parseInt(e[4]); int[] o={0,1,2}; for(int k=2;k>0;k--){ int j=r(k+1); int x=o[k]; o[k]=o[j]; o[j]=x; } qo=new String[3]; for(int k=0;k<3;k++){ qo[k]=e[1+o[k]]; if(o[k]==c) qc=k; } }
    else { String[] s=pick(qS); qq=s[0]; qo=new String[]{"S\u00cd","NO"}; qc=s[1].equals("1")?0:1; } qsel=-1; t=0; stage=0; aiAt=1+rf()*2.5f; }
  void endDuel(boolean win){ lastWin=win; kbdClose(); fallWho=win?cur:-1; fallT=0; sFall(); mode=M_FALL; mt=0; }
  void choose(int i){ if(stage!=0) return; qsel=i; stage=1; t=0; if(i==qc) sOk(); else sBad(); }
  // letras recibidas (teclado o TextBox)
  void key(char ch){
    if(mode==M_DUEL&&(ptype==0||ptype==3)&&turn==0){ int rr=tryL(ch); if(rr==1){ sLet(); if(wDone()){ sOk(); nextTurn(true);} } else if(rr==-1){ sBad(); flash=0.4f; } }
    else if(mode==M_FINAL){ int rr=tryL(ch); if(rr==1){ sLet(); if(wDone()){ sOk(); fq.removeElementAt(0); fok++; if(fok>=10){ endWin=true; endPrize=puntos*2; say("\u00a1PERFECTO! HAS COMPLETADO EL JUEGO FINAL."); flush(M_END); return;} loadW((Object[])fq.elementAt(0)); } } else if(rr==-1){ sBad(); flash=0.4f; } }
    else if(mode==M_DUEL&&ptype==5&&turn==0&&stage==0){ askL(nc(ch)); }
  }
  void text(String s){ // texto completo (adivina / resolver)
    if(mode==M_DUEL&&ptype==2&&stage==2){ buf=up(s); boolean okk=nrm(s).equals(nrm(adv[1])); stage=3; t=0; if(okk) sOk(); else sBad(); lastWin=okk; }
    else if(mode==M_DUEL&&ptype==5&&turn==0&&(stage==1||stage==2)){ buf=up(s); solveDL(nrm(s).equals(nrm(dfr))); }
    else for(int i=0;i<s.length();i++) key(s.charAt(i)); }
  void askL(char L){ if(!(L>='A'&&L<='Z')&&L!='\u00d1') return; if(dused.indexOf(L)>=0) return; dused+=L; if(nrm(dfr).indexOf(L)>=0){ drev+=L; sLet(); msg="HAY "+L; } else { sBad(); msg="NO HAY "+L; } stage=1; t=0; }
  float dratio(){ String a=nrm(dfr); int n=0,k=0; String seen=""; for(int i=0;i<a.length();i++){ char c=a.charAt(i); if(c>='0'&&c<='9') continue; if(seen.indexOf(c)>=0) continue; seen+=c; n++; if(drev.indexOf(c)>=0) k++; } return n==0?1:k/(float)n; }
  String dshow(){ StringBuffer s=new StringBuffer(); for(int i=0;i<dfr.length();i++){ char c=dfr.charAt(i), n=nc(c); s.append(((n>='A'&&n<='Z')||n=='\u00d1')&&drev.indexOf(n)<0?'_':c);} return s.toString(); }
  void solveDL(boolean okk){ if(okk){ sOk(); msg="\u00a1CORRECTO!"; drev=nrm(dfr); } else { sBad(); msg="\u00a1FALLO!"; } lastWin=(turn==0)==okk; stage=3; t=0; }
  void dlPass(){ turn=1-turn; stage=0; t=0; buf=""; msg=turn==0?"PIDE UNA LETRA":""; }
  // ---------- teclado del móvil (TextBox) ----------
  void kbdOpen(String title,int max){ tb=new TextBox(title,"",max,TextField.ANY); tb.addCommand(ok); tb.setCommandListener(this); Display.getDisplay(mid).setCurrent(tb); }
  void kbdClose(){ if(tb!=null){ tb=null; Display.getDisplay(mid).setCurrent(this);} }
  public void commandAction(Command c,Displayable d){ String s=tb!=null?tb.getString():""; kbdClose(); text(s); }
  // ---------- lógica por frame ----------
  void update(float dt){ if(menu) return; mt+=dt;
    if(mode==M_FALL){ fallT+=dt; if(fallT>1.5f) afterFall(); return; }
    if(mode==M_ANN&&mt>1.6f){ say(PDICHO[prueba[cur]]); flush(M_DUEL); return; }
    if(mode==M_SPIN&&mt>3f){ puntos+=cv[side]; sOk(); say("\u00a1SUMAS "+fmt(cv[side])+" PUNTOS! LLEVAS "+fmt(puntos)+"."); if(duelo>=10){ flush(M_PLANT);} else { duelo++; flush(M_HUELLA);} return; }
    if(mode==M_FINAL){ fcl-=dt; flash=Math.max(0,flash-dt); if(fcl<=0){ fallWho=-1; fallT=0; sFall(); mode=M_FALL; kbdClose(); } return; }
    if(mode!=M_DUEL) return;
    t+=dt; flash=Math.max(0,flash-dt);
    if(ptype==0||ptype==3){ cl[turn]-=dt; if(cl[turn]<=0){ cl[turn]=0; endDuel(turn==1); return; }
      if(turn==1){ ait+=dt; if(aipass&&ait>2.5f){ aipass=false; com[1]--; sTap(); nextTurn(false); return; }
        int need=exact!=null?exact.length():miss.length(); int want=(int)(need*Math.min(1,ait/aiT));
        while(aistep<want){ aistep++; if(exact!=null) wpos++; else for(int i=0;i<miss.length();i++) if(rev.indexOf(miss.charAt(i))<0){ rev+=miss.charAt(i); break; } sLet(); }
        if(ait>=aiT&&wDone()){ sOk(); nextTurn(true);} } }
    else if(ptype==1||ptype==4){ if(stage==0){ if(t>=5){ qsel=-2; stage=1; t=0; sBad(); return;} if(turn==1&&t>aiAt){ boolean o=rf()<skill()+0.12f; choose(o?qc:(qc+1+r(qo.length-1))%qo.length);} }
      else if(t>1.2f){ if(qsel!=qc){ endDuel(turn==1); return;} turn=1-turn; newQuick(); } }
    else if(ptype==2){ if(stage==0){ if(t>3.5f){ t=0; if(clue<adv.length-3) { clue++; sTap(); } else { adv=pick(qA); clue=0; } }
        if(rf()<dt*(0.05f+clue*0.09f*skill())){ stage=1; t=0; who=1; sTap(); } }
      else if(stage==1){ String rsp=up(adv[1]); buf=rsp.substring(0,Math.min(rsp.length(),(int)(t*4))); if(t>2.5f){ boolean o=rf()<0.55f+0.35f*skill(); if(o){ buf=rsp; sOk(); lastWin=false;} else { buf="\u00a1FALLO!"; sBad(); lastWin=true; } stage=3; t=0; } }
      else if(stage==2){ if(t>=10){ sBad(); stage=3; t=0; lastWin=false; kbdClose(); } }
      else if(stage==3&&t>1.3f) endDuel(lastWin); }
    else if(ptype==5){ if(stage==3){ if(t>1.4f) endDuel(lastWin); return; }
      if(turn==1){ String fr="EAOSRNIDLCTUMPBGVYQHFZJ\u00d1XKW"; if(stage==0&&t>1.2f){ for(int i=0;i<fr.length();i++) if(dused.indexOf(fr.charAt(i))<0){ askL(fr.charAt(i)); break; } }
        else if(stage==1&&t>1.5f){ float rt=dratio(); if(rt>0.85f-0.35f*skill()||rt>=1){ stage=4; t=0; msg=NAMES[cur]+" RESUELVE..."; } else dlPass(); }
        else if(stage==4&&t>2){ solveDL(true); } }
      else if((stage==1||stage==2)&&t>=10){ if(stage==2){ sBad(); msg="\u00a1TIEMPO!"; lastWin=false; stage=3; t=0; kbdClose(); } else dlPass(); } }
  }
  public void run(){ long last=System.currentTimeMillis(); while(run){ long n=System.currentTimeMillis(); float dt=Math.min(0.1f,(n-last)/1000f); last=n; update(dt); repaint(); serviceRepaints(); try{ Thread.sleep(33);}catch(Exception e){} } }
  // ---------- dibujo ----------
  void person(Graphics g,int x,int y,int col,boolean me){ g.setColor(0); g.fillRect(x-4,y-17,9,13); g.setColor(col); g.fillRect(x-3,y-10,7,8); g.setColor(0xf0c090); g.fillRect(x-2,y-16,5,5); g.setColor(0x302010); g.fillRect(x-2,y-17,5,2); g.setColor(0); g.fillRect(x-1,y-14,1,1); g.fillRect(x+1,y-14,1,1); if(me){ g.setColor(0xffd040); g.fillRect(x-3,y-3,7,1);} }
  void foot(Graphics g,int x,int y){ g.setColor(0); g.fillRect(x-4,y-9,4,8); g.fillRect(x+1,y-9,4,8); g.setColor(0xffd020); g.fillRect(x-3,y-8,2,6); g.fillRect(x+2,y-8,2,6); }
  void tramp(Graphics g,int x,int y,boolean open,boolean hl){ g.setColor(hl?0xffff40:0x606080); g.fillArc(x-11,y-4,22,8,0,360); g.setColor(open?0:0xe8e8ff); g.fillArc(x-9,y-3,18,6,0,360); }
  boolean blink(int ms){ return (System.currentTimeMillis()/ms)%2==0; }
  void plato(Graphics g){ g.drawImage(bg,0,13,0);
    for(int i=0;i<10;i++){ int x=pos[i][0],y=pos[i][1]; boolean fl=mode==M_FALL&&fallWho==i; tramp(g,x,y,out[i]||fl,cur==i||(mode==M_HUELLA&&!out[i]&&!shown[i]&&blink(330)));
      if(out[i]&&!fl) continue; if(!shown[i]){ foot(g,x,y); txt(g,""+(i+1),x-(i==9?5:2),y+3,0xffd040,0); continue; }
      int dy=fl?(int)Math.min(30,fallT*fallT*40):0; g.setClip(0,0,W,y); person(g,x,y+dy,COLS[i],false); g.setClip(0,0,W,H); }
    boolean mf=mode==M_FALL&&fallWho<0; tramp(g,120,150,mf||meOut,mode==M_DUEL&&turn==0);
    if(!meOut){ g.setClip(0,0,W,150); person(g,120,150+(mf?(int)Math.min(30,fallT*fallT*40):0),0xffffff,true); g.setClip(0,0,W,H);} txt(g,"T\u00da",115,154,0xffd040,0); }
  void header(Graphics g){ g.setColor(0); g.fillRect(0,0,W,13); g.setColor(0x1040c0); g.fillRect(0,11,W,2); txt(g,fmt(puntos)+" PTS",3,1,0xffd040,-1); String d="DUELO "+Math.min(10,duelo)+"/10"; txt(g,d,W-tw(d)-3,1,0xffffff,-1); }
  void soft(Graphics g,String l,String r){ g.setColor(0); g.fillRect(0,H-18,W,18); g.setColor(0x606080); g.drawLine(0,H-18,W,H-18); g.setColor(0x8090e0); g.fillRect(74,H-14,92,10); g.setColor(0xffffff); g.fillRect(74,H-14,92,2);
    if(l!=null) txt(g,l,4,H-15,0xffffff,0); if(r!=null) txt(g,r,W-tw(r)-4,H-15,0xffffff,0); }
  void hostView(Graphics g){ g.drawImage(hbg,0,13,0); if(host!=null) g.drawImage(host,40,13,0);
    g.setColor(0); g.fillRect(10,157,220,30); g.setColor(0xf4f0ff); g.fillRect(11,158,218,6); g.setColor(0xc02050); g.fillRect(11,164,218,22); g.setColor(0x801030); g.fillRect(11,178,218,8); g.setColor(0xffd040); g.fillRect(11,184,218,2);
    header(g); g.setColor(0); g.fillRect(0,186,W,116); g.setColor(0x902880); g.fillRect(0,187,W,58); g.setColor(0x701868); g.fillRect(0,245,W,57); }
  void clocks(Graphics g,int y){ box(g,2,y,116,14,turn==0?0xc01040:0x303050,0xffffff); txt(g,"T\u00da "+clk(cl[0]),6,y+2,0xffffff,0); box(g,122,y,116,14,turn==1?0xc01040:0x303050,0xffffff); String s=NAMES[cur]+" "+clk(cl[1]); txt(g,s,234-tw(s),y+2,0xffffff,0);
    for(int j=0;j<2;j++) for(int i=0;i<com[j];i++){ int x=j==0?4+i*10:W-12-i*10; box(g,x,y+17,8,8,0xffd040,0); g.setColor(0); glyph(g,'P',x+1,y+15,1);} }
  protected void paint(Graphics G0){ ox=(getWidth()-W)/2; oy=(getHeight()-H)/2; G0.setColor(0); G0.fillRect(0,0,getWidth(),getHeight()); G0.translate(ox,oy); G0.setClip(0,0,W,H); Graphics g=G0; nb=0;
    if(mode==M_TITLE){ g.drawImage(hbg,0,0,0); g.drawImage(hbg,0,184,0); if(logo!=null) g.drawImage(logo,30,26,0); ct(g,"EDICI\u00d3N M\u00d3VIL 2008",156,0xffd040,0); ct(g,"CON ARTURO VALLS",170,0xffffff,0); if(blink(500)) ct(g,"TOCA PARA JUGAR",236,0xffffff,0); ct(g,"FAN-GAME NO OFICIAL",284,0x8090d0,-1); soft(g,"MEN\u00da","JUGAR"); }
    else if(mode==M_SAY||mode==M_COIN||mode==M_SPIN||mode==M_PLANT||mode==M_END){ hostView(g);
      if(mode==M_SAY){ para(g,(String)says.elementAt(0),205,8,0xffffff); soft(g,"MEN\u00da","OMITIR"); }
      else if(mode==M_COIN){ para(g,"ESCOGE UN LADO DE LA MONEDA Y VEAMOS QU\u00c9 SUMAMOS A TU MARCADOR.",196,4,0xffffff); btn(g,14,250,100,30,"HUELLA BLANCA",0,0); btn(g,126,250,100,30,"HUELLA NEGRA",0,1); soft(g,"MEN\u00da",null); }
      else if(mode==M_SPIN){ float k=Math.min(1,mt/1.6f); int w=(int)(Math.abs(Math.cos(k*Math.PI*7))*24)+2; g.setColor(0); g.fillArc(119-w,201,2*w+2,50,0,360); g.setColor(0xffd040); g.fillArc(120-w,202,2*w,48,0,360); g.setColor(0xc09020); g.fillArc(125-w,207,Math.max(2,2*w-10),38,0,360);
        if(k>=1){ foot(g,120,236); ct(g,"+"+fmt(cv[side])+" PUNTOS",262,0xffffff,0);} soft(g,"MEN\u00da",null); }
      else if(mode==M_PLANT){ para(g,"\u00bfTE PLANTAS CON LA MITAD DE LO QUE HAS ACUMULADO O TE ATREVES CON EL JUEGO FINAL PARA DOBLAR?",194,5,0xffffff); btn(g,10,262,106,30,"ME PLANTO ("+fmt(puntos/2)+")",0,0); btn(g,124,262,106,30,"JUEGO FINAL",3,1); soft(g,"MEN\u00da",null); }
      else { box(g,10,192,220,104,endWin?0x20a040:0xa01020,0xffffff); ctx(g,endWin?"\u00a1ENHORABUENA!":"\u00a1TE HAS CA\u00cdDO!",10,220,200,0xffffff,0); ctx(g,"PREMIO: "+fmt(endPrize)+" PUNTOS",10,220,222,0xffd040,0); ctx(g,"TOCA PARA JUGAR OTRA",10,220,272,blink(500)?0xffffff:0xaaaaaa,-1); soft(g,"MEN\u00da","SALIR"); } }
    else { header(g); plato(g); g.setColor(0x101030); g.fillRect(0,173,W,129); g.setColor(0x1040c0); g.drawLine(0,173,W,173);
      if(mode==M_HUELLA){ para(g,"\u00a1ELIGE UNA HUELLA! DETR\u00c1S DE CADA HUELLA HAY UN OPONENTE.",200,3,0xffffff); soft(g,"MEN\u00da",null); }
      else if(mode==M_ANN){ para(g,"\u00a1"+NAMES[cur]+"! PRUEBA: "+PNAME[prueba[cur]],200,3,0xffd040); soft(g,"MEN\u00da",null); }
      else if(mode==M_FALL){ para(g,fallWho>=0?"\u00a1AHORA CAIGO... "+NAMES[fallWho]+"!":"\u00a1OOOH! \u00a1TE HAS CA\u00cdDO!",200,3,0xffffff); soft(g,"MEN\u00da",null); }
      else if(mode==M_FINAL){ box(g,0,174,W,12,0xc0a020,0); ct(g,"JUEGO FINAL  ACIERTOS "+fok+"/10  "+clk(fcl),175,0,-1); String[] L=wrap(up(wq),38); for(int i=0;i<L.length&&i<4;i++) ct(g,L[i],190+i*10,0xffffff,0);
        int y=194+Math.min(4,L.length)*10; drawW(g,y); ct(g,blink(500)?"TOCA AQU\u00cd Y ESCRIBE":"PASAR: LA DEJAS PARA LUEGO",286,0xffd040,0); soft(g,"MEN\u00da","PASAR"); }
      else if(mode==M_DUEL) drawDuel(g); }
    if(menu){ g.setColor(0); for(int y=0;y<H;y+=2) g.drawLine(0,y,W,y); box(g,36,70,168,150,0x202060,0xffffff); ctx(g,"MEN\u00da",36,168,76,0xffd040,-1); nb=0;
      btn(g,48,92,144,24,"CONTINUAR",0,100); btn(g,48,122,144,24,"SONIDO: "+(snd?"S\u00cd":"NO"),0,101); btn(g,48,152,144,24,"SALIR",0,102); soft(g,null,"VOLVER"); }
    G0.translate(-ox,-oy); }
  void drawDuel(Graphics g){
    if(ptype==0||ptype==3){ String[] L=wrap(up(wq),38); for(int i=0;i<L.length&&i<4;i++) ct(g,L[i],177+i*10,0xffffff,0); int y=179+Math.min(4,L.length)*10; if(wextra!=null){ ct(g,wextra,y,0xffd040,0); y+=11; }
      drawW(g,y+2); clocks(g,269); ct(g,turn==0?(blink(500)?"TOCA AQU\u00cd Y ESCRIBE":"\u00a1TU TURNO!"):"RESPONDE "+NAMES[cur],286,turn==0?0xffd040:0xaaaaaa,0); soft(g,"MEN\u00da","PASAR"); }
    else if(ptype==1||ptype==4){ ct(g,"RESPONDE: "+(turn==0?"T\u00da":NAMES[cur]),176,turn==0?0xffd040:0x88ccff,0); String[] L=wrap(up(qq),38); for(int i=0;i<L.length&&i<4;i++) ct(g,L[i],188+i*10,0xffffff,0); int y=190+Math.min(4,L.length)*10+2;
      float left=stage==0?Math.max(0,5-t):0; g.setColor(0x400000); g.fillRect(20,y,200,4); g.setColor(left<2?0xff2222:0x22ff44); g.fillRect(20,y,(int)(200*left/5),4); y+=8;
      int n=qo.length; for(int i=0;i<n;i++){ int s=0; if(stage==1){ if(i==qc) s=1; else if(i==qsel) s=2; } else if(turn==1) s=4; String[] ab={"A: ","B: ","C: "};
        if(n==2) btn(g,8+i*116,y+4,110,40,qo[i],s,i); else btn(g,8,y+i*22,W-16,20,ab[i]+up(qo[i]),s,i); }
      soft(g,"MEN\u00da",null); }
    else if(ptype==2){ ct(g,"CATEGOR\u00cdA: "+up(adv[0]),176,0xffd040,0); for(int i=0;i<=clue;i++){ String[] L=wrap((i+1)+". "+up(adv[2+i]),38); ct(g,L[0],188+i*11,0xffffff,0); }
      if(stage==0) btn(g,50,246,140,26,"\u00a1LO S\u00c9!",3,0); else { box(g,8,246,224,16,0xffffff,0); txt(g,buf,12,249,0x102060,-1); ct(g,stage==2?"ESCRIBE LA RESPUESTA "+clk(10-t):(who==1?"RESPONDE "+NAMES[cur]:""),265,0xffd040,0); }
      soft(g,"MEN\u00da",null); }
    else { ct(g,dcat,176,0xffd040,0); String[] L=wrap(dshow(),36); for(int i=0;i<L.length&&i<4;i++) ct(g,L[i],188+i*11,0xffffff,0); ct(g,"USADAS: "+dused,234,0x8090c0,-1);
      ct(g,msg.length()>0?msg:(turn==1?"PIDE LETRA "+NAMES[cur]:""),245,0x88ccff,0);
      if(turn==0){ if(stage==0) ct(g,blink(500)?"TOCA Y ESCRIBE UNA LETRA":"\u00a1PIDE UNA LETRA!",260,0xffd040,0);
        else if(stage==1){ ct(g,"\u00bfRESUELVES? "+clk(10-t),258,0xffd040,0); btn(g,8,270,110,20,"\u00a1RESOLVER!",3,0); btn(g,122,270,110,20,"PASO",0,1); } }
      soft(g,"MEN\u00da",null); } }
  // ---------- toque ----------
  protected void pointerPressed(int px,int py){ tap(px-ox,py-oy); }
  int hit(int x,int y){ for(int i=nb-1;i>=0;i--) if(x>=bt[i][0]&&x<bt[i][0]+bt[i][2]&&y>=bt[i][1]&&y<bt[i][1]+bt[i][3]) return bt[i][4]; return -1; }
  void tap(int x,int y){ boolean sL=y>=H-20&&x<80, sR=y>=H-20&&x>W-90; int b=hit(x,y);
    if(menu){ if(sR||b==100){ menu=false; } else if(b==101){ snd=!snd; } else if(b==102){ mid.quit(); } sTap(); return; }
    if(sL){ menu=true; sTap(); return; }
    switch(mode){
      case M_TITLE: sTap(); newGame(); return;
      case M_SAY: sTap(); if(sR){ says.removeAllElements(); skip=true; } else says.removeElementAt(0); if(says.size()==0){ int n=next; go(n);} return;
      case M_HUELLA: { int best=-1,bd=500; for(int i=0;i<10;i++){ if(out[i]||shown[i]) continue; int dx=x-pos[i][0],dy=y-(pos[i][1]-5),d=dx*dx+dy*dy; if(d<bd){bd=d;best=i;} } if(best>=0){ sTap(); cur=best; shown[best]=true; mode=M_ANN; mt=0; } return; }
      case M_COIN: if(b==0||b==1){ side=b; mode=M_SPIN; mt=0; beep(100,60);} return;
      case M_PLANT: if(b==0){ endWin=true; endPrize=puntos/2; say("\u00a1TE PLANTAS! TE LLEVAS "+fmt(puntos/2)+" PUNTOS."); flush(M_END);} else if(b==1){ say("\u00a1JUEGO FINAL! DIEZ PREGUNTAS EN DOS MINUTOS. SI LO CONSIGUES, \u00a1DOBLAS TU MARCADOR!"); flush(M_FINAL);} return;
      case M_END: sTap(); if(sR) mid.quit(); else newGame(); return;
      case M_FINAL: if(sR){ sTap(); fq.addElement(saveW()); fq.removeElementAt(0); loadW((Object[])fq.elementAt(0)); } else kbdOpen("JUEGO FINAL",20); return;
      case M_DUEL:
        if(ptype==0||ptype==3){ if(turn!=0) return; if(sR){ sTap(); if(com[0]>0){ com[0]--; nextTurn(false);} else newWord(ptype); } else kbdOpen("ESCRIBE LAS LETRAS",20); }
        else if(ptype==1||ptype==4){ if(turn==0&&b>=0){ sTap(); choose(b);} }
        else if(ptype==2){ if(stage==0&&b==0){ stage=2; t=0; who=0; buf=""; sTap(); kbdOpen("\u00a1LO S\u00c9!",24);} else if(stage==2) kbdOpen("\u00a1LO S\u00c9!",24); }
        else { if(turn!=0) return; if(stage==0) kbdOpen("PIDE UNA LETRA",1); else if(stage==1&&b==0){ stage=2; sTap(); kbdOpen("RESUELVE LA FRASE",60);} else if(stage==1&&b==1){ sTap(); dlPass(); } else if(stage==2) kbdOpen("RESUELVE LA FRASE",60); }
    } }
  protected void keyPressed(int k){ // teclados QWERTY y teclas de función
    if(k==-6||k==-21||k==21){ tap(10,H-5); return;} if(k==-7||k==-22||k==22){ tap(W-10,H-5); return;}
    if(k>=32&&k<0xffff&&(mode==M_DUEL||mode==M_FINAL)){ char c=(char)k; if(mode==M_DUEL&&ptype==5&&turn==0&&stage==0){ askL(nc(c)); return;} key(c); return; }
    if(mode==M_SAY||mode==M_TITLE||mode==M_END) tap(120,200); }
}
