import React from "react";

export default function ProfileLoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-8">
        {/* Loading Hero */}
        <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl border border-gray-700/60 overflow-hidden">
          <div className="h-64 bg-gray-700/50"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 bg-gray-600/50 rounded-full border-4 border-gray-800"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-600/50 rounded-lg w-64"></div>
                <div className="h-4 bg-gray-600/30 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800/60 rounded-2xl p-6 animate-pulse">
              <div className="h-8 bg-gray-700/50 rounded mb-2"></div>
              <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}