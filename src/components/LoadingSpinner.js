import React from 'react';
import { Loader } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader className="mx-auto animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-xl text-gray-700">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader className="animate-spin text-blue-600 mr-2" size={20} />
      <span className="text-gray-700">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
