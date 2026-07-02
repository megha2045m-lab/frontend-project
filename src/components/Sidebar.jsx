import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar() {
  const location = useLocation();

  const [storageUsed, setStorageUsed] = useState(0);

  const MAX_STORAGE = 100; // MB

  useEffect(() => {
    fetchStorage();
  }, []);

  const fetchStorage = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files");

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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
        >
          + New Upload
        </button>

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