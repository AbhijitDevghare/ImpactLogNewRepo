import React from "react";

function formatDate(dateLike) {
  if (!dateLike) return "TBD";
  const d = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString();
}

export default function EventCard({ event, onRegister, onViewDetails }) {
  const date =
    event.scheduled_date ??
    (event.start_time ? new Date(event.start_time).toLocaleDateString() : null);
  const location =
    event?.location?.address ??
    (event?.location?.lat && event?.location?.long
      ? `${event.location.lat}, ${event.location.long}`
      : "Online / TBA");

  const eventImage =
    Array.isArray(event.media) && event.media.length > 0
      ? event.media.find((m) => m.type?.includes("image") || m.type === "image")?.url
      : event.image_url || event.cover_image || null;

  return (
    <div className="group relative bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-900/90 rounded-3xl shadow-2xl border border-gray-700/60 hover:border-purple-500/50 hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-3xl">
        <img
          src={eventImage || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
          alt={event.event_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium ring-1 ring-inset shadow-lg ${
              event.status === "published"
                ? "bg-emerald-900/80 text-emerald-200 ring-emerald-700/50"
                : event.status === "cancelled"
                ? "bg-red-900/80 text-red-200 ring-red-700/50"
                : "bg-gray-900/80 text-gray-200 ring-gray-700/50"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                event.status === "published"
                  ? "bg-emerald-400"
                  : event.status === "cancelled"
                  ? "bg-red-400"
                  : "bg-gray-400"
              }`}
            ></div>
            {event.status ?? "draft"}
          </span>
        </div>

        {/* Quick Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            {event.points && (
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-yellow-300 font-bold text-sm">{event.points}</span>
              </div>
            )}
            {event.capacity && (
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-blue-300 font-bold text-sm">
                  {event.registeredCount || 0}/{event.capacity}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 flex flex-col justify-between min-h-[300px]">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-100 transition-colors duration-300 leading-tight">
            {event.event_name}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 px-3 py-1.5 text-sm font-medium text-purple-200 ring-1 ring-inset ring-purple-700/40 shadow-lg">
                {formatDate(date)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-300 truncate">{location}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              {event.points && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-900/50 rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-emerald-300">{event.points} pts</span>
                </div>
              )}
              {event.badge_name && (
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-900/60 to-purple-900/60 px-3 py-1 text-xs font-medium text-indigo-200 ring-1 ring-inset ring-indigo-700/40 shadow-sm">
                  {event.badge_name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center gap-3">
          {event.isRegistered ? (
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-5 h-5 bg-purple-900/50 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-purple-300 font-semibold text-sm">Registered</span>
            </div>
          ) : (
            <button
              type="button"
              className="ml-auto group/btn relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105"
              onClick={() => onRegister?.(event)}
            >
              <span className="relative z-10">Register</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
            </button>
          )}
          <button
            type="button"
            className="group/btn relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-medium text-gray-200 bg-gray-700/60 hover:bg-gray-700/80 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-600/50 hover:border-gray-500/50"
            onClick={() => onViewDetails?.(event)}
          >
            <span className="relative z-10">Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}