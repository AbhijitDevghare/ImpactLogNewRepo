import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import {
  getCommunities,
  followUser,
  unfollowUser,
} from "../redux/slices/AuthSlice";

function CommunityPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { communities, loading, data: currentUser } = useSelector(
    (state) => state.auth
  );

  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Sync followed users with Redux store
  useEffect(() => {
    if (
      currentUser?.following?.following &&
      Array.isArray(currentUser.following.following)
    ) {
      const followingIds = currentUser.following.following.map(
        (f) => f.id || f
      );
      setFollowedUsers(new Set(followingIds));
    }
  }, [currentUser?.following?.following]);

  // ✅ Fetch communities
  useEffect(() => {
    dispatch(getCommunities());
  }, [dispatch]);

  // ✅ Search filter
  const filteredCommunities = useMemo(() => {
    if (!communities) return [];
    return communities.filter((community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [communities, searchTerm]);

  // ✅ Follow/Unfollow handler
  const handleFollow = (userId) => {
    if (followedUsers.has(userId)) {
      dispatch(unfollowUser(userId));
    } else {
      dispatch(followUser(userId));
    }

    setFollowedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // ✅ Navigate to profile
  const handleProfileClick = (userId) => {
    navigate(`/viewprofile/${userId}`);
  };

  // ✅ Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/60 animate-pulse">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-700 rounded mb-4 mx-auto w-24"></div>
      <div className="flex justify-center">
        <div className="w-20 h-8 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Discover Communities
            </h1>
            <p className="text-gray-300 text-lg">
              Connect with amazing people and organizations
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-600 rounded-full px-4 py-3 pl-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Community Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              filteredCommunities.map((community) => (
                <div
                  key={community.id}
                  onClick={() => handleProfileClick(community.id)}
                  className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/60 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl group"
                >
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={community.avatarUrl}
                        alt={community.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-600 group-hover:border-purple-400 transition-colors duration-300"
                      />
                      <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-400/50 animate-ping"></div>
                    </div>
                  </div>

                  {/* Name + Role */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-white mb-1 truncate">
                      {community.name}
                    </h3>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        community.role === "GOVERNMENT"
                          ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                          : "bg-green-600/20 text-green-300 border border-green-500/30"
                      }`}
                    >
                      {community.role}
                    </span>
                  </div>

                  {/* Follow / Following Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollow(community.id);
                      }}
                      className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                        followedUsers.has(community.id)
                          ? "bg-gray-600 text-white hover:bg-gray-500 shadow-lg"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/25"
                      }`}
                    >
                      {followedUsers.has(community.id) ? (
                        <>
                          <svg
                            className="w-4 h-4 inline mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Following
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 inline mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Empty State */}
          {!loading && filteredCommunities.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              <div className="text-gray-400 text-xl mb-2">
                {searchTerm
                  ? "No communities found matching your search"
                  : "No communities found"}
              </div>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Check back later for new communities"}
              </p>
            </div>
          )}
        </div>
      </MainLayout>
    </div>
  );
}

export default CommunityPage;
