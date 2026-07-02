import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/files";

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
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        🕒 Recent Uploads
      </h2>

      {files.length === 0 ? (
        <p className="text-gray-500">
          No recent uploads.
        </p>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file._id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-semibold">
                  {file.originalName}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(file.createdAt).toLocaleString()}
                </p>
              </div>

              <span className="text-blue-600 font-semibold">
                {(file.fileSize / 1024).toFixed(2)} KB
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default RecentFiles;