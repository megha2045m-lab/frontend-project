import { useEffect, useState } from "react";
import axios from "axios";

function DashboardStats() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("https://backend-project-r1kg.onrender.com/api/files");
      setFiles(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const activeFiles = files.filter(file => !file.isDeleted);
  const starredFiles = activeFiles.filter(file => file.isStarred);
  const trashFiles = files.filter(file => file.isDeleted);

  const totalStorage = activeFiles.reduce(
    (sum, file) => sum + file.fileSize,
    0
  );

  const storageMB = (totalStorage / (1024 * 1024)).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500">📁 Total Files</p>
        <h2 className="text-4xl font-bold mt-2">
          {activeFiles.length}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500">⭐ Starred</p>
        <h2 className="text-4xl font-bold mt-2">
          {starredFiles.length}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500">🗑 Trash</p>
        <h2 className="text-4xl font-bold mt-2">
          {trashFiles.length}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500">💾 Storage Used</p>
        <h2 className="text-4xl font-bold mt-2">
          {storageMB} MB
        </h2>
      </div>

    </div>
  );
}

export default DashboardStats;