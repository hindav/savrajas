# Savrajas Admin Android App 📱⚡

The official mobile administration console for **Savrajas** ([savrajas.in](https://savrajas.in)).

---

## 🚀 Quick Start (Local Run)

1. Open your terminal in this folder:
   ```powershell
   cd "savrajas-admin"
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Launch the App:
   ```powershell
   npm run dev
   ```
   Open `http://localhost:3001` in your browser.

---

## 📲 Install on Android Phone (Instant PWA)

1. Connect your Android phone to the same Wi-Fi network as your computer.
2. Open Google Chrome on your phone and browse to:
   ```
   http://<YOUR_COMPUTER_IP>:3001
   ```
3. Enter PIN: **`1234`**
4. Tap the Chrome **3 dots (⋮)** in the top right > tap **"Add to Home screen"** or **"Install app"**.
5. The **Savrajas Admin** app icon will appear on your Android launcher and run fullscreen.

---

## 🛠️ Build Standalone Native Android APK (.apk)

This project has native **Capacitor** integration configured.

1. Build production bundle:
   ```powershell
   npm run build
   ```

2. Initialize Android platform:
   ```powershell
   npm run cap:add
   ```

3. Sync web assets:
   ```powershell
   npm run cap:sync
   ```

4. Open in Android Studio:
   ```powershell
   npm run cap:open
   ```

5. In **Android Studio**:
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Once completed, click **locate** to find your installable `app-debug.apk`.

---

## 🔐 Security & Features

- **Default PIN**: `1234` (Change anytime in the *Settings* tab)
- **Real-Time Pricing Editor**: Adjust rates across Starter, Growth, and Enterprise tiers for all 6 website categories, add-on modules, and maintenance SLAs.
- **Portfolio Showcase Manager**: Add, edit, or remove case study projects with custom clients, timelines, tech stacks, tags, and logos.
- **Client Leads CRM**: View quotation inquiries submitted on the main website with status tagging and CSV export.
- **Backup & Restore**: Export full JSON snapshot or import back anytime.
