import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL as API } from "../config";

const getFileIcon = (fileType) => {
  if (!fileType) return "📁";
  if (fileType.startsWith("image/")) return "🖼️";
  if (fileType.startsWith("video/")) return "🎥";
  if (fileType.startsWith("audio/")) return "🎵";
  if (fileType === "application/pdf") return "📕";
  if (fileType.includes("word"))      return "📘";
  if (fileType.includes("sheet"))     return "📗";
  return "📄";
};

const fmtSize = (bytes) => {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

function RecentFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get(API)
      .then(res => {
        const recent = res.data
          .filter(f => !f.isDeleted)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setFiles(recent);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{
      background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(99,102,241,0.12)",
      borderRadius: 18,
      padding: "1.5rem",
      marginTop: "1.5rem",
    }}>
      <h2 style={{ margin: "0 0 1.25rem 0", fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
        <span>🕒</span> Recent Uploads
      </h2>

      {files.length === 0 ? (
        <p style={{ color: "#475569", fontSize: "0.875rem", textAlign: "center", padding: "1.5rem 0" }}>
          No recent files. Upload something!
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {files.map((file, i) => (
            <div
              key={file._id}
              className="animate-fadeIn"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.75rem 0.875rem", borderRadius: 12, transition: "background 0.15s",
                animationDelay: `${i * 60}ms`,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden", flex: 1 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{getFileIcon(file.fileType)}</span>
                <div style={{ overflow: "hidden" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {file.originalName}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "#475569" }}>
                    {new Date(file.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <span style={{
                background: "rgba(99,102,241,0.12)", color: "#818cf8",
                borderRadius: 8, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0,
              }}>
                {fmtSize(file.fileSize)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentFiles;