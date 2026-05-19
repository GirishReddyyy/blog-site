# Full-Stack MERN Blog Application

A feature-rich, full-stack blog application built with the **MERN** stack (MongoDB, Express.js, React, Node.js). The application includes a robust Role-Based Access Control (RBAC) system for Admins, Authors, and Users.

## 🔗 Live Links
- **Frontend App (Vercel):** [Insert Vercel Link Here]
- **Backend API (Render):** [Insert Render Link Here]

## 🚀 Features

- **Role-Based Access Control (RBAC):**
  - **Admin:** Can oversee the application (A default Admin account is automatically created on initialization).
  - **Author:** Can write, edit, delete, and manage their own articles.
  - **User:** Can browse articles, read content, and leave comments.
- **Authentication & Authorization:** Secure user registration, login, and protected routes using JWT (JSON Web Tokens) stored securely, along with bcrypt for password hashing.
- **Article Management:** Authors can seamlessly create, read, update, and manage the state of their articles.
- **Comments System:** Logged-in users can interact with articles by leaving comments.
- **Profile Image Uploads:** Integrated with **Cloudinary** and Multer for uploading and managing user profile images during registration.
- **Responsive UI:** Built with modern CSS using **Tailwind CSS v4** for a clean, responsive, and beautiful user experience.
- **State Management:** Efficient global state management handled by **Zustand**.
- **Form Handling:** Robust and performant form validation using **React Hook Form**.

## 🛠️ Tech Stack

### Frontend
- **React 19**
- **Vite** (Build tool)
- **React Router 7** (Routing)
- **Tailwind CSS v4** (Styling)
- **Zustand** (State Management)
- **React Hook Form** (Form Handling)
- **React Hot Toast** (Notifications)
- **Axios** (API Requests)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & ODM)
- **JSON Web Tokens (JWT)** (Authentication)
- **Bcrypt** (Password Hashing)
- **Cloudinary & Multer** (Image Uploads)
- **Cookie-Parser & CORS** (Middleware)

## 📁 Project Structure

```text
blog-app/
├── blog-app-backend/        # Backend Node.js application
│   ├── APIs/                # Express route controllers (Admin, Author, User, Common)
│   ├── config/              # Configuration files
│   ├── middlewares/         # Custom Express middlewares (e.g., JWT token verification)
│   ├── models/              # Mongoose database schemas (UserModel, ArticleModel)
│   ├── services/            # Business logic and external services
│   ├── .env                 # Environment variables
│   └── server.js            # Entry point for the Express server
│
├── frontend/                # Frontend React application
│   ├── public/              # Static assets
│   ├── src/                 
│   │   ├── assets/          # Images, icons, etc.
│   │   ├── components/      # React components and page layouts (Dashboards, Auth, Articles)
│   │   ├── store/           # Zustand global state management
│   │   ├── styles/          # Custom CSS
│   │   ├── App.jsx          # Main application component and routing setup
│   │   └── main.jsx         # Entry point for React application
│   ├── index.html           # Main HTML template
│   ├── vite.config.js       # Vite bundler configuration
│   └── package.json         # Frontend dependencies and scripts
│
└── README.md                # Project documentation
```

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) URI (Local or Atlas)
- [Cloudinary](https://cloudinary.com/) Account (for image uploads)

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd blog-app
```

### 2. Setup Backend
Navigate to the backend directory and install dependencies:
```bash
cd blog-app-backend
npm install
```

Create a `.env` file in the `blog-app-backend` directory and add your environment variables:
```env
PORT=5000
DB_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-strong-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

Start the backend server:
```bash
# Starts the server (usually on http://localhost:5000)
npm start
```
*Note: On the first successful database connection, a default Admin account (`admin1@mail.com` / `123456`) is automatically created.*

### 3. Setup Frontend
Open a new terminal window/tab, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The frontend will usually be accessible at `http://localhost:5173`.

## 📡 API Routes Overview
The backend is structured with separate API routers:
- `/common-api/*` - Shared routes (e.g., login, registration)
- `/user-api/*` - User-specific routes
- `/author-api/*` - Author-specific routes (managing articles)
- `/admin-api/*` - Admin-specific routes
