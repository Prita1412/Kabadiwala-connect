<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/dbd3a600-a223-4d58-ad55-fe5354264306

## Run Locally

**Prerequisites:** Node.js 20.19+ (or 22.12+) and npm. This is a React/Vite + Express/TypeScript application; it does not need a Python virtual environment.


1. Install dependencies: `npm install`
2. Create `.env.local` in the project root and add `GEMINI_API_KEY=your_key_here`. Keep this file private; it is ignored by git. The server also runs without a Gemini key using its local intent fallback.
3. Start the app: `npm run dev`
4. Open the local URL printed by the server (normally `http://localhost:3000`).

Optional: set `GEMINI_MODEL=gemini-3.8-flash` in `.env.local` to choose the server-side model. Keep `GEMINI_API_KEY` server-only: do not use `VITE_GEMINI_API_KEY`, since `VITE_` variables are client-visible. The browser calls the same-origin `/api/intent-router` endpoint, so no CORS setup or client API key is needed. Firebase is configured separately in `firebase-applet-config.json`; enable Firebase Authentication and Firestore for cloud-backed features.
