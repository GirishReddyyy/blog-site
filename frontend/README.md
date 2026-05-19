# Blog Application - Frontend

This is the frontend user interface for the full-stack MERN blog application. It provides a responsive and dynamic interface for Admins, Authors, and Users to interact with the platform.

## 🛠️ Technologies Used
- **React 19**: A JavaScript library for building user interfaces.
- **Vite**: A fast frontend build tool.
- **React Router 7**: For declarative routing and navigation.
- **Tailwind CSS v4**: A utility-first CSS framework for rapid and responsive UI development.
- **Zustand**: A small, fast, and scalable state-management solution.
- **React Hook Form**: Performant, flexible, and extensible forms with easy-to-use validation.
- **React Hot Toast**: For elegant and customizable notifications.
- **Axios**: Promise-based HTTP client for the browser.
- **ESLint & Globals**: Linter for identifying and reporting on patterns in JavaScript.

## 📦 Installed Packages

**Dependencies:**
- `@tailwindcss/vite` (^4.2.1)
- `axios` (^1.13.6)
- `react` (^19.2.0)
- `react-dom` (^19.2.0)
- `react-hook-form` (^7.71.2)
- `react-hot-toast` (^2.6.0)
- `react-router` (^7.13.1)
- `tailwindcss` (^4.2.1)
- `zustand` (^5.0.11)

**DevDependencies:**
- `@eslint/js` (^9.39.1)
- `@types/react` (^19.2.7)
- `@types/react-dom` (^19.2.3)
- `@vitejs/plugin-react` (^5.1.1)
- `eslint` (^9.39.1)
- `eslint-plugin-react-hooks` (^7.0.1)
- `eslint-plugin-react-refresh` (^0.4.24)
- `globals` (^16.5.0)
- `vite` (^7.3.1)

**Installation Commands:**
```bash
npm install @tailwindcss/vite axios react react-dom react-hook-form react-hot-toast react-router tailwindcss zustand
npm install -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite
```

## 📁 Directory Structure
```text
frontend/
├── public/              # Static assets that are not processed by Vite
├── src/                 
│   ├── assets/          # Project assets like images and icons
│   ├── components/      # React components (e.g., UserDashboard, WriteArticle, Login)
│   ├── store/           # Zustand state slices (e.g., userStore)
│   ├── styles/          # Global styles and Tailwind imports
│   ├── App.jsx          # Main application component and routing configuration
│   └── main.jsx         # Application entry point
├── index.html           # Main HTML template
└── vite.config.js       # Vite build and development configuration
```

## 🚀 Getting Started

### 1. Install Dependencies
Make sure you are in the `frontend` directory, then run:
```bash
npm install
```

*If you want to install the main packages manually, you can use these commands:*
```bash
npm install axios react react-dom react-hook-form react-hot-toast react-router zustand @tailwindcss/vite tailwindcss
npm install -D globals eslint @eslint/js vite
```

### 2. Start the Development Server
```bash
npm run dev
```
The frontend application will start and is typically accessible at `http://localhost:5173`. 
Ensure that the backend server is also running concurrently so the frontend can successfully communicate with the APIs.

## 🔗 Live Application Link (Vercel)
- **Frontend App:** https://blog-site-ten-pi.vercel.app/
