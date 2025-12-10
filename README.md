<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pQ0nP3RR7PCe5OaDhV4N77o1zk_J76eM

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure [.env.local](.env.local):
   - `GEMINI_API_KEY` – optional, used for AI features.
   - `ADMIN_PASSWORD` – password checked by the Express API (default `admin123`).
   - `VITE_API_BASE_URL` – URL of the API server (defaults to `http://localhost:4000`).
3. Start both the Vite client and the API with:
   `npm run dev`
   (use `npm run server` if you only need the API running)
