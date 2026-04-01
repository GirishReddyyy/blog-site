import { useNavigate, NavLink } from "react-router";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from "react";
import axios from "axios";
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
        let res = await axios.get(`http://localhost:4000/author-api/articles/${user._id}`, { withCredentials: true });
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
              <p className="text-[11px] text-[#a1a1a6]">Author</p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1 flex-1">
            <p className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-widest mb-2">Content</p>

            <NavLink
              to="/author-dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1d1d1f] text-white'
                    : 'text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`
              }
            >
              <span>📄</span> My Articles
            </NavLink>

            <NavLink
              to="/articles"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1d1d1f] text-white'
                    : 'text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`
              }
            >
              <span>✍️</span> Write Article
            </NavLink>
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 px-10 py-10 max-w-4xl">

          {/* Header */}
          <div className="mb-10">
            <span className={`${tagClass} mb-2 block`}>Author Dashboard</span>
            <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight leading-none">
              Your Articles
            </h1>
          </div>

          {/* Stats row */}
          <div className="flex gap-4 mb-10">
            <div className="bg-[#f5f5f7] rounded-2xl px-6 py-4 flex flex-col gap-0.5 flex-1">
              <span className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-widest">Total</span>
              <span className="text-3xl font-bold text-[#1d1d1f] tracking-tight">{articles.length}</span>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl px-6 py-4 flex flex-col gap-0.5 flex-1">
              <span className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-widest">Active</span>
              <span className="text-3xl font-bold text-[#248a3d] tracking-tight">{activeCount}</span>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl px-6 py-4 flex flex-col gap-0.5 flex-1">
              <span className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-widest">Deleted</span>
              <span className="text-3xl font-bold text-[#cc2f26] tracking-tight">{deletedCount}</span>
            </div>
          </div>

          {/* Write CTA if empty */}
          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[#f5f5f7] rounded-2xl gap-4">
              <span className="text-4xl">✍️</span>
              <p className="text-[#6e6e73] text-sm">You haven't published any articles yet.</p>
              <NavLink
                to="/articles"
                className="bg-[#1d1d1f] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#3a3a3c] transition-colors"
              >
                Write your first article
              </NavLink>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {articles.map((articleObj) => (
                <div
                  key={articleObj._id}
                  onClick={() => navigate(`/article/${articleObj._id}`, { state: { article: articleObj } })}
                  className="group relative bg-[#f5f5f7] hover:bg-[#ebebf0] transition-colors duration-200 rounded-2xl px-7 py-5 cursor-pointer flex items-start justify-between gap-6"
                >
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={tagClass}>{articleObj.category || 'Article'}</span>
                    </div>
                    <h2 className="text-base font-semibold text-[#1d1d1f] leading-snug tracking-tight truncate">
                      {articleObj.title}
                    </h2>
                    <p className="text-sm text-[#6e6e73] mt-1 line-clamp-2 leading-relaxed">
                      {articleObj.content.substring(0, 120)}…
                    </p>
                    <p className="text-xs text-[#a1a1a6] mt-3">
                      {new Date(articleObj.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span className={`shrink-0 mt-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    articleObj.isArticleActive
                      ? 'bg-[#34c759]/20 text-[#248a3d]'
                      : 'bg-[#ff3b30]/20 text-[#cc2f26]'
                  }`}>
                    {articleObj.isArticleActive ? 'Active' : 'Deleted'}
                  </span>

                  {/* Arrow on hover */}
                  <span className="shrink-0 text-[#a1a1a6] opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-sm">→</span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AuthorDashboard;