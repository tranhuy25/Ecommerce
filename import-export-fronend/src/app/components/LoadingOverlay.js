// components/LoadingOverlay.jsx
import React from 'react';

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="w-12 h-12 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
  </div>
);

export default LoadingOverlay;
