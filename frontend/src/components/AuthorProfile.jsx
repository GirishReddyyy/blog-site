import { NavLink, Outlet } from "react-router";
import { pageWrapper, navLinksClass, navLinkClass, navLinkActiveClass, divider } from "../styles/common";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

function AuthorProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className={pageWrapper}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt={currentUser?.firstName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#0066cc] flex items-center justify-center text-white font-bold">
              {currentUser?.firstName?.[0]?.toUpperCase() || "A"}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">Welcome, {currentUser?.firstName || "Author"}</p>
            <p className="text-sm text-[#6e6e73]">Author Dashboard</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#cc2f26] text-white py-2 px-4 rounded-lg hover:bg-[#a7241e] transition"
        >
          Logout
        </button>
      </div>

      {/* Author Navigation */}
      <div className="flex gap-6 mb-6">
        <NavLink to="articles" className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}>
          Articles
        </NavLink>

        <NavLink to="write-article" className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}>
          Write Article
        </NavLink>
      </div>

      <div className={divider}></div>

      {/* Nested route content */}
      <Outlet />
    </div>
  );
}

export default AuthorProfile;