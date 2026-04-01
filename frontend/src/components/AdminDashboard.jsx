import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  pageBackground, pageWrapper, section,
  headingClass, subHeadingClass, bodyText, mutedText,
  primaryBtn, secondaryBtn, ghostBtn,
  navbarClass, navContainerClass, navBrandClass, navLinksClass, navLinkClass,
  errorClass, successClass, loadingClass, emptyStateClass,
  divider,
  articleStatusActive, articleStatusDeleted,
  tagClass, articleMeta,
  deleteBtn, editBtn
} from '../styles/common'
import { useAuth } from '../store/authStore'

// ─── Tab Button ───────────────────────────────────────
const TabBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-[#1d1d1f] text-white shadow-sm'
        : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
    }`}
  >
    {children}
  </button>
)

// ─── Stat Card ────────────────────────────────────────
const StatCard = ({ label, value, accent }) => (
  <div className="bg-[#f5f5f7] rounded-2xl p-6 flex flex-col gap-1">
    <span className="text-xs font-semibold text-[#a1a1a6] uppercase tracking-widest">{label}</span>
    <span className={`text-4xl font-bold tracking-tight ${accent || 'text-[#1d1d1f]'}`}>{value}</span>
  </div>
)

// ─── User Row ─────────────────────────────────────────
const UserRow = ({ user, onBlock, onUnblock, actionLoading }) => (
  <div className="flex items-center justify-between bg-[#f5f5f7] rounded-2xl px-6 py-4 hover:bg-[#ebebf0] transition-colors duration-200">
    <div className="flex items-center gap-4 min-w-0">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#e8e8ed] flex items-center justify-center shrink-0 overflow-hidden">
        {user.profileImageURL ? (
          <img src={user.profileImageURL} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-semibold text-[#6e6e73]">
            {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#1d1d1f] truncate">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-[#a1a1a6] truncate">{user.email}</p>
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0 ml-4">
      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
        user.isActive
          ? 'bg-[#34c759]/20 text-[#248a3d]'
          : 'bg-[#ff3b30]/20 text-[#cc2f26]'
      }`}>
        {user.isActive ? 'Active' : 'Blocked'}
      </span>
      {user.isActive ? (
        <button
          onClick={() => onBlock(user._id)}
          disabled={actionLoading === user._id}
          className="text-xs font-medium px-4 py-1.5 rounded-full bg-[#ff3b30]/10 text-[#cc2f26] hover:bg-[#ff3b30]/20 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {actionLoading === user._id ? '...' : 'Block'}
        </button>
      ) : (
        <button
          onClick={() => onUnblock(user._id)}
          disabled={actionLoading === user._id}
          className="text-xs font-medium px-4 py-1.5 rounded-full bg-[#34c759]/10 text-[#248a3d] hover:bg-[#34c759]/20 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {actionLoading === user._id ? '...' : 'Unblock'}
        </button>
      )}
    </div>
  </div>
)

