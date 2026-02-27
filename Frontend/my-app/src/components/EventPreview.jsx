import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { unregisterEvent, fetchAttendance, resetAttendance } from "../redux/slices/EventSlice";
import toast from "react-hot-toast";

export default function EventPreview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);

  const { data: user } = useSelector((s) => s.auth);
  const { upcomingEvents = [], attendance, loading, error } = useSelector(
    (s) => s.event
  );

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Compute values for hooks
  const reg = state;
  const ev = reg?.event;
  const evId = ev?.id;
  const today = new Date().toISOString().split("T")[0];
  const eventDate = ev?.scheduled_date
    ? new Date(ev.scheduled_date).toISOString().split("T")[0]
    : null;
  const isToday = today === eventDate;

  useEffect(() => {
    if (isToday && user?.id && evId) {
      dispatch(fetchAttendance({ userId: user.id, eventId: evId }));
    } else if (!isToday) {
      dispatch(resetAttendance());
    }
  }, [isToday, user?.id, evId, dispatch]);

  // Guard
  if (!state) {
    return (
      <div className="text-center py-12 text-red-400">
        Event data not found.
        <button
          onClick={() => navigate(-1)}
          className="ml-2 text-purple-400 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  const isRegistered = upcomingEvents.some((e) => e.eventId === reg.eventId);

  const registeredOn = reg.registeredAt
    ? new Date(reg.registeredAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";

  const handleUnregister = async () => {
    if (!user?.id) {
      toast.error("Please log in to unregister.");
      return;
    }

    const ok = window.confirm(
      `Unregister from "${ev?.event_name}"?\nYou will lose ${ev?.points} points.`
    );
    if (!ok) return;

    try {
      await dispatch(unregisterEvent({ registrationId: reg.id })).unwrap();
      toast.success("Unregistered successfully!");
      navigate(-1);
    } catch (err) {
      toast.error(err.message || "Failed to unregister.");
    }
  };

  const tags = typeof ev?.tags === "string" ? JSON.parse(ev.tags) : ev?.tags || [];

  // Simplify attendance logic
  const getAttendanceDisplay = () => {
    if (!isToday) return null;

    if (loading) {
      return (
        <p className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-xl text-center shadow-lg">
          Checking attendance...
        </p>
      );
    }

    if (error) {
      return (
        <p className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl text-center shadow-lg">
          Failed to check attendance
        </p>
      );
    }

    {      console.log("ATTENDENCE OBJECT IN ATTENDENCE , ",attendance)
}
    if (attendance?.checkinTime) {
      return (
        <div className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl text-center shadow-lg">
          <p>Attendance Verified</p>
          <p className="text-sm">
            Checked in at {new Date(attendance.checkinTime).toLocaleString()}
          </p>
        </div>
      );
    }

    return (
      <button
        onClick={() => navigate("/qr-scanner")}
        className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
      >
        Verify Attendance
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
      >
        Back to Profile
      </button>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-3xl p-8 shadow-2xl border border-purple-700/30">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{ev?.event_name}</h1>
              <p className="text-lg text-gray-300 leading-relaxed">{ev?.description}</p>
              {reg.registeredAt && (
                <p className="mt-4 text-sm text-emerald-300 font-medium">
                  Registered on: {registeredOn}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              {/* Unregister */}
              {isRegistered && !attendance?.checkinTime && (
                <button
                  onClick={handleUnregister}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Unregister
                </button>
              )}

              {/* Attendance Display */}
              {getAttendanceDisplay()}
            </div>
          </div>
        </div>

        {/* Media */}
        {ev?.media?.[0]?.url && (
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-700/50">
            <img
              src={ev.media[0].url}
              alt={ev.event_name}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization */}
          <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold mb-4">Organization</h3>
            <div className="flex items-center gap-4">
              <img
                src={ev?.organization?.avatarUrl}
                alt={ev?.organization?.name}
                className="w-14 h-14 rounded-full ring-2 ring-purple-500/50"
              />
              <div>
                <p className="font-semibold text-white">{ev?.organization?.name}</p>
                <p className="text-sm text-gray-400">{ev?.organization?.email}</p>
              </div>
            </div>
          </div>

          {/* Event Info */}
          <div className="bg-gray-800/80 rounded-2xl p-6 space-y-4 border border-gray-700/50">
            <div className="flex justify-between">
              <span className="text-gray-400">Date</span>
              <span className="font-medium">
                {ev?.scheduled_date
                  ? new Date(ev.scheduled_date).toLocaleDateString()
                  : "TBD"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time</span>
              <span className="font-medium">
                {ev?.start_time && ev?.end_time
                  ? `${ev.start_time} - ${ev.end_time}`
                  : "TBD"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Points</span>
              <span className="font-medium text-emerald-300">+{ev?.points}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Capacity</span>
              <span className="font-medium">{ev?.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span
                className={`font-medium capitalize ${
                  ev?.status === "published"
                    ? "text-green-400"
                    : ev?.status === "draft"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {ev?.status || "unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        {ev?.location?.address && (
          <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold mb-2">Location</h3>
            <p className="text-gray-300">{ev.location.address}</p>
            {ev.location.lat && ev.location.long && (
              <a
                href={`https://maps.google.com/?q=${ev.location.lat},${ev.location.long}`}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 text-sm underline mt-2 inline-block"
              >
                Open in Google Maps
              </a>
            )}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-purple-900/60 text-purple-300 text-xs rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
