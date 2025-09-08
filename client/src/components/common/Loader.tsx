import React from 'react';

function Loader() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
    </div>
  );
}

export default Loader;
