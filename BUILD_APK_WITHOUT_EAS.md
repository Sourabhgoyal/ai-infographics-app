# Build APK Without Expo EAS

You can build the Android APK **locally** or via **GitHub Actions**—no Expo account or EAS needed.

---

## Prerequisites (local build)

- **Node.js** (v18+)
- **Android Studio** (or Android SDK + JDK 17)
- **JAVA_HOME** set to JDK 17 (e.g. from Android Studio or standalone JDK)

---

## Option 1: Local build (debug APK – no signing)

Good for installing on your own device. No keystore or Expo login.

```bash
cd InfographicsApp

# 1. Install dependencies
npm install

# 2. Generate native Android project (creates android/ folder)
npx expo prebuild --platform android --clean

# 3. Build debug APK (no signing required)
cd android
./gradlew app:assembleDebug
# or on Windows: gradlew.bat app:assembleDebug

# 4. APK location
# android/app/build/outputs/apk/debug/app-debug.apk
```

Copy `app-debug.apk` to your phone and install (enable "Install from unknown sources" if prompted).

---

## Option 2: Local build (release APK – signed)

For a signed release APK (e.g. for distribution):

### 1. Generate a keystore (one-time)

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Move `my-upload-key.keystore` to `InfographicsApp/android/app/`.

### 2. Configure signing

Create or edit `android/app/build.gradle` and add inside `android { ... }`:

```gradle
signingConfigs {
    release {
        storeFile file('my-upload-key.keystore')
        storePassword 'YOUR_STORE_PASSWORD'
        keyAlias 'my-key-alias'
        keyPassword 'YOUR_KEY_PASSWORD'
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        // ... rest
    }
}
```

(Or use `gradle.properties` with `MYAPP_UPLOAD_*` and reference them—see [Expo local production](https://docs.expo.dev/guides/local-app-production/).)

### 3. Build release APK

```bash
cd InfographicsApp
npx expo prebuild --platform android --clean
cd android
./gradlew app:assembleRelease
```

APK: `android/app/build/outputs/apk/release/app-release.apk`.

---

## Option 3: GitHub Actions (no EAS, no local Android SDK)

The workflow in `.github/workflows/build-apk.yml` runs on push to `main`:

1. Checks out the repo
2. Runs `expo prebuild` and `gradlew assembleDebug`
3. Uploads **app-debug.apk** as an artifact

**To get the APK:**

1. Push to `main` (or trigger the workflow manually).
2. Open **Actions** → latest run → **Artifacts**.
3. Download **app-debug-apk** and unzip to get `app-debug.apk`.
4. Copy to your phone and install.

No Expo login or EAS token required.
