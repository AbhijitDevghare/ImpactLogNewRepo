import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  registerEvent,
  fetchUpcomingEvents,
} from "../redux/slices/EventSlice";
import EventCard from "../components/EventCard";
import EventDetailed from "../components/EventDetailed";
import MainLayout from "../layout/MainLayout";

export default function EventPage() {
  const dispatch = useDispatch();
  const { events = [], loading = false, error = null, upcomingEvents = [] } =
  useSelector((state) => state.event || {});
  const { data: user } = useSelector((state) => state?.auth);

  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchEvents());
    if (user?.id) {
      dispatch(fetchUpcomingEvents(user.id));
    }
  }, [dispatch, user?.id]);

  const handleRegister = (ev) => {
    if (!user?.id) {
      alert("Please log in to register.");
      return;
    }
    dispatch(registerEvent({ eventId: ev.id, userId: user.id }));
  };

  const handleViewDetails = (ev) => setSelected(ev);
  const handleBack = () => setSelected(null);

      const filteredEvents = (events || []).filter((event) => {
      const matchesSearch =
      event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === "published").length;
  const upcomingCount = events.filter(
    (e) => new Date(e.scheduled_date) > new Date()
  ).length;

  return (
    <MainLayout>
      {/* Loading */}
      {loading && (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-purple-900/20 via-gray-900/90 to-indigo-900/20 rounded-3xl shadow-2xl border border-gray-700/60 p-12 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-purple-900/50 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-700/50 rounded-lg mx-auto w-64 mb-2"></div>
              <div className="h-4 bg-gray-700/30 rounded mx-auto w-96"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl border border-gray-700/60 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-700/50"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-700/50 rounded-lg"></div>
                  <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700/30 rounded w-1/2"></div>
                  <div className="flex gap-3 pt-4">
                    <div className="h-10 bg-gray-700/50 rounded-xl flex-1"></div>
                    <div className="h-10 bg-gray-700/30 rounded-xl w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-gradient-to-br from-red-900/20 via-gray-900/90 to-red-900/20 rounded-3xl shadow-2xl border border-red-700/60 p-12 text-center">
          <div className="w-16 h-16 bg-red-900/50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchEvents())}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      )}

      {/* List View */}
      {!loading && !error && !selected && (
        <div className="space-y-8">
          {/* Hero Section - ONE AND ONLY */}
          <div className="relative bg-gradient-to-br from-purple-900/20 via-gray-900/90 to-indigo-900/20 rounded-3xl shadow-2xl border border-gray-700/60 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-indigo-900/10"></div>
            <div className="relative p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">Discover Amazing Events</h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join our community in making a positive impact. Explore upcoming events, earn points, and contribute to meaningful causes.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6">
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-3xl font-bold text-purple-300 mb-2">{totalEvents}</div>
                  <div className="text-sm text-gray-400">Total Events</div>
                </div>
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-3xl font-bold text-emerald-300 mb-2">{publishedEvents}</div>
                  <div className="text-sm text-gray-400">Published</div>
                </div>
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-3xl font-bold text-blue-300 mb-2">{upcomingCount}</div>
                  <div className="text-sm text-gray-400">Upcoming</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-700/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Events</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl border border-gray-700/60 p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchTerm ? "No events found" : "No events available"}
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search terms or filters."
                  : "Check back soon for new events!"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {searchTerm
                    ? `Found ${filteredEvents.length} event${filteredEvents.length !== 1 ? "s" : ""}`
                    : "All Events"}
                </h2>
                <span className="text-gray-400 text-sm">
                  {filteredEvents.length} of {totalEvents} events
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={{
                      ...ev,
                      isRegistered: upcomingEvents?.some((ue) => ue.id === ev.id),
                    }}
                    onRegister={handleRegister}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Detail View */}
      {!loading && !error && selected && (
        <EventDetailed
          event={selected}
          onBack={handleBack}
          onRegister={handleRegister}
        />
      )}
    </MainLayout>
  );
}