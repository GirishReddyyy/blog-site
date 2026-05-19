# Blog Application - Backend

This is the backend service for the full-stack MERN blog application. It provides the REST APIs and database models required to support user authentication, role-based access control, article management, and commenting.

## 🛠️ Technologies Used
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM) library.
- **JSON Web Tokens (JWT)**: Secure user authentication and session management.
- **Bcrypt**: Password hashing.
- **Cloudinary**: Cloud storage service for handling user profile image uploads.
- **Multer**: Middleware for handling `multipart/form-data` (image uploads).
- **Cookie-Parser & CORS**: Middleware for managing cookies and Cross-Origin Resource Sharing.
- **Dotenv**: Loading environment variables.
- **Nodemon**: Automatic server restarts during development.

## 📦 Installed Packages

**Dependencies:**
- `bcrypt` (^6.0.0)
- `cloudinary` (^2.9.0)
- `cookie-parser` (^1.4.7)
- `cors` (^2.8.6)
- `dotenv` (^17.2.3)
- `express` (^5.2.1)
- `jsonwebtoken` (^9.0.3)
- `mongoose` (^9.1.5)
- `multer` (^2.1.1)
- `nodemon` (^3.1.14)

## 📁 Directory Structure
```text
blog-app-backend/
├── APIs/                # Route controllers for Admin, Author, User, and Common APIs
├── config/              # Configuration logic (e.g., Cloudinary config)
├── middlewares/         # Custom middlewares (e.g., verifyToken)
├── models/              # Mongoose schemas (UserModel.js, ArticleModel.js)
├── services/            # Business logic and reusable services (e.g., authService.js)
├── .env                 # Environment variables (must be created)
└── server.js            # Entry point for the Node.js application
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the `blog-app-backend` directory and add the following keys:
```env
PORT=5000
DB_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-strong-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

### 3. Start the Server
Start the server in development mode:
```bash
npm start
```
The server will start on `http://localhost:5000`. 
*Note: A default Admin account (`admin1@mail.com` / `123456`) is created automatically upon the first successful database connection.*