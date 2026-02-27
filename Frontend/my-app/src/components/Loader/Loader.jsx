import React from 'react';

const Loader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center animate-fade-in">
      <div className="bg-gray-800 bg-opacity-20 backdrop-blur-md rounded-lg p-8 shadow-lg border border-gray-700 border-opacity-30">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin shadow-lg shadow-purple-500/20"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-ping opacity-20"></div>
          </div>
          <p className="text-gray-300 text-lg font-light">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;