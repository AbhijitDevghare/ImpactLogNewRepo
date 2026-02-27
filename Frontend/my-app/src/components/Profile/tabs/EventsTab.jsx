// ──────────────────────────────────────────────────────────────
//  EventsTab.jsx
//  registeredEvents = [{ id, eventId, status, event: { … } }, …]
// ──────────────────────────────────────────────────────────────
import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventsTab({
  registeredEvents = [],
  attendedEvents   = [],
  isOwnProfile = false,
  isLoadingAttended = false,
}) {
  const navigate = useNavigate();

  const registeredTitle = "Registered Events";
  const attendedTitle   = "Events Attended";

  // ── Empty State ─────────────────────────────────────
  const EmptyState = ({ type, isOwn }) => {
    const messages = {
      registered: isOwn
        ? "Discover and register for events to get started!"
        : "This user hasn't registered for any events yet.",
      attended: isOwn
        ? "Complete your first event to start building your impact!"
        : "This user hasn't attended any events yet.",
    };
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="text-lg font-bold text-white mb-2">
          No {type} events{isOwn ? "" : " yet"}
        </h4>
        <p className="text-gray-400 max-w-sm mx-auto">{messages[type]}</p>
      </div>
    );
  };

  // ── Card ─────────────────────────────────────────────
  const EventCard = ({ reg, type }) => {
    const ev = reg    
    // console.log("reg",reg)                 // <-- the nested event 
    console.log("EVENT In the event tab : ",ev)
    const isRegistered = type === "registered";
    const formattedDate = ev.event.scheduled_date
      ? new Date(ev.event.scheduled_date).toLocaleDateString()
      : "TBD";

    return (
      <div
        onClick={() => navigate("/event-preview", { state: reg })}
        className={`group p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer
          ${isRegistered
            ? "bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-700/30 hover:border-blue-500/50"
            : "bg-gradient-to-br from-emerald-900/20 to-green-900/20 border-emerald-700/30 hover:border-emerald-500/50"
          }`}
      >
        <h4 className="text-white font-semibold mb-1 line-clamp-1">
          {ev.event.event_name || "Untitled Event"}
        </h4>
        <p className="text-gray-400 text-sm mb-3">{formattedDate}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium
                ${isRegistered
                  ? reg.status === "registered"
                    ? "bg-green-900/50 text-green-300"
                    : "bg-orange-900/50 text-orange-300"
                  : "bg-emerald-900/50 text-emerald-300"
                }`}
            >
              {isRegistered ? (reg.status || "Registered") : "Attended"}
            </span>
            {ev.points && (
              <span className="px-2 py-1 bg-yellow-900/50 text-yellow-300 text-xs rounded-full">
                +{ev.points} pts
              </span>
            )}
          </div>

          <span className="text-xs font-medium text-purple-300 group-hover:text-purple-200 transition-colors">
            View Details
          </span>
        </div>
      </div>
    );
  };

  // ── Render ───────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* Registered */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
          <span>{registeredTitle}</span>
          <span className="text-sm text-gray-400">({registeredEvents.length})</span>
        </h3>

        {registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registeredEvents.map((reg) => (
              <EventCard key={reg.id} reg={reg} type="registered" />
            ))}
          </div>
        ) : (
          <EmptyState type="registered" isOwn={isOwnProfile} />
        )}
      </div>

      {/* Attended */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
          <span>{attendedTitle}</span>
          <span className="text-sm text-gray-400">({attendedEvents.length})</span>
        </h3>

        {attendedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attendedEvents.map((reg) => (
              <EventCard key={reg.id} reg={reg} type="attended" />
            ))}
          </div>
        ) : isLoadingAttended ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading attended events...</p>
          </div>
        ) : (
          <EmptyState type="attended" isOwn={isOwnProfile} />
        )}
      </div>

    </div>
  );
}