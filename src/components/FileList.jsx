import { useEffect, useState } from "react";
import axios from "axios";
import PreviewModal from "./PreviewModal";
import { API_URL as API } from "../config";

function FileList({ filter, search = "" }) {
  const [files, setFiles] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [selectedFile, setSelectedFile] = useState(null);

useEffect(() => {
    fetchFiles();
  }, [filter, sortBy, search]); // ✅ FIXED

  const fetchFiles = async () => {
    try {
      const res = await axios.get(API);

      let data = res.data;

      if (filter === "starred") {
        data = data.filter(
          (file) => file.isStarred && !file.isDeleted
        );
      } else if (filter === "trash") {
        data = data.filter((file) => file.isDeleted);
      } else {
        data = data.filter((file) => !file.isDeleted);
      }

      if (search.trim() !== "") {
        data = data.filter((file) =>
          file.originalName
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      }

      switch (sortBy) {
  case "name":
    data.sort((a, b) =>
      a.originalName.localeCompare(b.originalName)
    );
    break;

  case "size":
    data.sort((a, b) => b.fileSize - a.fileSize);
    break;

  case "type":
    data.sort((a, b) =>
      a.fileType.localeCompare(b.fileType)
    );
    break;

  default:
    data.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
}

setFiles(data);
    } catch (error) {
      console.error(error);
    }
  };
      const getFileType = (type) => {
      if (type.includes("image")) return "Image";
      if (type.includes("pdf")) return "PDF";
      if (type.includes("word")) return "Word";
      if (type.includes("sheet")) return "Excel";
      if (type.includes("presentation")) return "PowerPoint";
      if (type.includes("audio")) return "Audio";
      if (type.includes("video")) return "Video";
      return "File";
    };

    const openPreview = (file) => {
      setSelectedFile(file);
    };

  const downloadFile = (id) => {
    window.open(`${API}/download/${id}`, "_blank");
  };

  const toggleStar = async (id) => {
    try {
      await axios.patch(`${API}/star/${id}`);
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  const restoreFile = async (id) => {
    try {
      await axios.patch(`${API}/restore/${id}`);
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteForever = async (id) => {
    if (!window.confirm("Delete forever?")) return;

    try {
      await axios.delete(`${API}/forever/${id}`);
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  const getFileIcon = (fileType, fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();

  if (fileType.includes("image")) return "🖼️";
  if (fileType.includes("video")) return "🎥";
  if (fileType.includes("audio")) return "🎵";
  if (fileType.includes("pdf")) return "📕";

  switch (extension) {
    case "doc":
    case "docx":
      return "📘";

    case "xls":
    case "xlsx":
      return "📗";

    case "ppt":
    case "pptx":
      return "📙";

    case "zip":
    case "rar":
      return "📦";

    case "txt":
      return "📄";

    default:
      return "📁";
  }
};

  return (
    <div className="mt-8">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          {filter === "starred"
            ? "⭐ Starred Files"
            : filter === "trash"
            ? "🗑 Trash"
            : "📁 My Files"}
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold cursor-pointer"
          >
            <option value="date">Newest</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="type">File Type</option>
          </select>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 shadow-sm flex flex-col items-center justify-center">
          <div className="text-5xl mb-3">📂</div>
          <p className="font-semibold text-slate-500">No files found</p>
          <p className="text-xs text-slate-400 mt-1">Upload some files to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {files.map((file) => (
            <div
              key={file._id}
              className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                    {getFileIcon(file.fileType, file.originalName)}
                  </div>
                  {filter !== "trash" && (
                    <button
                      onClick={() => toggleStar(file._id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-200 ${
                        file.isStarred
                          ? "bg-amber-50 text-amber-500 border border-amber-200/50"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-400 border border-slate-100"
                      }`}
                    >
                      ★
                    </button>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-sm truncate" title={file.originalName}>
                  {file.originalName}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-medium">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {(file.fileSize / 1024).toFixed(1)} KB
                  </span>
                  <span>•</span>
                  <span>{getFileType(file.fileType)}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 mt-5 pt-4 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  {new Date(file.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <div className="flex gap-1.5">
                  {filter === "trash" ? (
                    <>
                      <button
                        onClick={() => restoreFile(file._id)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-blue-100/50 cursor-pointer"
                      >
                        Restore
                      </button>

                      <button
                        onClick={() => deleteForever(file._id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-rose-100/50 cursor-pointer"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => openPreview(file)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-200/50 cursor-pointer"
                      >
                        Preview
                      </button>

                      <button
                        onClick={() => downloadFile(file._id)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors border border-blue-100/50 cursor-pointer"
                      >
                        Get
                      </button>

                      <button
                        onClick={() => deleteFile(file._id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors border border-rose-100/50 cursor-pointer"
                      >
                        Trash
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFile && (
        <PreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}

    </div>
  );
}

export default FileList;