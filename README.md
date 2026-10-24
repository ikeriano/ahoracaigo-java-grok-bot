# ¡Ahora Caigo! — Edición móvil 2008 (estilo J2ME)

Fan-game no oficial al estilo de los juegos Java de móvil de 2008, con las mecánicas de la app Ahora Caigo:
10 duelos con elección de huella, pruebas (Clásico, Entre tres, ¡Adivina!, ¡Vaya lío!, ¿Sí o no?, ¡Dame letra!),
relojes de 30 s y comodines PASAR, moneda (huella blanca/negra), plantarse con la mitad o Juego Final (10 preguntas en 2 minutos, dobla el marcador).

- `web/` – juego en canvas 240x320 (fuente bitmap, pixel art, beeps 8-bit). Controles táctiles + teclado del dispositivo.
- `android/` – APK ligero WebView (build sin gradle: aapt2/javac/d8/apksigner). `KS_PASS=... sh android/build.sh`
- `j2me/` – MIDlet MIDP 2.0 / CLDC 1.1 real (`AhoraCaigo-Java-v1.0.jar/.jad`), táctil + TextBox para escribir.
- `art/` – generación del busto de Arturo Valls y del logo pixelado.

Audio: solo beeps 8-bit sintetizados. Sin clonación de voz.
