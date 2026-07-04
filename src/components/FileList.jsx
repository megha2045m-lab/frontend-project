import { useEffect, useState } from "react";
import axios from "axios";
import PreviewModal from "./PreviewModal";
import { API_URL as API } from "../config";

const getFileIcon = (fileType, fileName = "") => {
  if (!fileType) return "📁";
  if (fileType.startsWith("image/"))       return "🖼️";
  if (fileType.startsWith("video/"))       return "🎥";
  if (fileType.startsWith("audio/"))       return "🎵";
  if (fileType === "application/pdf")      return "📕";
  const ext = fileName.split(".").pop().toLowerCase();
  if (["doc","docx"].includes(ext))        return "📘";
  if (["xls","xlsx"].includes(ext))        return "📗";
  if (["ppt","pptx"].includes(ext))        return "📙";
  if (["zip","rar","7z"].includes(ext))    return "📦";
  if (ext === "txt")                       return "📄";
  if (fileType.includes("word"))           return "📘";
  if (fileType.includes("sheet"))          return "📗";
  if (fileType.includes("presentation"))  return "📙";
  return "📁";
};

const getFileLabel = (fileType) => {
  if (!fileType) return "File";
  if (fileType.startsWith("image/"))       return "Image";
  if (fileType.startsWith("video/"))       return "Video";
  if (fileType.startsWith("audio/"))       return "Audio";
  if (fileType === "application/pdf")      return "PDF";
  if (fileType.includes("word"))           return "Word";
  if (fileType.includes("sheet"))          return "Excel";
  if (fileType.includes("presentation"))  return "PowerPoint";
  if (fileType.includes("zip"))            return "Archive";
  if (fileType.includes("text"))           return "Text";
  return "File";
};

