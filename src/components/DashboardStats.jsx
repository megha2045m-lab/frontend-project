import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function DashboardStats() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(API_URL);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Files</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {activeFiles.length}
            </h2>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform">
            📁
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-slate-500">Starred Files</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {starredFiles.length}
            </h2>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform">
            ⭐
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-slate-500">Trash Bin</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {trashFiles.length}
            </h2>
          </div>
          <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform">
            🗑
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-slate-500">Storage Used</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {storageMB} <span className="text-sm font-semibold text-slate-400">MB</span>
            </h2>
          </div>
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform">
            💾
          </div>
        </div>
      </div>

    </div>
  );
}

export default DashboardStats;