// ─── Article Row ──────────────────────────────────────
const ArticleRow = ({ article, onToggle, actionLoading }) => (
  <div className="relative flex items-start justify-between bg-[#f5f5f7] rounded-2xl px-6 py-5 hover:bg-[#ebebf0] transition-colors duration-200 gap-4">
    <div className="min-w-0 flex-1">
      <span className={tagClass}>{article.category}</span>
      <p className="text-sm font-semibold text-[#1d1d1f] leading-snug tracking-tight mt-1 truncate">
        {article.title}
      </p>
      <p className="text-xs text-[#a1a1a6] mt-1">
        {article.author?.firstName} {article.author?.lastName} · {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
    <div className="flex items-center gap-3 shrink-0 mt-1">
      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
        article.isArticleActive
          ? 'bg-[#34c759]/20 text-[#248a3d]'
          : 'bg-[#ff3b30]/20 text-[#cc2f26]'
      }`}>
        {article.isArticleActive ? 'Active' : 'Inactive'}
      </span>
      <button
        onClick={() => onToggle(article._id, article.isArticleActive)}
        disabled={actionLoading === article._id}
        className={`text-xs font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-50 cursor-pointer ${
          article.isArticleActive
            ? 'bg-[#ff3b30]/10 text-[#cc2f26] hover:bg-[#ff3b30]/20'
            : 'bg-[#34c759]/10 text-[#248a3d] hover:bg-[#34c759]/20'
        }`}
      >
        {actionLoading === article._id ? '...' : article.isArticleActive ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  </div>
)

// ─── Main Dashboard ───────────────────────────────────
function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const adminId = currentUser?._id

  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [articles, setArticles] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingArticles, setLoadingArticles] = useState(false)
  const [userActionLoading, setUserActionLoading] = useState(null)
  const [articleActionLoading, setArticleActionLoading] = useState(null)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // ── Fetch Users ──────────────────────────────────────
  const fetchUsers = async () => {
    setLoadingUsers(true)
    setError(null)
    try {
      const res = await axios.get(`http://localhost:4000/admin-api/users/${adminId}`, { withCredentials: true })
      setUsers(res.data.payload || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users')
    } finally {
      setLoadingUsers(false)
    }
  }

  // ── Fetch Articles ────────────────────────────────────
  const fetchArticles = async () => {
    setLoadingArticles(true)
    setError(null)
    try {
      const res = await axios.get(`http://localhost:4000/admin-api/articles/${adminId}`, { withCredentials: true })
      setArticles(res.data.payload || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch articles')
    } finally {
      setLoadingArticles(false)
    }
  }

  useEffect(() => {
    if (adminId) {
      fetchUsers()
      fetchArticles()
    }
  }, [adminId])

  // ── Block User ────────────────────────────────────────
  const handleBlock = async (uid) => {
    setUserActionLoading(uid)
    try {
      await axios.put(`http://localhost:4000/admin-api/block/${uid}/adminId/${adminId}`, {}, { withCredentials: true })
      setUsers(prev => prev.map(u => u._id === uid ? { ...u, isActive: false } : u))
      showToast('User blocked successfully')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to block user')
    } finally {
      setUserActionLoading(null)
    }
  }

  // ── Unblock User ──────────────────────────────────────
  const handleUnblock = async (uid) => {
    setUserActionLoading(uid)
    try {
      await axios.put(`http://localhost:4000/admin-api/unblock/${uid}/adminId/${adminId}`, {}, { withCredentials: true })
      setUsers(prev => prev.map(u => u._id === uid ? { ...u, isActive: true } : u))
      showToast('User unblocked successfully')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to unblock user')
    } finally {
      setUserActionLoading(null)
    }
  }

  // ── Toggle Article ────────────────────────────────────
  const handleToggleArticle = async (articleId, isActive) => {
    setArticleActionLoading(articleId)
    const endpoint = isActive ? 'deactivate' : 'activate'
    try {
      await axios.put(
        `http://localhost:4000/admin-api/${endpoint}/${articleId}/adminId/${adminId}`,
        {},
        { withCredentials: true }
      )
      setArticles(prev =>
        prev.map(a => a._id === articleId ? { ...a, isArticleActive: !isActive } : a)
      )
      showToast(`Article ${isActive ? 'deactivated' : 'activated'} successfully`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update article')
    } finally {
      setArticleActionLoading(null)
    }
  }

  // ── Derived stats ─────────────────────────────────────
  const activeUsers = users.filter(u => u.isActive).length
  const blockedUsers = users.filter(u => !u.isActive).length
  const activeArticles = articles.filter(a => a.isArticleActive).length
  const inactiveArticles = articles.filter(a => !a.isArticleActive).length

  return (
    <div className={pageBackground}>
      {/* Navbar */}
      <nav className={navbarClass}>
        <div className={navContainerClass}>
          <span className={navBrandClass}>⚙️ Admin Console</span>
          <div className={navLinksClass}>
            <span className="text-[0.8rem] text-[#6e6e73]">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
            <button onClick={logout} className={secondaryBtn}>Logout</button>
          </div>
        </div>
      </nav>

      <div className={pageWrapper}>
        {/* Header */}
        <div className={`${section} flex items-end justify-between`}>
          <div>
            <h1 className="text-5xl font-bold text-[#1d1d1f] tracking-tight leading-none mb-2">Dashboard</h1>
            <p className={bodyText}>Manage users and content across the platform.</p>
          </div>
          <span className="text-xs text-[#a1a1a6] bg-[#f5f5f7] px-3 py-1.5 rounded-full font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`${successClass} mb-6`}>{toast}</div>
        )}
        {error && (
          <div className={errorClass} onClick={() => setError(null)}>
            {error} <span className="ml-2 opacity-60 cursor-pointer">✕</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[#f5f5f7] p-1 rounded-full w-fit">
          <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabBtn>
          <TabBtn active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            Users <span className="ml-1.5 text-[10px] bg-[#e8e8ed] text-[#6e6e73] px-1.5 py-0.5 rounded-full">{users.length}</span>
          </TabBtn>
          <TabBtn active={activeTab === 'articles'} onClick={() => setActiveTab('articles')}>
            Articles <span className="ml-1.5 text-[10px] bg-[#e8e8ed] text-[#6e6e73] px-1.5 py-0.5 rounded-full">{articles.length}</span>
          </TabBtn>
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className={section}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard label="Total Users" value={users.length} />
              <StatCard label="Active Users" value={activeUsers} accent="text-[#248a3d]" />
              <StatCard label="Blocked Users" value={blockedUsers} accent="text-[#cc2f26]" />
              <StatCard label="Active Articles" value={activeArticles} accent="text-[#0066cc]" />
            </div>

            <div className={divider} />

            <div className="grid md:grid-cols-2 gap-8 mt-10">
              {/* Recent Users */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={subHeadingClass}>Recent Users</h2>
                  <button onClick={() => setActiveTab('users')} className={ghostBtn}>View all →</button>
                </div>
                <div className="flex flex-col gap-3">
                  {loadingUsers ? (
                    <p className={loadingClass}>Loading users…</p>
                  ) : users.slice(0, 4).map(user => (
                    <UserRow
                      key={user._id}
                      user={user}
                      onBlock={handleBlock}
                      onUnblock={handleUnblock}
                      actionLoading={userActionLoading}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Articles */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={subHeadingClass}>Recent Articles</h2>
                  <button onClick={() => setActiveTab('articles')} className={ghostBtn}>View all →</button>
                </div>
                <div className="flex flex-col gap-3">
                  {loadingArticles ? (
                    <p className={loadingClass}>Loading articles…</p>
                  ) : articles.slice(0, 4).map(article => (
                    <ArticleRow
                      key={article._id}
                      article={article}
                      onToggle={handleToggleArticle}
                      actionLoading={articleActionLoading}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <div className={section}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={headingClass}>All Users</h2>
                <p className={`${mutedText} mt-1`}>{activeUsers} active · {blockedUsers} blocked</p>
              </div>
              <button onClick={fetchUsers} className={secondaryBtn}>↻ Refresh</button>
            </div>
            {loadingUsers ? (
              <p className={loadingClass}>Loading users…</p>
            ) : users.length === 0 ? (
              <p className={emptyStateClass}>No users found.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {users.map(user => (
                  <UserRow
                    key={user._id}
                    user={user}
                    onBlock={handleBlock}
                    onUnblock={handleUnblock}
                    actionLoading={userActionLoading}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Articles Tab ── */}
        {activeTab === 'articles' && (
          <div className={section}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={headingClass}>All Articles</h2>
                <p className={`${mutedText} mt-1`}>{activeArticles} active · {inactiveArticles} inactive</p>
              </div>
              <button onClick={fetchArticles} className={secondaryBtn}>↻ Refresh</button>
            </div>
            {loadingArticles ? (
              <p className={loadingClass}>Loading articles…</p>
            ) : articles.length === 0 ? (
              <p className={emptyStateClass}>No articles found.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {articles.map(article => (
                  <ArticleRow
                    key={article._id}
                    article={article}
                    onToggle={handleToggleArticle}
                    actionLoading={articleActionLoading}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard