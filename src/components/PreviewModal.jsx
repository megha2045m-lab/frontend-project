import { API_URL } from "../config";

function PreviewModal({ file, onClose }) {
  if (!file) return null;

  const previewUrl = `${API_URL}/preview/${file._id}`;

  const isImage = file.fileType.startsWith("image/");
  const isPDF = file.fileType === "application/pdf";

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-4xl p-6 relative flex flex-col max-h-[90vh] overflow-hidden">

        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 pr-10">
          <h2 className="text-base font-bold text-slate-800 truncate" title={file.originalName}>
            {file.originalName}
          </h2>
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-semibold hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl overflow-y-auto p-4 min-h-[300px]">

          {isImage ? (
            <img
              src={previewUrl}
              alt={file.originalName}
              className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-md border border-slate-200/50 bg-white"
            />
          ) : isPDF ? (
            <iframe
              src={previewUrl}
              title="Preview"
              className="w-full h-[60vh] border border-slate-200/50 rounded-xl shadow-sm bg-white"
            />
          ) : (
            <div className="text-center py-12 px-6 flex flex-col items-center">
              <div className="w-20 h-20 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-4xl mb-4">
                📄
              </div>

              <p className="text-base font-bold text-slate-700">
                Preview isn't available for this file type
              </p>
              
              <p className="text-xs text-slate-400 mt-1">
                You can download the file to view it on your local device.
              </p>

              <a
                href={`${API_URL}/download/${file._id}`}
                className="inline-flex mt-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-md shadow-blue-500/10"
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