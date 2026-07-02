function PreviewModal({ file, onClose }) {
  if (!file) return null;

  const previewUrl = `http://localhost:5000/api/files/preview/${file._id}`;

  const isImage = file.fileType.startsWith("image/");
  const isPDF = file.fileType === "application/pdf";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-5xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {file.originalName}
        </h2>

        <div className="flex justify-center">

          {isImage ? (
            <img
              src={previewUrl}
              alt={file.originalName}
              className="max-h-[70vh] rounded-lg"
            />
          ) : isPDF ? (
            <iframe
              src={previewUrl}
              title="Preview"
              className="w-full h-[70vh] rounded-lg"
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-7xl mb-4">📄</div>

              <p className="text-xl font-semibold">
                Preview isn't available for this file type.
              </p>

              <a
                href={`http://localhost:5000/api/files/download/${file._id}`}
                className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Download File
              </a>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default PreviewModal;