import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config";

const menuItems = [
  { name: "Dashboard", icon: "🏠", path: "/dashboard" },
  { name: "My Files",  icon: "📁", path: "/myfiles" },
  { name: "Starred",   icon: "⭐", path: "/starred" },
  { name: "Trash",     icon: "🗑️", path: "/trash" },
  { name: "Settings",  icon: "⚙️", path: "/settings" },
];

function Sidebar() {
  const location = useLocation();
  const [storageUsed, setStorageUsed] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const MAX_STORAGE = 100; // MB

  useEffect(() => { fetchStorage(); }, []);

  const fetchStorage = async () => {
    try {
      const res = await axios.get(API_URL);
      const total = res.data
        .filter(f => !f.isDeleted)
        .reduce((sum, f) => sum + f.fileSize, 0);
      setStorageUsed(total / (1024 * 1024));
    } catch (e) { console.error(e); }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      setProgress(0);
      toast.info(`Uploading ${file.name}...`);
      await axios.post(`${API_URL}/upload`, formData, {
        onUploadProgress: ev => setProgress(Math.round((ev.loaded * 100) / ev.total)),
      });
      toast.success("File uploaded successfully!");
      fetchStorage();
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const percentage = Math.min((storageUsed / MAX_STORAGE) * 100, 100);
  const storageColor = percentage > 80 ? "#ef4444" : percentage > 60 ? "#f59e0b" : "#6366f1";

  return (
    <aside style={{
      width: 260,
      minHeight: "calc(100vh - 64px)",
      background: "rgba(10,15,30,0.7)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(99,102,241,0.12)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}>

      {/* Upload Button */}
      <div style={{ padding: "1.25rem" }}>
        <button
          onClick={handleUploadClick}
          disabled={uploading}
          style={{
            width: "100%",
            padding: "0.875rem",
            background: uploading ? "rgba(30,41,59,0.6)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "white",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: uploading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s",
            fontFamily: "inherit",
            boxShadow: uploading ? "none" : "0 6px 20px rgba(99,102,241,0.3)",
          }}
          onMouseEnter={e => { if (!uploading) e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          {uploading ? (
            <>
              <span className="animate-spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
              <span>Uploading {progress}%</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
              <span>New Upload</span>
            </>
          )}
        </button>
        <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />
      </div>

      {/* Progress bar when uploading */}
      {uploading && (
        <div style={{ paddingInline: "1.25rem", marginTop: -8, marginBottom: 8 }}>
          <div style={{ width: "100%", height: 3, background: "rgba(99,102,241,0.15)", borderRadius: 9999, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 9999, transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "0.5rem 0.75rem", display: "flex", flexDirection: "column", gap: 4 }}>
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0.65rem 1rem",
                borderRadius: 12,
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#ffffff" : "#64748b",
                background: isActive
                  ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))"
                  : "transparent",
                border: isActive ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.color = "#cbd5e1"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.name}</span>
              {isActive && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#818cf8" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Storage Indicator */}
      <div style={{
        padding: "1.25rem",
        borderTop: "1px solid rgba(99,102,241,0.1)",
        background: "rgba(10,15,30,0.4)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Storage
          </span>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: storageColor }}>
            {percentage.toFixed(1)}%
          </span>
        </div>

        <div style={{ width: "100%", height: 6, background: "rgba(30,41,59,0.8)", borderRadius: 9999, overflow: "hidden", marginBottom: 8 }}>
          <div style={{
            width: `${percentage}%`, height: "100%", borderRadius: 9999,
            background: `linear-gradient(90deg, ${storageColor}, ${storageColor}aa)`,
            transition: "width 0.5s ease",
          }} />
        </div>

        <p style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 500, margin: 0 }}>
          {storageUsed.toFixed(2)} MB of {MAX_STORAGE} MB used
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;