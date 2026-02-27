import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

import HomeLogo from "../assets/icons/icons8-home-24.svg";
import MyProfileLogo from "../assets/icons/profile.svg";
import ChatsLogo from "../assets/icons/icons8-chats.svg";
import CommunityLogo from "../assets/icons/icons8-community.svg";
import UpcomingEventsLogo from "../assets/icons/icons8-events.svg";
import PastEventsLogo from "../assets/icons/icons8-facebook-like-64.png";
import LatestPostLogo from "../assets/icons/previous-time.svg";
import AchievementsLogo from "../assets/icons/icons8-star-50.png";
import HelpCenterLogo from "../assets/icons/icons8-help.svg";
import SignOutLogo from "../assets/icons/icons8-log-out.svg";
import HighlightStory from "../assets/icons/instagram-highlight-story.svg";
import LocalEventsLogo from "../assets/icons/calendar.svg";
import newEventAdd from "../assets/icons/icons8-create.svg";

import { logout } from "../redux/slices/AuthSlice";
import isCommunityOrOrg from "../helpers/isCommunityOrOrg";

function HomeSideBar({ onNavigate }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { role,data } = useSelector((state) => state?.auth);
  const isCommunity = useMemo(() => isCommunityOrOrg(role), [role]);



  const onSignout = async () => {
    const res = await dispatch(logout());
    if (res.payload?.success) {
      navigate("/");
      if (typeof onNavigate === "function") onNavigate();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="flex flex-col justify-between w-full h-full">
      {/* Top Nav */}
      <nav>
        <ul className="space-y-2 text-gray-300">
          {/* Home */}
          <Link to="/app">
            <li
              onClick={onNavigate}
              className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
                ${isActive('/app')
                  ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-200 border-l-4 border-purple-400'
                  : 'hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-indigo-900/40 hover:text-purple-300'
                }`}
            >
              <img src={HomeLogo} alt="Home Feed" className="h-6 w-6" />
              <span className="font-medium">Home</span>
            </li>
          </Link>

          {/* Profile */}
<Link to={`/profile/${data.id}`}>
            <li
              onClick={onNavigate}
              className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
                ${isActive('/profile')
                  ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-200 border-l-4 border-purple-400'
                  : 'hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-indigo-900/40 hover:text-purple-300'
                }`}
            >
              <img src={MyProfileLogo} alt="My Profile" className="h-6 w-6" />
              <span className="font-medium">My Profile</span>
            </li>
          </Link>

          {/* Create Events (only community/org) */}
          {isCommunity && (
            <Link to="/create">
              <li
                onClick={onNavigate}
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
                  ${isActive('/create-events')
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-200 border-l-4 border-purple-400'
                    : 'hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-indigo-900/40 hover:text-purple-300'
                  }`}
              >
                <img src={newEventAdd} alt="Create Events" className="h-6 w-6" />
                <span className="font-medium">Create</span>
              </li>
            </Link>
          )}

          {/* Events */}
          <Link to="/events">
            <li
              onClick={onNavigate}
              className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
                ${isActive('/events')
                  ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-200 border-l-4 border-purple-400'
                  : 'hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-indigo-900/40 hover:text-purple-300'
                }`}
            >
              <img src={UpcomingEventsLogo} alt="Upcoming Events" className="h-6 w-6" />
              <span className="font-medium">Events</span>
            </li>
          </Link>

          {/* Community */}
          <Link to={"/communities"}>
          
                <li
            onClick={onNavigate}
            className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
              ${isActive('/community')
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-200 border-l-4 border-purple-400'
                : 'hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-indigo-900/40 hover:text-purple-300'
              }`}
          >
            <img src={CommunityLogo} alt="Community" className="h-6 w-6" />
            <span className="font-medium">Community</span>
          </li>

          </Link>

          {/* Chats */}
              <Link to={"/chats"}>
                <li
                  onClick={onNavigate}
                  className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
                    ${isActive('/chats')
                      ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-200 border-l-4 border-purple-400'
                      : 'hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-indigo-900/40 hover:text-purple-300'
                    }`}
                >
                  <img src={ChatsLogo} alt="Chats" className="h-6 w-6" />
                  <span className="font-medium">Chats</span>
                </li>
              </Link>
        </ul>
      </nav>

      {/* Bottom Nav */}
      <div className="space-y-2">
        {/* Help */}
              
          <Link to={"/help"}>
              <li
          onClick={onNavigate}
          className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-indigo-900/40 hover:text-purple-300"
        >
          <img src={HelpCenterLogo} alt="Help Center" className="h-6 w-6" />
          <span className="font-medium">Help</span>
        </li>
          </Link>
        {/* Sign Out */}
        <li
          onClick={onSignout}
          className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-indigo-900/40 hover:text-purple-300"
        >
          <img src={SignOutLogo} alt="Sign Out" className="h-6 w-6" />
          <span className="font-medium">Sign Out</span>
        </li>

        <div className="text-xs text-gray-500 text-center mt-4">
          © 2025 ImpactLog
        </div>
      </div>
    </aside>
  );
}

export default HomeSideBar;