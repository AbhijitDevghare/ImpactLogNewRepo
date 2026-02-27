// src/pages/ViewProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  followUser,
  unfollowUser,
} from "../redux/slices/AuthSlice";
import {
  fetchUserPoints,
  fetchUserBadges,
} from "../redux/slices/RewardsBadgesSlice";
import { fetchUserPosts } from "../redux/slices/PostSlice";
import {
  fetchUpcomingEvents,
  fetchAttendedEvents,
} from "../redux/slices/EventSlice";

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
import AchievementsTab from "../components/Profile/tabs/AchievementsTab";
import { getLevel } from "../utils/levelUtils";

export default function ViewProfile() {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state?.auth?.data ?? null);
  const viewedUser = useSelector((state) => state?.auth?.viewedUser ?? null);
  const posts = useSelector((state) => state?.posts?.userPosts ?? []);

  const userPoints = useSelector(
    (state) => state?.rewardsBadges?.userPoints ?? []
  );
  const points = Array.isArray(userPoints)
    ? userPoints.reduce((sum, p) => sum + p.points, 0)
    : 0;

  const badges = useSelector((state) => state?.rewardsBadges?.userBadges ?? []);
  const registeredEvents = useSelector(
    (state) => state?.event?.upcomingEvents ?? []
  );
  const attendedEvents = useSelector(
    (state) => state?.event?.attendedEvents ?? []
  );

  const followersList = viewedUser?.followers?.followers ?? [];
  const followingList = viewedUser?.following?.following ?? [];

  const [activeTab, setActiveTab] = useState("overview");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Check if current user is following the viewed profile
  useEffect(() => {
    if (currentUser && viewedUser) {
      const following = currentUser.following?.following || [];
      setIsFollowing(following.some((f) => f.id === viewedUser.id));
    }
  }, [currentUser, viewedUser]);

  // Fetch viewed user data
  useEffect(() => {
    if (userId) dispatch(fetchUserProfile(userId));
  }, [dispatch, userId]);

  // Fetch related data for viewed user
  useEffect(() => {
    if (viewedUser?.id) {
      dispatch(fetchUserPosts(viewedUser.id));
      dispatch(fetchUserPoints(viewedUser.id));
      dispatch(fetchUserBadges(viewedUser.id));
      dispatch(fetchUpcomingEvents(viewedUser.id));
      dispatch(fetchAttendedEvents(viewedUser.id));
    }
  }, [dispatch, viewedUser?.id]);

  const handleFollowToggle = async () => {
    if (!currentUser || !viewedUser) return;
    setIsLoadingFollow(true);
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(viewedUser.id));
        setIsFollowing(false);
      } else {
        await dispatch(followUser(viewedUser.id));
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  if (!viewedUser) {
    return (
      <MainLayout>
        <ProfileLoadingSkeleton />
      </MainLayout>
    );
  }

  const userLevel = getLevel(points);

  const handleFollowersClick = () => setModalType("followers");
  const handleFollowingClick = () => setModalType("following");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            posts={posts}
            registeredEvents={registeredEvents}
            points={points}
            userLevel={userLevel}
            isOwnProfile={false}
          />
        );
      case "posts":
        return <PostsTab posts={posts} isOwnProfile={false} />;
      case "events":
        return (
          <EventsTab
            registeredEvents={registeredEvents}
            attendedEvents={attendedEvents}
            isOwnProfile={false}
          />
        );
      case "badges":
        return (
          <BadgesTab badges={badges} points={points} isOwnProfile={false} />
        );
      case "achievements":
        return (
          <AchievementsTab
            posts={posts}
            registeredEvents={registeredEvents}
            followersList={followersList}
            points={points}
            userLevel={userLevel}
          />
        );
      default:
        return (
          <OverviewTab
            posts={posts}
            registeredEvents={registeredEvents}
            points={points}
            userLevel={userLevel}
            isOwnProfile={false}
          />
        );
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <ProfileHeader
          user={viewedUser}
          userLevel={userLevel}
          isOwnProfile={false}
          isFollowing={isFollowing}
          isLoadingFollow={isLoadingFollow}
          onFollowToggle={handleFollowToggle}
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
          extraTabs={[{ key: "achievements", label: "Achievements" }]}
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
