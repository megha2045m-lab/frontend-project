import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    localStorage.setItem("user", JSON.stringify(data.user));
    toast.success("Welcome back!");
    navigate("/dashboard");
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      background: "#0a0f1e",
      backgroundImage: `
        radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.2), transparent),
        radial-gradient(ellipse 50% 50% at 80% 90%, rgba(139,92,246,0.15), transparent)
      `,
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Floating Orbs */}
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)",
        top: "-10%", left: "-10%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)",
        bottom: "-10%", right: "-5%", pointerEvents: "none",
      }} />

      <div className="animate-slideUp" style={{
        width: "100%", maxWidth: 420, position: "relative", zIndex: 1,
      }}>
        {/* Card */}
        <div style={{
          background: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 24,
          padding: "2.5rem",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.05) inset",
        }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, marginBottom: "1rem",
              boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
            }}>
              ☁️
            </div>
            <h1 style={{
              fontSize: "1.75rem", fontWeight: 800, margin: 0,
              background: "linear-gradient(135deg, #a5b4fc, #818cf8, #c4b5fd)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              My Drive
            </h1>
            <p style={{ color: "#64748b", marginTop: 8, fontSize: "0.9rem" }}>
              Sign in to your cloud storage
            </p>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>📧</span>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem",
                  background: "rgba(30,41,59,0.6)", border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 12, color: "#e2e8f0", fontSize: "0.9rem", outline: "none",
                  transition: "border-color 0.2s", fontFamily: "inherit", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
              />
            </div>

            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔒</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: "100%", padding: "0.875rem 3rem 0.875rem 2.75rem",
                  background: "rgba(30,41,59,0.6)", border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 12, color: "#e2e8f0", fontSize: "0.9rem", outline: "none",
                  transition: "border-color 0.2s", fontFamily: "inherit", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#64748b",
                  fontSize: 14, padding: 0,
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%", marginTop: "1.5rem", padding: "0.9rem",
              background: loading ? "#374151" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white", border: "none", borderRadius: 12, fontWeight: 700,
              fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s", boxShadow: loading ? "none" : "0 8px 24px rgba(99,102,241,0.35)",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span className="animate-spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                Signing in...
              </span>
            ) : "Sign In →"}
          </button>

          {/* Register Link */}
          <p style={{ textAlign: "center", marginTop: "1.25rem", color: "#64748b", fontSize: "0.875rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;