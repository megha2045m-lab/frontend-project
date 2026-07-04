import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL as API } from "../config";

function RecentFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchRecentFiles();
  }, []);

  const fetchRecentFiles = async () => {
    try {
      const res = await axios.get(API);

      const recent = res.data
        .filter(file => !file.isDeleted)
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);

      setFiles(recent);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mt-8">

      <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
        <span>🕒</span>
        <span>Recent Uploads</span>
      </h2>

      {files.length === 0 ? (
        <p className="text-sm text-slate-400 font-medium">
          No recent uploads.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {files.map((file) => (
            <div
              key={file._id}
              className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 hover:bg-slate-50/50 transition-all rounded-lg px-2 -mx-2"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-xl">📄</span>
                <div className="overflow-hidden">
                  <p className="font-semibold text-slate-700 text-sm truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(file.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex-shrink-0">
                {(file.fileSize / 1024).toFixed(1)} KB
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default RecentFiles;