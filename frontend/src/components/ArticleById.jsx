import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
  submitBtn,
} from "../styles/common.js";

function ArticleById() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`http://localhost:4000/user-api/article/${id}`, { withCredentials: true });

        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // delete & restore article
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        `http://localhost:4000/author-api/articles-delete`,
        { articleId: id, isArticleActive: newStatus },
        { withCredentials: true },
      );

      console.log("SUCCESS:", res.data);

      setArticle(res.data.payload);

      toast.success(res.data.message);
    } catch (err) {
      console.log("ERROR:", err.response);

      const msg = err.response?.data?.message;

      if (err.response?.status === 400) {
        toast(msg); // already deleted/active case
      } else {
        setError(msg || "Operation failed");
      }
    }
  };
  
  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  const addComment = async (commentData) => {
    try {
      const res = await axios.put(
        "http://localhost:4000/user-api/articles",
        { articleId: id, comment: commentData.comment },
        { withCredentials: true }
      );
      setArticle(res.data.payload);
      toast.success("Comment added successfully");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>✍️ {article.author?.firstName || "Author"}</div>

          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}
      {/* form to add comment if role is USER */}
      {/* USER actions */}
      {user?.role === 'USER' &&(
        <div>
            <form onSubmit={handleSubmit(addComment)}>
                <input type="text" {...register("comment", { required: "Comment is required" })} className={inputClass} placeholder="Write your comment here..." />
                {errors.comment && <p className={errorClass}>{errors.comment.message}</p>}
                <button type="submit" className={submitBtn} >Add Comment</button>
            </form>
        </div>
      )}

      {/* comment */}
      {article.comments && article.comments.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[#e8e8ed]">
          <h3 className="text-xl font-bold mb-6 text-[#1d1d1f]">Comments ({article.comments.length})</h3>
          <div className="flex flex-col gap-6">
            {article.comments.map((comment, idx)=>(
              <div key={idx} className="flex gap-4">
                {comment.user?.profileImageUrl ? (
                  <img src={comment.user.profileImageUrl} alt="user" className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#e8e8ed]" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#6e6e73] font-bold shrink-0 border border-[#e8e8ed]">
                    {(comment.user?.firstName?.[0] || comment.user?.email?.[0] || "?").toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col flex-1 bg-[#f5f5f7] rounded-2xl rounded-tl-sm p-4">
                  <p className="font-semibold text-sm text-[#1d1d1f]">{comment.user?.firstName || "User"} <span className="text-xs font-normal text-[#a1a1a6] ml-1">{comment.user?.email}</span></p>
                  <p className="text-[#6e6e73] mt-1 text-sm leading-relaxed">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
    </div>
  );
}

export default ArticleById;