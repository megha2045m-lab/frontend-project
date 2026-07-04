import { useEffect, useRef } from "react";
import { API_URL } from "../config";

function PreviewModal({ file, onClose, onDownload }) {
  if (!file) return null;

  const previewUrl = `${API_URL}/preview/${file._id}`;
  const overlayRef = useRef(null);

  const isImage    = file.fileType?.startsWith("image/");
  const isVideo    = file.fileType?.startsWith("video/");
  const isAudio    = file.fileType?.startsWith("audio/");
  const isPDF      = file.fileType === "application/pdf";
  const isText     = file.fileType?.startsWith("text/");

  const canPreview = isImage || isVideo || isAudio || isPDF || isText;

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const fmtSize = (bytes) => {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = () => {
    if (isImage) return "🖼️";
    if (isVideo) return "🎥";
    if (isAudio) return "🎵";
    if (isPDF)   return "📕";
    if (isText)  return "📄";
    return "📁";
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
      }}
    >
      <div
        className="animate-slideUp"
        style={{
          width: "100%", maxWidth: 900, maxHeight: "90vh",
          background: "rgba(10,15,30,0.97)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 22,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1) inset",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "1.1rem 1.5rem",
          borderBottom: "1px solid rgba(99,102,241,0.12)", flexShrink: 0,
          background: "rgba(15,23,42,0.8)",
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{getFileIcon()}</span>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <p style={{ margin: 0, fontWeight: 700, color: "#e2e8f0", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {file.originalName}
            </p>
            <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b", marginTop: 2 }}>
              {file.fileType} · {fmtSize(file.fileSize)}
            </p>
          </div>

          {/* Download Button — separate from preview */}
          <button
            onClick={() => onDownload(file._id, file.originalName)}
            title="Download this file"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "0.5rem 1rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white", border: "none", borderRadius: 10,
              cursor: "pointer", fontSize: "0.8rem", fontWeight: 700,
              fontFamily: "inherit", flexShrink: 0,
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            ⬇️ Download
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: 8, border: "none",
              background: "rgba(30,41,59,0.8)",
              color: "#64748b", cursor: "pointer", fontSize: 16, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(30,41,59,0.8)"; e.currentTarget.style.color = "#64748b"; }}
          >
            ✕
          </button>
        </div>

        {/* Preview Content */}
        <div style={{
          flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(5,10,20,0.6)", padding: "1.5rem", minHeight: 0,
        }}>
          {isImage && (
            <img
              src={previewUrl}
              alt={file.originalName}
              style={{
                maxWidth: "100%", maxHeight: "70vh",
                objectFit: "contain", borderRadius: 12,
                boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
              }}
            />
          )}

          {isVideo && (
            <video
              src={previewUrl}
              controls
              autoPlay={false}
              style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 12 }}
            />
          )}

          {isAudio && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: 64, marginBottom: "1.5rem" }}>🎵</div>
              <p style={{ color: "#cbd5e1", fontWeight: 600, marginBottom: "1rem" }}>{file.originalName}</p>
              <audio
                src={previewUrl}
                controls
                style={{ width: "100%", maxWidth: 480, borderRadius: 12 }}
              />
            </div>
          )}

          {isPDF && (
            <iframe
              src={previewUrl}
              title={file.originalName}
              style={{ width: "100%", height: "70vh", border: "none", borderRadius: 12 }}
            />
          )}

          {isText && (
            <iframe
              src={previewUrl}
              title={file.originalName}
              style={{
                width: "100%", height: "70vh", border: "none", borderRadius: 12,
                background: "white",
              }}
            />
          )}

          {!canPreview && (
            <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
              <div style={{ fontSize: 64, marginBottom: "1rem" }}>📄</div>
              <p style={{ fontWeight: 700, color: "#cbd5e1", marginBottom: 8, fontSize: "1rem" }}>
                Preview not available
              </p>
              <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.5rem", maxWidth: 320, margin: "0 auto 1.5rem auto" }}>
                This file type ({file.fileType || "unknown"}) cannot be previewed in the browser. Download it to view on your device.
              </p>
              <button
                onClick={() => onDownload(file._id, file.originalName)}
                style={{
                  padding: "0.75rem 2rem",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white", border: "none", borderRadius: 12, fontWeight: 700,
                  fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
                }}
              >
                ⬇️ Download File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;