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
    <aside className="w-64 min-h-screen bg-white shadow-lg flex flex-col">

      {/* Upload Button */}

      <div className="p-6 border-b">

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition disabled:bg-gray-400"
        >
          {uploading ? `Uploading ${progress}%` : "+ New Upload"}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4">

        <ul className="space-y-2">

          {menuItems.map((item) => (

            <li key={item.path}>

              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium

                ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span>{item.icon}</span>

                <span>{item.name}</span>

              </Link>

            </li>

          ))}

        </ul>

      </nav>

      {/* Storage */}

      <div className="p-6 border-t">

        <h3 className="font-semibold mb-3">
          Storage
        </h3>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          ></div>

        </div>

        <p className="text-sm text-gray-500 mt-2">
          {storageUsed.toFixed(2)} MB of {MAX_STORAGE} MB used
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;