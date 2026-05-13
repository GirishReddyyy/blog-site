import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
  articleExcerpt,
  articleMeta,
  tagClass,
} from "../styles/common.js";

function UserProfile() {
  const logout = useAuth((state) => state.logout);
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();
  //console.log("currentUser in profile",currentUser)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getArticles = async () => {
        
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/user-api/articles/${currentUser?._id}`, { withCredentials: true });
        setArticles(res.data.payload || []);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [currentUser]);

  // convert UTC → IST
  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  return (
    <div>
      {error && <p className={errorClass}>{error}</p>}

      <div className="text-end mb-8">
        <div className="flex items-center justify-end gap-6 mb-4">
          <div className="text-right">
            <p className="text-4xl font-bold text-[#1d1d1f]">{currentUser?.firstName || "User"}</p>
            <p className="text-sm text-[#6e6e73] mt-2">{currentUser?.email}</p>
          </div>
          {/* Profile Image with Fallback */}
          {currentUser?.profileImageUrl ? (
            <img 
              src={currentUser.profileImageUrl} 
              className="w-20 h-20 rounded-full object-cover border-2 border-[#0066cc] shadow-sm" 
              alt={currentUser?.firstName}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#0066cc] flex items-center justify-center text-white font-bold text-3xl border-2 border-[#0066cc]">
              {currentUser?.firstName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end mb-6">
        <button className="bg-[#0066cc] text-white px-6 py-2 rounded-full hover:bg-[#004499] transition-colors font-medium" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className={articleGrid}>
        {articles?.map((articleObj) => (
          <div className={`${articleCardClass} relative`} key={articleObj._id}>
            <div className="flex flex-col gap-2">
              <span className={tagClass}>{articleObj.category || 'Article'}</span>
              <p className={articleTitle}>{articleObj.title}</p>
              <p className={`${articleExcerpt} line-clamp-3`}>{articleObj.content}</p>
              <p className={timestampClass}>{formatDateIST(articleObj.createdAt)}</p>
            </div>

            {/* Button at bottom */}
            <button className={`${ghostBtn} mt-auto pt-4 text-left`} onClick={() => navigateToArticleByID(articleObj)}>
              Read Article →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;