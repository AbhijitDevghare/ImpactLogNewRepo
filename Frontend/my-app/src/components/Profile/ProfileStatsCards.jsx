import React from "react";

export default function ProfileStatsCards({ 
  posts = [], 
  followersList = [], 
  followingList = [], 
  points = 0, 
  badges = [], 
  onFollowersClick = null, 
  onFollowingClick = null,
  showFollowingCard = true 
}) {
  const statsData = [
    {
      label: "Posts",
      value: posts.length,
      color: "purple",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    },
    {
      label: "Followers",
      value: followersList.length,
      color: "blue",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
      onClick: onFollowersClick,
      clickable: true
    },
    ...(showFollowingCard ? [{
      label: "Following",
      value: followingList.length,
      color: "green",
      icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
      onClick: onFollowingClick,
      clickable: true
    }] : []),
    {
      label: "Points",
      value: points,
      color: "emerald",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    },
    {
      label: "Badges",
      value: badges.length,
      color: "orange",
      icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      purple: "from-purple-900/20 to-purple-800/20 border-purple-700/30 hover:border-purple-500/50 bg-purple-900/50 text-purple-300",
      blue: "from-blue-900/20 to-blue-800/20 border-blue-700/30 hover:border-blue-500/50 bg-blue-900/50 text-blue-300",
      green: "from-green-900/20 to-green-800/20 border-green-700/30 hover:border-green-500/50 bg-green-900/50 text-green-300",
      emerald: "from-emerald-900/20 to-emerald-800/20 border-emerald-700/30 hover:border-emerald-500/50 bg-emerald-900/50 text-emerald-300",
      orange: "from-orange-900/20 to-orange-800/20 border-orange-700/30 hover:border-orange-500/50 bg-orange-900/50 text-orange-300"
    };
    return colorMap[color] || colorMap.purple;
  };

  const gridCols = showFollowingCard ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {statsData.map((stat, index) => {
        const colorClasses = getColorClasses(stat.color);
        const [bgGradient, borderClasses, iconBg, textColor] = colorClasses.split(' ');
        
        const handleClick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (stat.onClick) {
            stat.onClick();
          }
        };

        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-6 border ${borderClasses} transition-all duration-300 transform hover:scale-105 ${
              stat.clickable ? 'cursor-pointer hover:shadow-lg' : ''
            }`}
            onClick={handleClick}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
                <svg className={`w-4 h-4 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <span className={`text-sm ${textColor} font-medium`}>{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}