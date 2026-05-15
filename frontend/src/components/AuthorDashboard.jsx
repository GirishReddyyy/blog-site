import { useNavigate, NavLink, Outlet } from "react-router";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { useAuth } from '../store/authStore';
import {
  articleStatusActive,
  articleStatusDeleted,
  errorClass,
  loadingClass,
  tagClass,
} from "../styles/common";

function AuthorDashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const logout = useAuth(state => state.logout);
  const user = useAuth(state => state.currentUser);

  const onLogout = async () => {
    await logout();
    toast.success("Logged Out Successfully!");
    navigate('/login');
  };

  useEffect(() => {
    if (!user) return;
    async function getArticles() {
      setLoading(true);
      try {
        let res = await axios.get(`${API_BASE_URL}/author-api/articles/${user._id}`, { withCredentials: true });
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    getArticles();
  }, [user]);

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();
  const activeCount = articles.filter(a => a.isArticleActive).length;
  const deletedCount = articles.filter(a => !a.isArticleActive).length;

  const filteredArticles = articles.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#0066cc] border-t-transparent animate-spin" />
        <p className="text-sm text-[#a1a1a6]">Loading your articles…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <p className={errorClass}>{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">

      {/* ── Sidebar + Main layout ── */}
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className="w-64 shrink-0 border-r border-[#e8e8ed] flex flex-col px-6 py-8 sticky top-0 h-screen">
          {/* Author identity */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1d1d1f] truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-[#6e6e73] truncate">{user?.email}</p>
              <p className="text-[11px] text-[#a1a1a6] mt-1">Author</p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1 flex-1">
            <p className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-widest mb-2">Content</p>

            <NavLink
              to="/author-dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive
                  ? 'bg-[#1d1d1f] text-white'
                  : 'text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`
              }
            >
              <span>📄</span> My Articles
            </NavLink>

            <NavLink
              to="/author-dashboard/write-article"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive
                  ? 'bg-[#1d1d1f] text-white'
                  : 'text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`
              }
            >
              <span>✍️</span> Write Article
            </NavLink>
          </nav>

          {/* Logout */}
          <div className="border-t border-[#e8e8ed] pt-5 mt-auto">
            <button
              onClick={onLogout}
              className="flex items-center w-full gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#cc2f26] hover:bg-[#ff3b30]/10 transition-colors cursor-pointer"
            >
              <span>→</span> Log Out
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 px-10 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AuthorDashboard;