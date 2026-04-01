import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";
import {
  pageBackground,
  pageWrapper,
  primaryBtn,
  secondaryBtn,
  bodyText,
  mutedText,
  tagClass,
  divider
} from "../styles/common";

const features = [
  {
    icon: "✍️",
    title: "Write & Publish",
    desc: "Share your ideas with the world. Rich articles, beautifully presented.",
  },
  {
    icon: "🗂️",
    title: "Browse by Category",
    desc: "Discover content that matters to you, organized and easy to explore.",
  },
  {
    icon: "💬",
    title: "Join the Conversation",
    desc: "Comment, engage, and connect with authors and readers alike.",
  },
];

function Home() {
  const { isAuthenticated, currentUser } = useAuth();

  const getDashboardPath = () => {
    if (!currentUser) return "/login";
    if (currentUser.role === "AUTHOR") return "/author-dashboard";
    if (currentUser.role === "USER") return "/user-dashboard";
    if (currentUser.role === "ADMIN") return "/admin-dashboard";
    return "/login";
  };

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>

        {/* ── Hero ─────────────────────────────────────── */}
        <section className="text-center py-16 mb-4">
          <span className={`${tagClass} mx-auto mb-4 block`}>Welcome to BlogApp</span>

          <h1 className="text-6xl font-bold text-[#1d1d1f] tracking-tight leading-none mb-5">
            Ideas worth <br />
            <span className="text-[#0066cc]">reading.</span>
          </h1>

          <p className={`${bodyText} max-w-xl mx-auto mb-8 text-base`}>
            A space for curious minds. Discover thoughtful articles, share your perspective,
            and connect with a community that values great writing.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            {isAuthenticated ? (
              <>
                <NavLink to={getDashboardPath()} className={primaryBtn}>
                  Go to Dashboard →
                </NavLink>
                <NavLink to="/articles" className={secondaryBtn}>
                  Browse Articles
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/register" className={primaryBtn}>
                  Get Started Free
                </NavLink>
                <NavLink to="/login" className={secondaryBtn}>
                  Sign In
                </NavLink>
              </>
            )}
          </div>
        </section>

        <div className={divider} />

        {/* ── Features ─────────────────────────────────── */}
        <section className="py-14">
          <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight text-center mb-10">
            Everything you need to read & write
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[#f5f5f7] rounded-2xl p-7 hover:bg-[#ebebf0] transition-colors duration-200"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight mb-2">
                  {f.title}
                </h3>
                <p className={`${bodyText} text-sm`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={divider} />

        {/* ── CTA ──────────────────────────────────────── */}
        {!isAuthenticated && (
          <section className="text-center py-14">
            <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-3">
              Ready to start writing?
            </h2>
            <p className={`${bodyText} mb-6`}>
              Join thousands of readers and authors on BlogApp.
            </p>
            <NavLink to="/register" className={primaryBtn}>
              Create your account
            </NavLink>
          </section>
        )}

        {isAuthenticated && (
          <section className="text-center py-14">
            <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-3">
              Welcome back, {currentUser?.firstName}! 👋
            </h2>
            <p className={`${bodyText} mb-6`}>
              Pick up where you left off.
            </p>
            <NavLink to={getDashboardPath()} className={primaryBtn}>
              Open Dashboard →
            </NavLink>
          </section>
        )}
      </div>
    </div>
  );
}

export default Home;