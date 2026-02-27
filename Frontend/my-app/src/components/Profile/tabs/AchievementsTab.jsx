import React from "react";
import { getAchievements } from "../../../utils/levelUtils";

export default function AchievementsTab({ posts, registeredEvents, followersList, points, userLevel }) {
  const achievements = getAchievements(posts, registeredEvents, followersList, points);

  return (
    <div className="space-y-6">
      {/* Simple Points Display */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Total Points</h3>
        <div className="text-4xl font-bold text-yellow-300">{points}</div>
      </div>
    </div>
  );
}