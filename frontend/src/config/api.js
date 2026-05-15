// Central API base URL configuration
// In production (Vercel), use the Render backend URL
// In development, use localhost
const API_BASE_URL = import.meta.env.PROD
  ? "https://blog-site-kbfu.onrender.com"
  : "http://localhost:4000";

export default API_BASE_URL;
