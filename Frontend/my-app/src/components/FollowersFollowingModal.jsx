import React from "react";
import { Link } from "react-router-dom";

const FollowersFollowingModal = ({
  isOpen,
  onClose,
  type,
  followers = [],
  following = [],
}) => {
  if (!isOpen) return null;

  const data = type === "followers" ? followers : following;
  const title = type === "followers" ? "Followers" : "Following";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center z-50 p-4">
      <div
        className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-2xl shadow-2xl border border-gray-700/60 w-full max-w-md max-h-[80vh] overflow-hidden transition-all duration-300 animate-slideDown"
        style={{ marginTop: "0px" }} // adjust between 100–300px if needed
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h3 className="text-xl font-bold text-white">
            {title} ({data.length})
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {data.length > 0 ? (
            <div className="p-4 space-y-3">
              {data.map((user, index) => (
                <div
                  key={user.id || index}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <img
                    src={user.avatarUrl || "https://i.pravatar.cc/150?img=65"}
                    alt={user.name || "User"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">
                      {user.name || "Anonymous"}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {user.bio || "No bio available"}
                    </p>
                  </div>
                  <Link
                    to={`/viewprofile/${user.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                No {title.toLowerCase()}
              </h4>
              <p className="text-gray-400">
                {type === "followers"
                  ? "No followers yet. Share your profile to get started!"
                  : "Not following anyone yet. Discover and connect with others!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersFollowingModal;
