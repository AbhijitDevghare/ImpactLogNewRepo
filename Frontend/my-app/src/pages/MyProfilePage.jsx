// src/pages/MyProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/slices/AuthSlice";
import { fetchUserPoints, fetchUserBadges } from "../redux/slices/RewardsBadgesSlice";
import { fetchUserPosts } from "../redux/slices/PostSlice";
import { fetchUpcomingEvents, fetchAttendedEvents, fetchUserAttendance } from "../redux/slices/EventSlice";
import MainLayout from "../layout/MainLayout";
import FollowersFollowingModal from "../components/FollowersFollowingModal";
import ProfileLoadingSkeleton from "../components/Profile/ProfileLoadingSkeleton";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileStatsCards from "../components/Profile/ProfileStatsCards";
import ProfileTabs from "../components/Profile/ProfileTabs";
import OverviewTab from "../components/Profile/tabs/OverviewTab";
import PostsTab from "../components/Profile/tabs/PostsTab";
import EventsTab from "../components/Profile/tabs/EventsTab";
import BadgesTab from "../components/Profile/tabs/BadgesTab";

export default function MyProfilePage() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.auth?.data ?? null);
  const posts = useSelector((state) => state?.posts?.userPosts ?? []);
  const userPoints = useSelector((state) => state?.rewardsBadges?.userPoints ?? []);
  const points = Array.isArray(userPoints) ? userPoints.reduce((sum, p) => sum + p.points, 0) : 0;
  const badges = useSelector((state) => state?.rewardsBadges?.userBadges ?? []);

  const registeredEvents = useSelector((state) => state?.event?.upcomingEvents ?? []);
  const attendedEvents = useSelector((state) => state?.event?.attendedEvents ?? []);
  const userAttendance = useSelector((state) => state?.event?.userAttendance ?? []);
  const eventLoading = useSelector((state) => state?.event?.loading ?? false);
  const eventError = useSelector((state) => state?.event?.error ?? null);

  // Filter userAttendance to only include attended events
  const filteredAttendedEvents = userAttendance.filter(item => item.attendance?.checkinTime);

  const followersList = user?.followers?.followers ?? [];
  const followingList = user?.following?.following ?? [];

  const [modalType, setModalType] = useState(null);
  const [activeTab, setActiveTab] = useState("posts"); // tabs: overview | posts | events | badges

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserPosts(user.id));
      dispatch(fetchUserPoints(user.id));
      dispatch(fetchUserBadges(user.id));
      dispatch(fetchUpcomingEvents(user.id));
      dispatch(fetchAttendedEvents(user.id));
      dispatch(fetchUserAttendance(user.id));
    }
  }, [dispatch, user?.id]);

  if (!user) {
    return (
      <MainLayout>
        <ProfileLoadingSkeleton />
      </MainLayout>
    );
  }

  const handleFollowersClick = () => setModalType("followers");
  const handleFollowingClick = () => setModalType("following");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab posts={posts} registeredEvents={registeredEvents} points={points} isOwnProfile={true} />;
      case "posts":
        return <PostsTab posts={posts} isOwnProfile={true} />;
      case "events":
        return <EventsTab registeredEvents={registeredEvents} attendedEvents={filteredAttendedEvents} isOwnProfile={true} isLoadingAttended={eventLoading && userAttendance.length === 0} />;
      case "badges":
        return <BadgesTab badges={badges} points={points} isOwnProfile={true} />;
      default:
        return <OverviewTab posts={posts} registeredEvents={registeredEvents} points={points} isOwnProfile={true} />;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <ProfileHeader 
          user={user} 
          isOwnProfile={true}
        />

        <ProfileStatsCards 
          posts={posts}
          followersList={followersList}
          followingList={followingList}
          points={points}
          badges={badges}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
          showFollowingCard={true}
        />

        <ProfileTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {renderTabContent()}

        {modalType && (
          <FollowersFollowingModal
            isOpen={true}
            onClose={() => setModalType(null)}
            type={modalType}
            followers={followersList}
            following={followingList}
          />
        )}
      </div>
    </MainLayout>
  );
}

