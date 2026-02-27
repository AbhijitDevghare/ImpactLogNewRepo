import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getUnpublishedEvents,
  publishEvent,
} from "../redux/slices/EventSlice";

export default function UnpublishedEventsPage() {
  const dispatch = useDispatch();
  const { unpublished = [], loading = false, error = null } =
    useSelector((state) => state?.event  || {});

  

console.log("🟢 Redux State =>", { unpublished, loading, error });

  useEffect(() => {
    dispatch(getUnpublishedEvents()).then((res) => {
      console.log("Fetched unpublished:", res.payload);
    });
  }, [dispatch]);

  const handlePublish = async (eventId) => {
    try {
      await dispatch(publishEvent(eventId)).unwrap();
      dispatch(getUnpublishedEvents());
    } catch (err) {
      console.error("Failed to publish event:", err);
    }
  };

  const unpublishedEvents = Array.isArray(unpublished)
    ? unpublished
    : unpublished.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Unpublished (Draft) Events
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your draft events here. Publish when ready.
          </p>
        </div>
        <Link
          to="/create-events"
          className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition"
        >
          Create Event
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-400">Loading events...</div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-12 text-red-400">
          {String(error) || "Something went wrong."}
        </div>
      )}

      {/* No Events */}
      {!loading && !error && unpublishedEvents.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No draft events found.{" "}
          <Link to="/create-events" className="text-purple-400 underline">
            Create one now
          </Link>
          .
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && unpublishedEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {unpublishedEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-gray-800/80 backdrop-blur border border-gray-700/60 rounded-2xl p-4 flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-44 bg-gray-900 rounded-lg overflow-hidden">
                {evt.media?.[0]?.url ? (
                  <img
                    src={evt.media[0].url}
                    alt={evt.event_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center text-white">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="mt-3 flex-1">
                <h3 className="text-lg font-semibold text-white truncate">
                  {evt.event_name}
                </h3>
                <p className="text-gray-400 mt-2 text-sm">
                  {evt.description.length > 100
                    ? `${evt.description.slice(0, 100)}...`
                    : evt.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {evt.scheduled_date
                      ? new Date(evt.scheduled_date).toLocaleDateString()
                      : "TBA"}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                      {evt.badge_name || "No Badge"}
                    </span>
                    <span className="text-gray-300">{evt.points ?? 0} pts</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => handlePublish(evt.id)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition"
                >
                  Publish
                </button>
                <Link
                  to={`/edit-event/${evt.id}`}
                  state={{ event: evt }}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-700 transition"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
