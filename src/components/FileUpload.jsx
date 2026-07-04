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
    <div className="bg-white rounded-xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        Upload New File
      </h2>

      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
        ${
          dragActive
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300"
        }`}
      >
        <div className="text-6xl mb-4">
          📁
        </div>

        <p className="text-lg font-semibold">
          Drag & Drop files here
        </p>

        <p className="text-gray-500 mt-2">
          or click anywhere to browse
        </p>

        <input
          ref={inputRef}
          type="file"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {selectedFile && (
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <p className="font-semibold">
            Selected File
          </p>

          <p className="text-blue-600 mt-1">
            {selectedFile.name}
          </p>

          <p className="text-sm text-gray-500">
            {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {uploading && (
        <div className="mt-6">

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>

          </div>

          <p className="mt-2 text-center font-semibold">
            Uploading... {progress}%
          </p>

        </div>
      )}

      <button
        onClick={uploadFile}
        disabled={uploading}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>

    </div>
  );
}

export default FileUpload;