const fmtSize = (bytes) => {
  if (bytes < 1024)           return `${bytes} B`;
  if (bytes < 1024 * 1024)    return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const fmtDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

function FileCard({ file, filter, onPreview, onDownload, onStar, onDelete, onRestore, onDeleteForever }) {
  const [hovered, setHovered] = useState(false);

  const labelColors = {
    "Image": "#22c55e", "Video": "#8b5cf6", "Audio": "#f59e0b",
    "PDF": "#ef4444", "Word": "#3b82f6", "Excel": "#10b981",
    "PowerPoint": "#f97316", "Archive": "#64748b", "Text": "#94a3b8", "File": "#6366f1",
  };
  const labelColor = labelColors[getFileLabel(file.fileType)] || "#6366f1";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="animate-fadeIn"
      style={{
        background: hovered ? "rgba(20,30,55,0.85)" : "rgba(15,23,42,0.6)",
        backdropFilter: "blur(16px)",
        border: hovered ? `1px solid rgba(99,102,241,0.3)` : "1px solid rgba(99,102,241,0.12)",
        borderRadius: 18,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.875rem",
        transition: "all 0.2s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.4)" : "none",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: `${labelColor}18`,
          border: `1px solid ${labelColor}30`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>
          {getFileIcon(file.fileType, file.originalName)}
        </div>
        {filter !== "trash" && (
          <button
            onClick={() => onStar(file._id)}
            title={file.isStarred ? "Unstar" : "Star"}
            style={{
              width: 32, height: 32, borderRadius: 8, border: "none",
              background: file.isStarred ? "rgba(245,158,11,0.15)" : "rgba(30,41,59,0.5)",
              color: file.isStarred ? "#f59e0b" : "#475569",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,158,11,0.2)"; e.currentTarget.style.color = "#f59e0b"; }}
            onMouseLeave={e => {
              e.currentTarget.style.background = file.isStarred ? "rgba(245,158,11,0.15)" : "rgba(30,41,59,0.5)";
              e.currentTarget.style.color = file.isStarred ? "#f59e0b" : "#475569";
            }}
          >★</button>
        )}
      </div>

      {/* File Info */}
      <div>
        <h3 title={file.originalName} style={{
          margin: "0 0 6px 0", fontSize: "0.875rem", fontWeight: 700, color: "#e2e8f0",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {file.originalName}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            background: `${labelColor}18`, color: labelColor, border: `1px solid ${labelColor}30`,
            borderRadius: 6, padding: "2px 8px", fontSize: "0.7rem", fontWeight: 700,
          }}>
            {getFileLabel(file.fileType)}
          </span>
          <span style={{ color: "#475569", fontSize: "0.75rem", fontWeight: 500 }}>
            {fmtSize(file.fileSize)}
          </span>
        </div>
      </div>

      {/* Date + Actions */}
      <div style={{ borderTop: "1px solid rgba(99,102,241,0.1)", paddingTop: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.7rem", color: "#475569", fontWeight: 500 }}>
          {fmtDate(file.createdAt)}
        </span>

        <div style={{ display: "flex", gap: 6 }}>
          {filter === "trash" ? (
            <>
              <ActionBtn onClick={() => onRestore(file._id)} label="Restore" color="#6366f1" />
              <ActionBtn onClick={() => onDeleteForever(file._id)} label="Delete" color="#ef4444" danger />
            </>
          ) : (
            <>
              {/* PREVIEW — opens in modal, no download */}
              <ActionBtn onClick={() => onPreview(file)} label="Preview" color="#8b5cf6" icon="👁" />
              {/* DOWNLOAD — forces browser download */}
              <ActionBtn onClick={() => onDownload(file._id, file.originalName)} label="Download" color="#6366f1" icon="⬇" />
              {/* TRASH */}
              <ActionBtn onClick={() => onDelete(file._id)} label="Trash" color="#ef4444" danger icon="🗑" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, label, color, danger, icon }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "0.375rem 0.625rem",
        background: hov ? `${color}25` : `${color}12`,
        color: hov ? color : `${color}cc`,
        border: `1px solid ${hov ? color + "50" : color + "25"}`,
        borderRadius: 8, cursor: "pointer", fontSize: "0.72rem", fontWeight: 700,
        transition: "all 0.15s", fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 4,
      }}
    >
      {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
      {label}
    </button>
  );
}

function FileList({ filter, search = "" }) {
  const [files, setFiles] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchFiles(); }, [filter, sortBy, search]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      let data = res.data;

      if (filter === "starred")    data = data.filter(f => f.isStarred && !f.isDeleted);
      else if (filter === "trash") data = data.filter(f => f.isDeleted);
      else                         data = data.filter(f => !f.isDeleted);

      if (search.trim())
        data = data.filter(f => f.originalName.toLowerCase().includes(search.toLowerCase()));

      switch (sortBy) {
        case "name": data.sort((a, b) => a.originalName.localeCompare(b.originalName)); break;
        case "size": data.sort((a, b) => b.fileSize - a.fileSize); break;
        case "type": data.sort((a, b) => a.fileType.localeCompare(b.fileType)); break;
        default:     data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setFiles(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // PREVIEW — opens modal (inline, no download)
  const openPreview = (file) => setSelectedFile(file);

  // DOWNLOAD — forces browser file download
  const downloadFile = (id, originalName) => {
    const link = document.createElement("a");
    link.href = `${API}/download/${id}`;
    link.setAttribute("download", originalName || "file");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleStar = async (id) => {
    try { await axios.patch(`${API}/star/${id}`); fetchFiles(); }
    catch (e) { console.error(e); }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Move this file to trash?")) return;
    try { await axios.delete(`${API}/${id}`); fetchFiles(); }
    catch (e) { console.error(e); }
  };

  const restoreFile = async (id) => {
    try { await axios.patch(`${API}/restore/${id}`); fetchFiles(); }
    catch (e) { console.error(e); }
  };

  const deleteForever = async (id) => {
    if (!window.confirm("Permanently delete this file? This cannot be undone.")) return;
    try { await axios.delete(`${API}/forever/${id}`); fetchFiles(); }
    catch (e) { console.error(e); }
  };

  const title = filter === "starred" ? "⭐ Starred Files" : filter === "trash" ? "🗑️ Trash" : "📁 My Files";

  return (
    <div style={{ marginTop: "0.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#e2e8f0" }}>{title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              background: "rgba(15,23,42,0.8)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 10, padding: "0.45rem 0.875rem", color: "#cbd5e1",
              fontSize: "0.8rem", outline: "none", cursor: "pointer", fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            <option value="date">Newest First</option>
            <option value="name">Name A–Z</option>
            <option value="size">Largest First</option>
            <option value="type">File Type</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem", color: "#64748b" }}>
          <span className="animate-spin" style={{ width: 28, height: 28, border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", borderRadius: "50%", display: "inline-block" }} />
        </div>
      )}

      {/* Empty State */}
      {!loading && files.length === 0 && (
        <div style={{
          background: "rgba(15,23,42,0.4)", border: "1px dashed rgba(99,102,241,0.2)", borderRadius: 18,
          padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 48, opacity: 0.5 }}>
            {filter === "trash" ? "🗑️" : filter === "starred" ? "⭐" : "📁"}
          </div>
          <p style={{ margin: 0, fontWeight: 700, color: "#475569" }}>No files found</p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#334155" }}>
            {filter === "trash" ? "Your trash is empty" : filter === "starred" ? "Star some files to see them here" : "Upload your first file using the button above"}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && files.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
          {files.map(file => (
            <FileCard
              key={file._id}
              file={file}
              filter={filter}
              onPreview={openPreview}
              onDownload={downloadFile}
              onStar={toggleStar}
              onDelete={deleteFile}
              onRestore={restoreFile}
              onDeleteForever={deleteForever}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedFile && (
        <PreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDownload={downloadFile}
        />
      )}
    </div>
  );
}

export default FileList;