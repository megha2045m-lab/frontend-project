import { useEffect, useState } from "react";
import axios from "axios";
import PreviewModal from "./PreviewModal";

const API = "https://backend-project-r1kg.onrender.com/api/files";

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

      {/* ✅ FIXED TITLE */}
      <div className="flex justify-between items-center mb-6">

  <h2 className="text-3xl font-bold">
    {filter === "starred"
      ? "⭐ Starred Files"
      : filter === "trash"
      ? "🗑 Trash"
      : "📁 My Files"}
  </h2>

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="border rounded-lg px-4 py-2"
  >
    <option value="date">Newest</option>
    <option value="name">Name</option>
    <option value="size">Size</option>
    <option value="type">File Type</option>
  </select>

</div>

      {files.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          No files found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {files.map((file) => (
            <div
              key={file._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6"
            >
              <div className="text-5xl mb-4 text-center">
                {getFileIcon(file.fileType, file.originalName)}
              </div>

              <h3 className="font-bold text-lg truncate">
                {file.originalName}
              </h3>

              <div className="text-gray-500 mt-2 space-y-1">
                  <p>
                    📦 {(file.fileSize / 1024).toFixed(2)} KB
                  </p>

                  <p>
                    📄 {getFileType(file.fileType)}
                  </p>

                  <p className="text-sm">
                    📅 {new Date(file.createdAt).toLocaleDateString()}
                  </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">

                {filter === "trash" ? (
                  <>
                    <button
                      onClick={() => restoreFile(file._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Restore
                    </button>

                    <button
                      onClick={() => deleteForever(file._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete Forever
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleStar(file._id)}
                     className={`px-4 py-2 rounded-lg text-white ${
                      file.isStarred
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                    >
                      {file.isStarred ? "⭐ Starred" : "☆ Star"}
                    </button>

                    <button
                      onClick={() => openPreview(file)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Preview
                    </button>

                    <button
                      onClick={() => downloadFile(file._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Download
                    </button>

                    <button
                      onClick={() => deleteFile(file._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileList;