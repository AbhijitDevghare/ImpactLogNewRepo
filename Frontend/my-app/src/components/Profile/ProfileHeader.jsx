import React, { useState } from "react";

export default function ProfileHeader({ 
  user, 
  isOwnProfile = false, 
  isFollowing = false, 
  isLoadingFollow = false, 
  onFollowToggle = null 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative bg-gradient-to-br from-purple-900/20 via-gray-900/90 to-indigo-900/20 rounded-3xl shadow-2xl border border-gray-700/60 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-indigo-900/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
        {/* Decorative elements */}
        <div className="absolute top-8 left-8 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-16 right-16 w-16 h-16 bg-purple-400/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-12 left-1/3 w-12 h-12 bg-indigo-400/20 rounded-full blur-md"></div>
      </div>

      {/* Profile Info Overlay */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-end gap-6">
          {/* Avatar with Level Badge */}
          <div className="relative">
            <button onClick={() => setIsModalOpen(true)}>
              <img
                src={user.avatarUrl || "https://i.pravatar.cc/150?img=65"}
                alt={user.name || "User"}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-800 shadow-2xl cursor-pointer hover:opacity-80 transition-opacity"
              />
            </button>
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-bold">{user.name || "Anonymous"}</h1>
              </div>
              
              {/* Action Button */}
              {isOwnProfile ? (
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Edit Profile
                </button>
              ) : onFollowToggle && (
                <button
                  onClick={onFollowToggle}
                  disabled={isLoadingFollow}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isFollowing
                      ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
                  }`}
                >
                  {isLoadingFollow ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : isFollowing ? (
                    "Unfollow"
                  ) : (
                    "Follow"
                  )}
                </button>
              )}
            </div>

            {/* Bio */}
            <p className="text-gray-300 text-lg max-w-2xl">
              {user.bio || "Making a positive impact in our community 🌱"}
            </p>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-lg max-h-[90vh] p-4 overflow-hidden">
            <img
              src={user.avatarUrl || "https://i.pravatar.cc/150?img=65"}
              alt={user.name || "User"}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 w-10 h-10 bg-gray-800 bg-opacity-75 text-white rounded-full flex items-center justify-center hover:bg-opacity-100 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}