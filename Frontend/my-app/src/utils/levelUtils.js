// Calculate level based on points
export const getLevel = (points) => {
  if (points >= 1000) return { level: 5, title: "Impact Champion", color: "from-yellow-400 to-orange-500" };
  if (points >= 500) return { level: 4, title: "Community Leader", color: "from-purple-400 to-pink-500" };
  if (points >= 200) return { level: 3, title: "Active Contributor", color: "from-blue-400 to-purple-500" };
  if (points >= 50) return { level: 2, title: "Rising Star", color: "from-green-400 to-blue-500" };
  return { level: 1, title: "New Member", color: "from-gray-400 to-gray-500" };
};

// Get achievement data
export const getAchievements = (posts, registeredEvents, followersList, points) => [
  { 
    title: "First Post", 
    description: "Share your first post", 
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", 
    unlocked: posts.length > 0, 
    points: 10 
  },
  { 
    title: "Event Explorer", 
    description: "Register for your first event", 
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", 
    unlocked: registeredEvents.length > 0, 
    points: 25 
  },
  { 
    title: "Community Builder", 
    description: "Reach 10 followers", 
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", 
    unlocked: followersList.length >= 10, 
    points: 50 
  },
  { 
    title: "Impact Maker", 
    description: "Earn 100 points", 
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", 
    unlocked: points >= 100, 
    points: 100 
  },
];