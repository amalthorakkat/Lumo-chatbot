import React, { useEffect } from "react";
import { Trash2 } from "lucide-react";

const DeleteChatModal = ({ onConfirm, onCancel }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-gray-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">
            Delete Chat Session
          </h2>
          <p className="text-sm text-slate-600 text-center">
            Are you sure you want to delete this chat session? This action
            cannot be undone.
          </p>
          <div className="flex w-full gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2 bg-white border border-gray-300 text-slate-800 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;
