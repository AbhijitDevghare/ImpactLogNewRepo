import React from "react";

export default function BadgesTab({ badges, points, isOwnProfile = false }) {
  const title = isOwnProfile ? "Your Badges" : "Their Badges";
  const emptyMessage = isOwnProfile 
    ? "Complete events and earn points to unlock your first badge!"
    : "This user hasn't earned any badges yet.";

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-900/50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          {title} ({badges.length})
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-yellow-300">{points}</p>
          <p className="text-sm text-gray-400">Total Points</p>
        </div>
      </div>

      {badges?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <div key={i} className="p-4 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl border border-yellow-700/30 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold mb-1">{badge.badge?.name || badge.name}</h4>
                <p className="text-yellow-300 text-sm mb-2">{badge.badge?.tier || 'Tier'}</p>
                {/* <p className="text-gray-400 text-xs mb-2">{badge.badge?.description || 'Description'}</p> */}
                <p className="text-gray-500 text-xs">Awarded: {new Date(badge.awardedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-700/50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-white mb-2">No badges yet</h4>
          <p className="text-gray-400 mb-6">{emptyMessage}</p>
          {isOwnProfile && (
            <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-300 font-medium">💡 Tip: Register for events to start earning points!</p>
            </div>
          )}
          {!isOwnProfile && (
            <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-300 font-medium">💡 Badges are earned by completing events and reaching milestones!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}