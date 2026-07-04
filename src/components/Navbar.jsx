import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ onSearch }) {
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const initial = user?.email?.charAt(0).toUpperCase() || "?";
  const email = user?.email || "User";

  const handleChange = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header style={{
      background: "rgba(10,15,30,0.9)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(99,102,241,0.15)",
      padding: "0 1.5rem",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 50,
      gap: "1rem",
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
        }}>☁️</div>
        <span style={{
          fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, #a5b4fc, #818cf8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>My Drive</span>
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 560, position: "relative" }}>
        <span style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: "#475569", fontSize: 15, pointerEvents: "none",
        }}>🔍</span>
        <input
          type="text"
          placeholder="Search files by name or type..."
          value={search}
          onChange={handleChange}
          style={{
            width: "100%", padding: "0.6rem 1rem 0.6rem 2.75rem",
            background: "rgba(30,41,59,0.6)", border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 12, color: "#e2e8f0", fontSize: "0.875rem", outline: "none",
            transition: "border-color 0.2s", fontFamily: "inherit", boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = "#6366f1"}
          onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.15)"}
        />
      </div>

      {/* User Area */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: "rgba(30,41,59,0.6)",
            border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "0.4rem 0.75rem",
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(30,41,59,0.6)"}
        >
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: "0.875rem",
          }}>{initial}</div>
          <span style={{ color: "#94a3b8", fontSize: "0.8rem", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email}
          </span>
          <span style={{ color: "#64748b", fontSize: 10 }}>▼</span>
        </button>

        {showMenu && (
          <div style={{
            position: "absolute", right: 0, top: "110%", background: "rgba(15,23,42,0.98)",
            backdropFilter: "blur(16px)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 12, padding: "0.5rem", minWidth: 180, zIndex: 100,
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          }}>
            <Link to="/settings" onClick={() => setShowMenu(false)} style={{
              display: "block", padding: "0.6rem 0.875rem", borderRadius: 8, color: "#cbd5e1",
              fontSize: "0.875rem", textDecoration: "none", transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >⚙️ Settings</Link>
            <div style={{ height: 1, background: "rgba(99,102,241,0.1)", margin: "0.25rem 0" }} />
            <button onClick={handleLogout} style={{
              display: "block", width: "100%", padding: "0.6rem 0.875rem", borderRadius: 8,
              color: "#f87171", fontSize: "0.875rem", background: "none", border: "none",
              cursor: "pointer", textAlign: "left", transition: "background 0.15s", fontFamily: "inherit",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >🚪 Logout</button>
          </div>
        )}
      </div>

    </header>
  );
}

export default Navbar;