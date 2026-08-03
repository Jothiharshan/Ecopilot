# EcoPilot AI - VS Code Setup & Run Guide

Follow these simple steps to set up and run **EcoPilot AI** in Visual Studio Code without any errors or problems.

---

## 🚀 Quick Start Guide (3 Steps)

### 1. Install Dependencies
Open your terminal in VS Code inside the project folder and run:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `.env` contains your required keys:
- `GEMINI_API_KEY`: (Optional) Your Google Gemini API key for AI features.
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Included by default.

### 3. Start Development Server
Run the dev server:
```bash
npm run dev
```
Open your browser and navigate to:
👉 `http://localhost:3000`

---

## 🛠️ Build & Production Deployment

To verify TypeScript types and build the application for production:
```bash
# Check TypeScript types (0 errors)
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

---

## 💡 Troubleshooting & VS Code Settings
- **TypeScript Errors in Editor**: Ensure VS Code is using Workspace TypeScript version (`TypeScript 5.8+`). 
- **Port 3000**: The app runs on `http://localhost:3000`. If port 3000 is occupied, free port 3000 or change the port in `server.ts`.
