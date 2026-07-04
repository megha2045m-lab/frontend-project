import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      toast.warning("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      setProgress(0);

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

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-8">

      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Upload Files
      </h2>

      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center
        ${
          dragActive
            ? "border-blue-500 bg-blue-50/40"
            : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
        }`}
      >
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-3 border border-slate-100">
          📤
        </div>

        <p className="text-sm font-semibold text-slate-700">
          Drag & Drop file here, or click to browse
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Supports any image, document, video, or audio file
        </p>

        <input
          ref={inputRef}
          type="file"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {selectedFile && (
        <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="text-2xl flex-shrink-0">📄</div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-700 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedFile(null)}
            className="text-slate-400 hover:text-red-500 text-sm font-semibold p-1"
          >
            Clear
          </button>
        </div>
      )}

      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
            <span>Uploading file...</span>
            <span className="text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-5">
        {selectedFile && (
          <button
            onClick={uploadFile}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 active:scale-[0.98] shadow-md shadow-blue-500/10 cursor-pointer"
          >
            {uploading ? "Uploading..." : "Start Upload"}
          </button>
        )}
      </div>

    </div>
  );
}

export default FileUpload;