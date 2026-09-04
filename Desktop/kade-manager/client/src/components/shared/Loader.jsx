import React from 'react';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
}
