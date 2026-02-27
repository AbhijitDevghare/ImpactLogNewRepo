import React, { useEffect, useMemo } from "react";
import { fetchUserProfile } from "../redux/slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

function fmtDateTime(value) {
  if (!value) return "TBD";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleString();
}

function fmtDate(value) {
  if (!value) return "TBD";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString();
}

export default function EventDetailed({ event, onBack, onRegister }) {
  const dispatch = useDispatch();
  const { upcomingEvents } = useSelector((state) => state?.event);
  const [organizationName, setOrganizationName] = React.useState("");

  // Derive isRegistered from upcomingEvents (user's registered events)
  const isRegistered = useMemo(() => {
    return upcomingEvents?.some((e) => e.id === event.id) || false;
  }, [event.id, upcomingEvents]);

  // Fetch organization profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!event?.organization_id) return;
      try {
        const response = await dispatch(fetchUserProfile(event.organization_id));
        const profile = response?.payload?.user;
        setOrganizationName(profile?.name || "");
      } catch (err) {
        console.error("Failed to fetch organization profile:", err);
      }
    };
    fetchProfile();
  }, [dispatch, event?.organization_id]);

  const loc = event?.location;
  const locationStr =
    loc?.address ?? (loc?.lat && loc?.long ? `${loc.lat}, ${loc.long}` : "Online / TBA");

  const capacityPercentage = event.capacity
    ? Math.min(((event.registeredCount || 0) / event.capacity) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900/20 via-gray-900/90 to-indigo-900/20 rounded-3xl shadow-2xl border border-gray-700/60 overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-indigo-900/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              type="button"
              className="group flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
              onClick={onBack}
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Events
            </button>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ring-1 ring-inset shadow-lg transition-all duration-300 ${
                  event.status === "published"
                    ? "bg-gradient-to-r from-emerald-900/60 to-green-900/60 text-emerald-200 ring-emerald-700/40"
                    : event.status === "cancelled"
                    ? "bg-gradient-to-r from-red-900/60 to-pink-900/60 text-red-200 ring-red-700/40"
                    : "bg-gradient-to-r from-gray-900/60 to-slate-900/60 text-gray-200 ring-gray-700/40"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  event.status === "published" ? "bg-emerald-400" :
                  event.status === "cancelled" ? "bg-red-400" : "bg-gray-400"
                }`}></div>
                {event.status ?? "draft"}
              </span>

              {/* REGISTERED OR REGISTER BUTTON */}
              {isRegistered ? (
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 px-6 py-3 rounded-xl border border-purple-700/40">
                  <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-purple-200 font-semibold">Registered</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="group/btn relative overflow-hidden rounded-xl px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl hover:shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105"
                  onClick={() => onRegister?.(event)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                </button>
              )}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            {event.event_name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-gray-300 font-medium">{fmtDate(event.scheduled_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-gray-300 font-medium">{locationStr}</span>
            </div>
            {event.points && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-emerald-300 font-semibold">{event.points} Points</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Event Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                  <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">START TIME</p>
                    <p className="text-sm text-white font-medium">{fmtDateTime(event.start_time)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">END TIME</p>
                    <p className="text-sm text-white font-medium">{fmtDateTime(event.end_time)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">CAPACITY</p>
                    <p className="text-sm text-white font-medium">{event.capacity ?? "Unlimited"}</p>
                    {event.capacity && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{event.registeredCount || 0} registered</span>
                          <span>{event.capacity} total</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${capacityPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                  <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">ORGANIZATION</p>
                    <p className="text-sm text-white font-medium">{organizationName || event.organization_id || "Community Event"}</p>
                  </div>
                </div>
                {event.badge_id && (
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                    <div className="w-10 h-10 bg-yellow-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">BADGE</p>
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-900/60 to-purple-900/60 px-3 py-1 text-sm font-medium text-indigo-200 ring-1 ring-inset ring-indigo-700/40 shadow-sm">
                        {event.badge_name}
                      </span>
                    </div>
                  </div>
                )}
                {Array.isArray(event.tags) && event.tags.length > 0 && (
                  <div className="p-3 bg-gray-700/30 rounded-xl">
                    <p className="text-xs text-gray-400 font-medium mb-2">TAGS</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, idx) => (
                        <span
                          key={`${tag}-${idx}`}
                          className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-900/60 to-pink-900/60 px-3 py-1 text-xs font-medium text-purple-200 ring-1 ring-inset ring-purple-700/40 shadow-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {event.description && (
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">{event.description}</p>
            </div>
          )}

          {Array.isArray(event.media) && event.media.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Media Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.media.map((m, i) => {
                  const isImage = typeof m.type === "string" && (m.type.includes("image") || m.type === "image");
                  return (
                    <div
                      key={`${m.url}-${i}`}
                      className="group relative overflow-hidden rounded-xl border border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {isImage ? (
                        <div className="aspect-square">
                          <img
                            src={m.url}
                            alt={m.type || "media"}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ) : (
                        <div className="aspect-square bg-gray-700/50 flex items-center justify-center">
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
                          >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m2 0h1.586a1 1 0 01.707.293l.707.707A1 1 0 0020.414 12H21M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">{m.type || "Media"} Link</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-colors duration-300">
                <div className="w-8 h-8 bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <span className="text-gray-300 font-medium">Share Event</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-colors duration-300">
                <div className="w-8 h-8 bg-green-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <span className="text-gray-300 font-medium">Invite Friends</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-colors duration-300">
                <div className="w-8 h-8 bg-yellow-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <span className="text-gray-300 font-medium">Report Event</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Event Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                <span className="text-gray-300 font-medium">Total Capacity</span>
                <span className="text-white font-bold">{event.capacity ?? "Infinite"}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                <span className="text-gray-300 font-medium">Registered</span>
                <span className="text-purple-300 font-bold">{event.registeredCount || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                <span className="text-gray-300 font-medium">Points Value</span>
                <span className="text-emerald-300 font-bold">{event.points || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                <span className="text-gray-300 font-medium">Status</span>
                <span className={`font-bold ${
                  event.status === "published" ? "text-emerald-300" :
                  event.status === "cancelled" ? "text-red-300" : "text-gray-300"
                }`}>
                  {event.status ?? "draft"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}