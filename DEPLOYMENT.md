# Salone Connect Dating - Free Public Deployment & APK Guide

This application is built with **React 19 + TypeScript + Vite + Tailwind CSS + VitePWA**.
Because it compiles to high-performance static HTML/CSS/JavaScript and WebAssembly-compatible assets, it can be deployed **100% free with unlimited bandwidth and automatic SSL certificates** on Vercel, Netlify, or Firebase Hosting.

---

## Why External Testers Got "403 Access Denied"
Google AI Studio preview URLs (`*.run.app`) are private sandboxes tied to your Google account permissions. Anyone opening that link without being an authenticated collaborator on your Cloud/AI Studio project is automatically blocked by Google IAM with `403 Forbidden`.

Deploying to **Vercel** or **Netlify** generates a **public, globally distributed URL** (e.g., `https://salone-connect.vercel.app`) that anyone can open immediately from WhatsApp, SMS, or QR code without any Google login.

---

## Option 1: Deploy to Vercel in 60 Seconds (Recommended)

### Method A: Via Vercel Web Dashboard (No terminal needed)
1. Push this project folder to your GitHub account (or export the code).
2. Go to [https://vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Vercel automatically detects Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Within 40 seconds, you will receive a free public URL:
   `https://salone-connect-dating.vercel.app`

### Method B: Via Terminal CLI
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy directly from your project root
vercel --prod
```

---

## Option 2: Deploy to Netlify (Drag-and-Drop or Git)

### Method A: Drag-and-Drop (Instant, No GitHub required)
1. Run `npm run build` to create the `dist` folder.
2. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist` folder into the browser window.
4. Netlify will deploy it instantly and give you a public link like `https://salone-connect.netlify.app`.

### Method B: Via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## Option 3: Deploy to Firebase Hosting (Google Cloud)
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Google
firebase login

# 3. Initialize hosting (select 'dist' as public directory)
firebase init hosting

# 4. Deploy
firebase deploy --only hosting
```

---

## Turning Your Public URL into an Android APK

Once your app is live on Vercel or Netlify (e.g. `https://salone-connect.vercel.app`):

### 1. WebAPK / Add to Home Screen (Instant APK on device)
When your testers open `https://salone-connect.vercel.app` on their Android phone in Google Chrome:
- A banner will appear at the bottom: **"Add Salone Connect to Home Screen"** or tap the in-app **"Install APK"** button.
- Android's WebAPK service automatically packages the app into an actual APK in the background and places the app icon into their app drawer.
- It launches with the custom two-tone Sierra Leone splash screen, runs in full-screen standalone mode, and functions offline.

### 2. Standalone Binary `.apk` (Bubblewrap / TWA for Google Play or WhatsApp distribution)
Run this command from your terminal, replacing the URL with your live public link:
```bash
# Generate Android Studio project
npx @bubblewrap/cli init --manifest=https://salone-connect.vercel.app/manifest.webmanifest

# Build the signed/unsigned .apk
npx @bubblewrap/cli build
```
The compiled file `app-release-signed.apk` will be output in your project folder, ready to send via WhatsApp or upload to the Google Play Console.
