import Layout from "../components/Layout";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email || "Not logged in";
  const initial = email.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const cardStyle = {
    background: "rgba(15,23,42,0.6)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(99,102,241,0.15)",
    borderRadius: 18,
    padding: "1.5rem",
    marginBottom: "1rem",
  };

  const rowStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0.875rem 0",
    borderBottom: "1px solid rgba(99,102,241,0.08)",
  };

  const labelStyle = { fontSize: "0.875rem", color: "#64748b", fontWeight: 500 };
  const valueStyle = { fontSize: "0.875rem", color: "#e2e8f0", fontWeight: 600 };

  return (
    <Layout>
      <div style={{ maxWidth: 600 }}>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#e2e8f0" }}>⚙️ Settings</h1>
          <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "0.875rem" }}>Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", fontWeight: 800, color: "white",
              boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
            }}>{initial}</div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#e2e8f0", fontSize: "0.95rem" }}>My Account</p>
              <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.8rem" }}>{email}</p>
            </div>
          </div>

          <div>
            <div style={rowStyle}>
              <span style={labelStyle}>📧 Email</span>
              <span style={valueStyle}>{email}</span>
            </div>
            <div style={{ ...rowStyle, borderBottom: "none" }}>
              <span style={labelStyle}>💾 Storage Limit</span>
              <span style={valueStyle}>100 MB</span>
            </div>
          </div>
        </div>

        {/* About Card */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", fontWeight: 700, color: "#e2e8f0" }}>ℹ️ About</h2>
          <div>
            <div style={rowStyle}>
              <span style={labelStyle}>Application</span>
              <span style={valueStyle}>My Drive</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Version</span>
              <span style={valueStyle}>2.0.0</span>
            </div>
            <div style={{ ...rowStyle, borderBottom: "none" }}>
              <span style={labelStyle}>Tech Stack</span>
              <span style={valueStyle}>React + Node.js + MongoDB</span>
            </div>
          </div>
        </div>

        {/* Logout Card */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 0.875rem 0", fontSize: "0.95rem", fontWeight: 700, color: "#e2e8f0" }}>🔐 Account Actions</h2>
          <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#64748b" }}>
            Signing out will clear your session data from this device.
          </p>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.75rem 1.5rem",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 12, color: "#f87171", cursor: "pointer",
              fontWeight: 700, fontSize: "0.875rem", fontFamily: "inherit", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          >
            🚪 Sign Out
          </button>
        </div>

      </div>
    </Layout>
  );
}

export default Settings;