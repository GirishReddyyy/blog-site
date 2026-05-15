import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { useAuth } from '../store/authStore';
import { tagClass, errorClass } from "../styles/common";

function AuthorArticles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const user = useAuth(state => state.currentUser);

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

  const activeCount = articles.filter(a => a.isArticleActive).length;
  const deletedCount = articles.filter(a => !a.isArticleActive).length;

  const filteredArticles = articles.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 border-[#0066cc] border-t-transparent animate-spin" />
      <p className="text-sm text-[#a1a1a6] mt-3">Loading your articles…</p>
    </div>
  );

  if (error) return <p className={errorClass}>{error}</p>;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <span className={`${tagClass} mb-2 block`}>Author Dashboard</span>
        <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight leading-none">
          Your Articles
        </h1>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by title or category…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-2.5 text-sm text-[#1d1d1f] placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition"
        />
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
          <button
            onClick={() => navigate('/author-dashboard/write-article')}
            className="bg-[#1d1d1f] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#3a3a3c] transition-colors"
          >
            Write your first article
          </button>
        </div>
      ) : filteredArticles.length === 0 && articles.length > 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#f5f5f7] rounded-2xl gap-3">
          <span className="text-4xl">📭</span>
          <p className="text-[#6e6e73] text-sm">No articles match your search.</p>
          <button
            onClick={() => setSearch('')}
            className="text-xs text-[#0066cc] hover:underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((articleObj) => (
            <div
              key={articleObj._id}
              onClick={() => navigate(`/article/${articleObj._id}`, { state: { article: articleObj } })}
              className="group relative bg-[#f5f5f7] hover:bg-[#ebebf0] transition-colors duration-200 rounded-2xl p-6 cursor-pointer flex flex-col gap-3"
            >
              {/* Category and Status Badge Container */}
              <div className="flex items-start justify-between gap-2">
                <span className={tagClass}>{articleObj.category || 'Article'}</span>
                <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                  articleObj.isArticleActive
                    ? 'bg-[#34c759]/20 text-[#248a3d]'
                    : 'bg-[#ff3b30]/20 text-[#cc2f26]'
                }`}>
                  {articleObj.isArticleActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base font-semibold text-[#1d1d1f] leading-snug tracking-tight line-clamp-2 break-words">
                {articleObj.title}
              </h2>

              {/* Excerpt */}
              <p className="text-sm text-[#6e6e73] leading-relaxed line-clamp-3 flex-1 break-words">
                {articleObj.content.substring(0, 140)}…
              </p>

              {/* Footer row */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#e8e8ed]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#e8e8ed] flex items-center justify-center text-[10px] font-semibold text-[#6e6e73]">
                    {(articleObj.author?.firstName?.[0] || user?.firstName?.[0] || 'A').toUpperCase()}
                  </div>
                  <span className="text-xs text-[#6e6e73]">
                    {articleObj.author?.firstName || user?.firstName} {articleObj.author?.lastName || user?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#a1a1a6]">
                    {new Date(articleObj.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-[#a1a1a6] opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AuthorArticles;