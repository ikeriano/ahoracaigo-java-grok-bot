#!/bin/sh
# Requiere lib/: ecj-4.6.1, cldcapi11/midpapi20-2.0.4 (microemu), proguard 7.4.2 (+core, log4j, kotlin-stdlib)
set -e; cd "$(dirname "$0")"; rm -rf cls jarin fin; mkdir cls jarin fin
java -jar lib/ecj-4.6.1.jar -source 1.3 -target 1.1 -encoding UTF-8 -nowarn -bootclasspath lib/cldcapi11-2.0.4.jar:lib/midpapi20-2.0.4.jar -d cls src/AhoraCaigo.java
cp cls/*.class res/* jarin/; (cd jarin && jar cf ../raw.jar *)
java -cp "lib/proguard-base-7.4.2.jar:lib/proguard-core-9.1.1.jar:lib/log4j-api-2.19.0.jar:lib/log4j-core-2.19.0.jar:lib/kotlin-stdlib-1.9.0.jar" proguard.ProGuard @pg.pro
(cd fin && jar xf ../pre.jar && rm -rf META-INF && jar cfm ../AhoraCaigo-Java-v1.0.jar ../MANIFEST.MF *)
S=$(wc -c < AhoraCaigo-Java-v1.0.jar); (grep -v Manifest-Version MANIFEST.MF; echo "MIDlet-Jar-URL: AhoraCaigo-Java-v1.0.jar"; echo "MIDlet-Jar-Size: $S") > AhoraCaigo-Java-v1.0.jad
