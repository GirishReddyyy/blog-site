import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from "react";
import axios from 'axios'
import { errorClass, tagClass } from "../styles/common";

function UserDashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate()
  const logout = useAuth(state => state.logout)
  const currentUser = useAuth(state => state.currentUser)

  const onLogout = async () => {
    await logout()
    toast.success("Logged Out Successfully!")
    navigate('/login')
  }

  useEffect(() => {
    async function getArticles() {
      if (!currentUser?._id) return
      setLoading(true);
      try {
        let res = await axios.get(`http://localhost:4000/user-api/articles/${currentUser._id}`, { withCredentials: true })
        setArticles(res.data.payload)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    getArticles()
  }, [currentUser])

  const initials = `${currentUser?.firstName?.[0] ?? ''}${currentUser?.lastName?.[0] ?? ''}`.toUpperCase();

  const filtered = articles.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#0066cc] border-t-transparent animate-spin" />
        <p className="text-sm text-[#a1a1a6]">Loading your feed…</p>
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
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className="w-64 shrink-0 border-r border-[#e8e8ed] flex flex-col px-6 py-8 sticky top-0 h-screen">

          {/* Profile */}
          <div className="flex items-center gap-3 mb-10">
            {currentUser?.profileImageUrl ? (
              <img
                src={currentUser.profileImageUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#0066cc] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {initials || '?'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1d1d1f] truncate">{currentUser?.firstName} {currentUser?.lastName}</p>
              <p className="text-xs text-[#6e6e73] truncate">{currentUser?.email}</p>
              <p className="text-[11px] text-[#a1a1a6] mt-1">Reader</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1 flex-1">
            <p className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-widest mb-2">Content</p>
            <button
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium bg-[#1d1d1f] text-white"
            >
              <span>📰</span> Explore
            </button>
          </nav>

          {/* Stats */}
          <div className="border-t border-[#e8e8ed] pt-5 mb-5">
            <p className="text-[10px] font-semibold text-[#a1a1a6] uppercase tracking-widest mb-3">Stats</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#6e6e73]">Articles available</span>
                <span className="text-xs font-semibold text-[#1d1d1f]">{articles.length}</span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#cc2f26] hover:bg-[#ff3b30]/10 transition-colors cursor-pointer"
          >
            <span>→</span> Log Out
          </button>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 px-10 py-10">

          {/* Header */}
          <div className="mb-8">
            <span className={`${tagClass} mb-2 block`}>Welcome back, {currentUser?.firstName} 👋</span>
            <div className="flex items-end justify-between">
              <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight leading-none">
                Your Feed
              </h1>
              <p className="text-sm text-[#a1a1a6]">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</p>
            </div>
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

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[#f5f5f7] rounded-2xl gap-3">
              <span className="text-4xl">📭</span>
              <p className="text-[#6e6e73] text-sm">
                {search ? 'No articles match your search.' : 'No articles available at the moment.'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-xs text-[#0066cc] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            /* Article grid — 2-col on md+ */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((articleObj) => (
                <div
                  key={articleObj._id}
                  onClick={() => navigate(`/article/${articleObj._id}`, { state: { article: articleObj } })}
                  className="group bg-[#f5f5f7] hover:bg-[#ebebf0] transition-colors duration-200 rounded-2xl p-6 cursor-pointer flex flex-col gap-3"
                >
                  {/* Category */}
                  <span className={tagClass}>{articleObj.category || 'Article'}</span>

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
                      {/* Author avatar */}
                      <div className="w-6 h-6 rounded-full bg-[#e8e8ed] flex items-center justify-center text-[10px] font-semibold text-[#6e6e73]">
                        {articleObj.author?.firstName?.[0]?.toUpperCase() ?? 'A'}
                      </div>
                      <span className="text-xs text-[#6e6e73]">
                        {articleObj.author?.firstName} {articleObj.author?.lastName}
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
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;