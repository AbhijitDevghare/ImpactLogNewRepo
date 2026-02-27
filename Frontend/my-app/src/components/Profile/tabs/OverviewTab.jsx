import React from "react";

export default function OverviewTab({ posts, registeredEvents, points, isOwnProfile = false }) {
  const progressTitle = isOwnProfile ? "Your Progress" : "Their Progress";

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Recent Activity
        </h3>
        <div className="space-y-4">
          {posts.slice(0, 3).map((post, i) => (
            <div key={post.id} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Posted new content</p>
                <p className="text-gray-400 text-sm">{new Date(post.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {registeredEvents.slice(0, 2).map((event, i) => (
            <div key={event.id} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Registered for event</p>
                <p className="text-gray-400 text-sm">{event.title || "Event"}</p>
              </div>
            </div>
          ))}
          {posts.length === 0 && registeredEvents.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-400">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}