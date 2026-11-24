# Savrajas Admin Android Application

The dedicated Android mobile application for **Savrajas IT Solutions**. Built to provide management and synchronization with the Savrajas website and Supabase cloud database.

## Key Features
- **Secure PIN Access:** Dedicated numeric keypad with auto-submit and JWT session token generation.
- **Dashboard Overview:** Real-time metrics for client pipeline value, total inquiries, project counts, and cloud sync status.
- **Leads & Inquiries CRM:**
  - View client requests submitted through the website.
  - Filter by status: *All*, *New*, *Contacted*, *Converted*.
  - One-tap WhatsApp chat button with pre-filled messages.
  - One-tap Phone call dialer.
  - Update inquiry status with live sync to the backend.
- **Portfolio Manager:**
  - View case studies.
  - Add new case studies (Title, Category, Description, Tags, Client, Link).
  - Edit or delete case studies (automatically updates the website's portfolio).
- **Pricing Editor:**
  - Modify Starter, Professional, and Enterprise packages directly from mobile.
  - Edits immediately synchronize to the website.
- **Offline Resilience:** Local caching with automatic offline fallbacks and error handling.

## Build Artifacts
- Ready-to-install debug APK: `android-app/apk/savrajas-admin.apk`
- Gradle build output: `android-app/app/build/outputs/apk/debug/app-debug.apk`

## How to Build from Source

### Prerequisites
- JDK 17 (Eclipse Adoptium / OpenJDK)
- Android SDK (API 34/35)

### Building the APK
```powershell
cd android-app
.\gradlew.bat assembleDebug
```

### Installing on Device / Emulator via ADB
```powershell
adb install -r apk/savrajas-admin.apk
```

## Backend Connection
The Android app is pre-configured to connect via `android-app/app/src/main/assets/public/js/api-client.js`:
- Production / Remote backend: Configurable in Settings.
- Android Emulator: Defaulting to `http://10.0.2.2:5000/api`
- Local Wi-Fi device testing: Set the Backend URL in App Settings (e.g., `http://192.168.x.x:5000/api`).

