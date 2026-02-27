import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import isCommunityOrOrg from "../helpers/isCommunityOrOrg";

export default function Create() {
  const { role } = useSelector((state) => state?.auth);
  const isCommunityOrg = role && isCommunityOrOrg(role);

  const normalUserOptions = [
    {
      title: "Create a Post",
      description: "Share your thoughts and connect with the community",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      link: "/create-post",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Register for Events",
      description: "Discover and join upcoming community events",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      link: "/events",
      color: "from-green-500 to-green-600"
    }
  ];

  const communityOrgOptions = [
    {
      title: "Create an Event",
      description: "Organize and create new community events",
      icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
      link: "/create-events",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Publish Events",
      description: "Make your events visible to the community",
      icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10",
      link: "/publish-events",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "View Published Events",
      description: "Manage and track your published events",
      icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      link: "/published-events",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "View Past Events",
      description: "Review and manage your past events",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      link: "/past-events",
      color: "from-teal-500 to-teal-600"
    },
    {
      title: "View Completed Events",
      description: "Assign rewards to participants of completed events",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      link: "/completed-events",
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  const options = isCommunityOrg ? communityOrgOptions : normalUserOptions;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-4xl font-bold text-white mb-4">
          {isCommunityOrg ? "Community Dashboard" : "Create & Connect"}
        </h1>
        <p className="text-gray-300 text-lg">
          {isCommunityOrg
            ? "Manage your community events and engage with members"
            : "Share your ideas and discover amazing community events"}
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {options.map((option, index) => (
          <Link key={index} to={option.link} className="group">
            <div className="bg-gray-800/80 backdrop-blur border border-gray-700/60 rounded-2xl shadow-xl p-6 hover:border-gray-500/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              {/* Icon */}
              <div
                className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors duration-300">
                {option.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {option.description}
              </p>

              {/* Arrow */}
              <div className="mt-4 flex items-center text-gray-400 group-hover:text-white transition-colors duration-300">
                <span className="text-sm font-medium">Get Started</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center animate-fadeIn">
        <div className="bg-gray-800/80 backdrop-blur border border-gray-700/60 rounded-2xl p-6 shadow-md">
          <h4 className="text-lg font-semibold text-white mb-2">
            {isCommunityOrg ? "Community Impact" : "Community Guidelines"}
          </h4>
          <p className="text-gray-400">
            {isCommunityOrg
              ? "Your events help build stronger communities and create meaningful connections."
              : "Remember to follow our community guidelines when creating posts and participating in events."}
          </p>
        </div>
      </div>
    </div>
  );
}
