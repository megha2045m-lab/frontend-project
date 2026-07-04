import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Please check your email or sign in.");
      navigate("/login");
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleRegister(); };

  const inputStyle = {
    width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem",
    background: "rgba(30,41,59,0.6)", border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 12, color: "#e2e8f0", fontSize: "0.9rem", outline: "none",
    transition: "border-color 0.2s", fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", background: "#0a0f1e", position: "relative", overflow: "hidden",
      backgroundImage: `
        radial-gradient(ellipse 80% 60% at 30% -10%, rgba(99,102,241,0.2), transparent),
        radial-gradient(ellipse 50% 50% at 80% 90%, rgba(139,92,246,0.15), transparent)
      `,
    }}>
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", top: "-10%", left: "-10%", background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", bottom: "-10%", right: "-5%", background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)", pointerEvents: "none" }} />

      <div className="animate-slideUp" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        <div style={{
          background: "rgba(15,23,42,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(99,102,241,0.2)", borderRadius: 24, padding: "2.5rem",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.05) inset",
        }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, marginBottom: "1rem",
              boxShadow: "0 8px 24px rgba(139,92,246,0.4)",
            }}>🛡️</div>
            <h1 style={{
              fontSize: "1.75rem", fontWeight: 800, margin: 0,
              background: "linear-gradient(135deg, #a5b4fc, #818cf8, #c4b5fd)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Create Account</h1>
            <p style={{ color: "#64748b", marginTop: 8, fontSize: "0.9rem" }}>
              Join My Drive — free cloud storage
            </p>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>📧</span>
              <input
                type="email" placeholder="Email address"
                value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
              />
            </div>

            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔒</span>
              <input
                type={showPass ? "text" : "password"} placeholder="Password (min. 6 characters)"
                value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown}
                style={{ ...inputStyle, paddingRight: "3rem" }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 14, padding: 0 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>✅</span>
              <input
                type={showPass ? "text" : "password"} placeholder="Confirm password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={handleKeyDown}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
              />
            </div>
          </div>

          {/* Register Button */}
          <button onClick={handleRegister} disabled={loading}
            style={{
              width: "100%", marginTop: "1.5rem", padding: "0.9rem",
              background: loading ? "#374151" : "linear-gradient(135deg, #8b5cf6, #6366f1)",
              color: "white", border: "none", borderRadius: 12, fontWeight: 700,
              fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s", boxShadow: loading ? "none" : "0 8px 24px rgba(139,92,246,0.35)",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span className="animate-spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                Creating account...
              </span>
            ) : "Create Account →"}
          </button>

          <p style={{ textAlign: "center", marginTop: "1.25rem", color: "#64748b", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}
            >Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;