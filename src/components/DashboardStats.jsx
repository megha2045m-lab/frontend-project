import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const StatCard = ({ icon, label, value, color, suffix }) => (
  <div
    className="animate-fadeIn"
    style={{
      background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(99,102,241,0.12)",
      borderRadius: 16,
      padding: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      transition: "all 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.border = `1px solid ${color}40`;
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = `0 8px 24px ${color}18`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.border = "1px solid rgba(99,102,241,0.12)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div style={{
      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
      background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
      border: `1px solid ${color}30`,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
      <p style={{ margin: "4px 0 0 0", fontSize: "1.75rem", fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>
        {value}
        {suffix && <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#64748b", marginLeft: 4 }}>{suffix}</span>}
      </p>
    </div>
  </div>
);

function DashboardStats() {
  const [files, setFiles] = useState([]);

  useEffect(() => { fetchFiles(); }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(API_URL);
      setFiles(res.data);
    } catch (e) { console.error(e); }
  };

  const active  = files.filter(f => !f.isDeleted);
  const starred = active.filter(f => f.isStarred);
  const trash   = files.filter(f => f.isDeleted);
  const storageMB = (active.reduce((s, f) => s + f.fileSize, 0) / (1024 * 1024)).toFixed(2);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
      <StatCard icon="📁" label="Total Files"   value={active.length}  color="#6366f1" />
      <StatCard icon="⭐" label="Starred"        value={starred.length} color="#f59e0b" />
      <StatCard icon="🗑️" label="In Trash"       value={trash.length}   color="#ef4444" />
      <StatCard icon="💾" label="Storage Used"   value={storageMB}      color="#22c55e" suffix="MB" />
    </div>
  );
}

export default DashboardStats;