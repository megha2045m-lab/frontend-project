import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config";

function FileUpload({ onUploadComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => { if (file) setSelectedFile(file); };

  const uploadFile = async () => {
    if (!selectedFile) { toast.warning("Please select a file."); return; }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      setUploading(true);
      setProgress(0);
      await axios.post(`${API_URL}/upload`, formData, {
        onUploadProgress: ev => setProgress(Math.round((ev.loaded * 100) / ev.total)),
      });
      toast.success("File uploaded successfully!");
      setSelectedFile(null);
      if (onUploadComplete) onUploadComplete();
      else window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Upload failed! Check if the backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type) => {
    if (!type) return "📁";
    if (type.startsWith("image/"))       return "🖼️";
    if (type.startsWith("video/"))       return "🎥";
    if (type.startsWith("audio/"))       return "🎵";
    if (type === "application/pdf")      return "📕";
    if (type.includes("word"))           return "📘";
    if (type.includes("sheet") || type.includes("excel")) return "📗";
    if (type.includes("presentation"))  return "📙";
    if (type.includes("zip") || type.includes("rar")) return "📦";
    return "📄";
  };

  return (
    <div style={{
      background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(99,102,241,0.15)",
      borderRadius: 18,
      padding: "1.5rem",
      marginBottom: "1.5rem",
    }}>
      <h2 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
        <span>📤</span> Upload Files
      </h2>

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
        }}
        style={{
          border: `2px dashed ${dragActive ? "#6366f1" : "rgba(99,102,241,0.25)"}`,
          borderRadius: 14,
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragActive ? "rgba(99,102,241,0.08)" : "rgba(30,41,59,0.3)",
          transition: "all 0.2s",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
        onMouseEnter={e => { if (!dragActive) e.currentTarget.style.background = "rgba(99,102,241,0.06)"; }}
        onMouseLeave={e => { if (!dragActive) e.currentTarget.style.background = "rgba(30,41,59,0.3)"; }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>
          {dragActive ? "🎯" : "☁️"}
        </div>
        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#cbd5e1" }}>
          {dragActive ? "Drop it here!" : "Drag & Drop or click to browse"}
        </p>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "#475569" }}>
          Images, documents, videos, audio — any file type
        </p>
        <input ref={inputRef} type="file" hidden onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div style={{
          marginTop: "1rem",
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 12,
          padding: "0.875rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{getFileIcon(selectedFile.type)}</span>
            <div style={{ overflow: "hidden" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {selectedFile.name}
              </p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button onClick={() => setSelectedFile(null)} style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171", borderRadius: 8, padding: "0.375rem 0.75rem",
            cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, fontFamily: "inherit", flexShrink: 0,
          }}>Remove</button>
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b", marginBottom: 6, fontWeight: 600 }}>
            <span>Uploading file...</span>
            <span style={{ color: "#818cf8" }}>{progress}%</span>
          </div>
          <div style={{ width: "100%", height: 4, background: "rgba(30,41,59,0.8)", borderRadius: 9999, overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`, height: "100%", borderRadius: 9999,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              transition: "width 0.3s",
            }} />
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button
            onClick={uploadFile}
            disabled={uploading}
            style={{
              padding: "0.7rem 1.75rem",
              background: uploading ? "rgba(30,41,59,0.6)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white", border: "none", borderRadius: 10, fontWeight: 700,
              fontSize: "0.875rem", cursor: uploading ? "not-allowed" : "pointer",
              transition: "all 0.2s", fontFamily: "inherit",
              boxShadow: uploading ? "none" : "0 6px 16px rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            {uploading ? (
              <>
                <span className="animate-spin" style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                Uploading...
              </>
            ) : "🚀 Upload Now"}
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;