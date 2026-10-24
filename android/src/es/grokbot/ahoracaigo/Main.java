package es.grokbot.ahoracaigo;
import android.app.Activity;import android.os.Bundle;import android.webkit.*;import android.view.*;import android.graphics.Color;
public class Main extends Activity{WebView w;
 protected void onCreate(Bundle b){super.onCreate(b);getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
  w=new WebView(this);w.setBackgroundColor(Color.BLACK);WebSettings s=w.getSettings();s.setJavaScriptEnabled(true);s.setMediaPlaybackRequiresUserGesture(false);s.setAllowFileAccess(true);
  w.setLayerType(View.LAYER_TYPE_HARDWARE,null);w.setVerticalScrollBarEnabled(false);w.setHorizontalScrollBarEnabled(false);
  setContentView(w);w.loadUrl("file:///android_asset/index.html");hide();}
 void hide(){getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_LAYOUT_STABLE);}
 public void onWindowFocusChanged(boolean f){super.onWindowFocusChanged(f);if(f)hide();}
 protected void onPause(){super.onPause();w.onPause();w.pauseTimers();}
 protected void onResume(){super.onResume();w.onResume();w.resumeTimers();}
 public void onBackPressed(){w.evaluateJavascript("S.menu=!S.menu",null);}
}
