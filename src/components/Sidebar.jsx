import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config";

function Sidebar() {
  const location = useLocation();

  const [storageUsed, setStorageUsed] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const MAX_STORAGE = 100; // MB

  useEffect(() => {
    fetchStorage();
  }, []);

  const fetchStorage = async () => {
    try {
      const res = await axios.get(API_URL);

      const activeFiles = res.data.filter((file) => !file.isDeleted);

      const totalBytes = activeFiles.reduce(
        (sum, file) => sum + file.fileSize,
        0
      );

      const totalMB = totalBytes / (1024 * 1024);

      setStorageUsed(totalMB);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setProgress(0);
      toast.info(`Uploading ${file.name}...`);

      await axios.post(
        `${API_URL}/upload`,
        formData,
        {
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percent);
          },
        }
      );

      toast.success("File uploaded successfully!");
      fetchStorage();
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const percentage = Math.min(
    (storageUsed / MAX_STORAGE) * 100,
    100
  );

  const menuItems = [
    {
      name: "Home",
      icon: "🏠",
      path: "/dashboard",
    },
    {
      name: "My Files",
      icon: "📁",
      path: "/myfiles",
    },
    {
      name: "Starred",
      icon: "⭐",
      path: "/starred",
    },
    {
      name: "Trash",
      icon: "🗑",
      path: "/trash",
    },
    {
      name: "Settings",
      icon: "⚙️",
      path: "/settings",
    },
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-73px)] bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col">

      {/* Upload Button */}

      <div className="p-5">

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-bold shadow-lg shadow-blue-500/10 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Uploading {progress}%</span>
            </>
          ) : (
            <>
              <span className="text-lg">+</span>
              <span>New Upload</span>
            </>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-3 py-2 space-y-1">

        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 font-semibold text-sm
            ${
              location.pathname === item.path
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                : "hover:bg-slate-800/60 hover:text-slate-100 text-slate-400"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}

      </nav>

      {/* Storage Indicator */}

      <div className="p-5 border-t border-slate-800 bg-slate-950/40">

        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Used</span>
          <span className="text-xs font-bold text-blue-400">{percentage.toFixed(1)}%</span>
        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
            style={{
              width: `${percentage}%`,
            }}
          ></div>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          {storageUsed.toFixed(2)} MB of {MAX_STORAGE} MB used
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;