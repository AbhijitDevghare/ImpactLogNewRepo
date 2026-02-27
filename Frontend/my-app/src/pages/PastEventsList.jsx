import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPastEvents, changeEventStatus } from "../redux/slices/EventSlice";

export default function PastEventsList() {
  const dispatch = useDispatch();
  const { pastEvents = [], loading = false, error = null } = useSelector((state) => state?.event || {});

  useEffect(() => {
    dispatch(fetchPastEvents());
    console.log(pastEvents)
  }, [dispatch]);

  const handleMarkCompleted = async (eventId) => {
    try {
      await dispatch(changeEventStatus({ id:eventId, status: "completed" })).unwrap();
      dispatch(fetchPastEvents());
      
    } catch (err) {
      console.error("Failed to mark as completed:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Past Events</h1>
        <p className="text-gray-400 mt-1">Review and manage your past events.</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-400">Loading past events...</div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-12 text-red-400">
          {String(error) || "Something went wrong."}
        </div>
      )}

      {/* Events List */}
      {!loading && !error && pastEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-800/80 backdrop-blur border border-gray-700/60 rounded-2xl p-4 flex flex-col"
            >
              <h3 className="text-lg font-semibold text-white truncate">
                {event.event_name || event.title}
              </h3>
              <p className="text-gray-400 mt-2 text-sm">
                Date: {event.scheduled_date ? new Date(event.scheduled_date).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-gray-400 text-sm">
                Location: {event.location?.address || "N/A"}
              </p>
              <button
                onClick={() =>{
                                        console.log(event.id)
                    handleMarkCompleted(event.id);
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition"
              >
                Mark as Completed
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No Events */}
      {!loading && !error && pastEvents.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No past events found.
        </div>
      )}
    </div>
  );
}