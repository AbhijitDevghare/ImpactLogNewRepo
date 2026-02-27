import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPublishedEvents, changeEventStatus, fetchAttendenceByEventId } from "../redux/slices/EventSlice";
import { getQr } from "../redux/slices/VerificationSlice";

export default function PublishedEventsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { publishedEvents = [], loading, error, verifiedUsersForEvent } = useSelector((state) => state.event);
  const qrImage = useSelector((state) => state.verification.qrImage);
  const [expandedId, setExpandedId] = useState(null);
  const [lastQrEventId, setLastQrEventId] = useState(null);
  const [showVerifiedForId, setShowVerifiedForId] = useState(null);

  useEffect(() => {
    dispatch(getPublishedEvents());
  }, [dispatch]);

  const handleToggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleToggleVerified = (id) => {
    if (showVerifiedForId === id) {
      setShowVerifiedForId(null);
    } else {
      setShowVerifiedForId(id);
      dispatch(fetchAttendenceByEventId(id));
    }
  };

  // const handleChangeStatus = (id, currentStatus) => {
  //   const newStatus = currentStatus === "published" ? "cancelled" : "published";
  //   dispatch(changeEventStatus({ id, status: newStatus }));
  // };

  if (loading)
    return <div className="text-center py-12 text-white">Loading events...</div>;
  if (error)
    return <div className="text-center py-12 text-red-400">Error: {error}</div>;

  return (
    <div className="min-h-screen  text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Published Events</h1>

      {publishedEvents.length === 0 ? (
        <p className="text-center text-gray-400">No published events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {publishedEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-gray-800/80 rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-colors"
            >
              <h2 className="text-xl font-bold mb-2">{ev.event_name}</h2>
              <p className="text-gray-400 mb-1">
                Date: {new Date(ev.scheduled_date).toLocaleDateString()}
              </p>
              <p className="text-gray-400 mb-1">
                Location: {ev.location?.address || "N/A"}
              </p>
              <p className="text-emerald-300 mb-4">Points: +{ev.points}</p>

              <div className="flex flex-col gap-2">
                {/* ✅ Inline Details */}
                <button
                  onClick={() => handleToggleDetails(ev.id)}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  {expandedId === ev.id ? "Hide Details" : "View Details"}
                </button>

                {expandedId === ev.id && (
                  <div className="bg-gray-700 p-3 mt-2 rounded-lg text-sm text-gray-200">
                    <p>
                      <strong>Description:</strong> {ev.description || "No description."}
                    </p>
                    <p>
                      <strong>Category:</strong> {ev.category || "N/A"}
                    </p>
                    <p>
                      <strong>Volunteers Needed:</strong> {ev.volunteers_needed || "N/A"}
                    </p>
                  </div>
                )}

                {/* ✅ Change Status */}
                {/* <button
                  onClick={() => handleChangeStatus(ev.id, ev.status)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  Change Status ({ev.status})
                </button> */}

                {/* ✅ View Registered Users */}
                <button
                  onClick={() => navigate(`/event/${ev.id}/registereduser`)}
                  className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                >
                  View Registered Users
                </button>

                {/* ✅ Verify Users */}
                <button
                  onClick={() => {
                    if (lastQrEventId === ev.id) {
                      setLastQrEventId(null);
                    } else {
                      setLastQrEventId(ev.id);
                      dispatch(getQr(ev.id));
                    }
                  }}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
                >
                  Verify Users
                </button>

                {qrImage && lastQrEventId === ev.id && (
                  <img src={qrImage} alt="QR Code" className="mt-2 w-full h-auto rounded-lg" />
                )}

                {/* ✅ View Verified Users */}
                <div>

                  <button
                    onClick={() => handleToggleVerified(ev.id)}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
                  >
                    {/* {console.log(verifiedUsersForEvent)} */}
                    {showVerifiedForId === ev.id ? "Hide Verified Users" : "View Verified Users"}
                  </button>

                  {showVerifiedForId === ev.id && (
                    <div className="mt-3 bg-gray-800/70 rounded-lg p-3">
                      <div className="text-sm text-gray-300 font-medium mb-2">Verified Users</div>
                      {Array.isArray(verifiedUsersForEvent) && verifiedUsersForEvent.length > 0 ? (
                        <ul className="space-y-2">
                          {verifiedUsersForEvent.map((rec) => (
                            <li key={rec.id} className="text-sm text-gray-200 border border-gray-700 rounded p-2">
                              <div>
                                User ID: <span className="text-purple-300">{rec.Registration?.userId || "N/A"}</span>
                              </div>
                              <div>
                                Check-in: <span className="text-emerald-300">{rec.checkinTime ? new Date(rec.checkinTime).toLocaleString() : "N/A"}</span>
                                {" "}via <span className="text-blue-300">{rec.checkinMethod || "N/A"}</span>
                              </div>
                              {rec.proofUrl && (
                                <a href={rec.proofUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                                  View proof
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-gray-400">No verified users yet.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
