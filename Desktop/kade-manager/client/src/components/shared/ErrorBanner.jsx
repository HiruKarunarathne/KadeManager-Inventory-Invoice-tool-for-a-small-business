import React from 'react';

export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="rounded-lg bg-red-50 p-4 border border-red-200 mb-4 animate-fade-in">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-red-500 font-bold mr-3">⚠️</div>
        <div className="flex-1 text-sm text-red-700 font-medium">{message}</div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100 inline-flex items-center justify-center h-8 w-8"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
