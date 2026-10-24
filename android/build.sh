set -e
cp ../web/* assets/ 2>/dev/null || { mkdir -p assets; cp ../web/* assets/; }
export JAVA_HOME=/home/box/jdk17 PATH=/home/box/jdk17/bin:$PATH
BT=/home/box/android-sdk/build-tools/34.0.0; AJ=/home/box/android-sdk/platforms/android-34/android.jar
KS=/workspace/java_ac/keystore/ahoracaigo-java.jks
rm -rf out; mkdir -p out/c out/dex
$BT/aapt2 compile --dir res -o out/res.zip
$BT/aapt2 link -o out/base.apk -I $AJ --manifest AndroidManifest.xml -A assets out/res.zip
javac --release 8 -cp $AJ -d out/c $(find src -name '*.java') 2>&1 | grep -v warning || true
$BT/d8 --min-api 21 --lib $AJ --output out/dex $(find out/c -name '*.class')
cp out/base.apk out/u.apk; python3 -c "import zipfile;zipfile.ZipFile(\"out/u.apk\",\"a\").write(\"out/dex/classes.dex\",\"classes.dex\")"
$BT/zipalign -f 4 out/u.apk out/a.apk
if [ ! -f $KS ]; then keytool -genkeypair -keystore $KS -alias ahoracaigo -keyalg RSA -keysize 2048 -validity 10000 -storepass ${KS_PASS:?set KS_PASS} -keypass ${KS_PASS:?set KS_PASS} -dname "CN=Ahora Caigo Java, O=Grok Bot, C=ES"; fi
$BT/apksigner sign --ks $KS --ks-pass pass:${KS_PASS:?set KS_PASS} --key-pass pass:${KS_PASS:?set KS_PASS} --out /workspace/java_ac/AhoraCaigo-Java-v1.0.apk out/a.apk
$BT/apksigner verify --print-certs /workspace/java_ac/AhoraCaigo-Java-v1.0.apk | head -3
ls -la /workspace/java_ac/*.apk
