import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompletedEvents,
  fetchRegisteredUsers,
  giveRewards
} from "../redux/slices/EventSlice";
import { fetchBadges } from "../redux/slices/RewardsBadgesSlice";

export default function CompletedEventsPage() {
  const dispatch = useDispatch();
  const { completedEvents = [], loading = false, error = null } =
    useSelector((state) => state?.event || {});
  const { badges = [] } = useSelector((state) => state.rewardsBadges);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [points, setPoints] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [badgeName, setBadgeName] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [panelLoading, setPanelLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCompletedEvents());
    dispatch(fetchBadges());
  }, [dispatch]);

  const handleGiveRewards = async (event) => {
    setSelectedEvent(event);
    setPoints(event.points || 0);
    setBadgeId(event.badge_id || "");
    setBadgeName(event.badge_name || "");
    setPanelLoading(true);
    setShowPanel(true);

    try {
      const users = await dispatch(fetchRegisteredUsers(event.id)).unwrap();
      setRegisteredUsers(users);

      // ✅ FIX: Use correct ID structure
      const ids = users.map((u) => u.user.id);
      setSelectedUsers(ids);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setPanelLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === registeredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(registeredUsers.map((u) => u.user.id));
    }
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmitRewards = async () => {
  
    console.log("SELECTED USERS : ",selectedUsers)
    if (selectedUsers.length === 0) {
      alert("Please select users");
      return;
    }

    try {
      await dispatch(
        giveRewards({
          selectedUsers,
          event_id: selectedEvent.id,
          points: parseInt(points),
          badge_id: badgeId,
          badge_name: badgeName
        })
      ).unwrap();

      alert("Rewards given successfully!");

      // Reset state cleanly
      setShowPanel(false);
      setSelectedEvent(null);
      setSelectedUsers([]);
      setRegisteredUsers([]);
    } catch (err) {
      console.error("Failed to give rewards:", err);
      alert("Failed to give rewards");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Completed Events</h1>
        <p className="text-gray-400 mt-1">
          Manage rewards for your completed events.
        </p>
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-400">
          Loading completed events...
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12 text-red-400">
          {String(error)}
        </div>
      )}

      {!loading && completedEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-800 rounded-2xl p-4 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white">
                {event.event_name}
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                Date:{" "}
                {event.scheduled_date
                  ? new Date(event.scheduled_date).toLocaleDateString()
                  : "N/A"}
              </p>

              <button
                onClick={() => handleGiveRewards(event)}
                className="mt-4 px-4 py-2 rounded bg-yellow-500 text-white"
              >
                Give Rewards
              </button>
            </div>
          ))}
        </div>
      )}

      {showPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-lg text-white font-semibold mb-4">
              Assign Rewards for {selectedEvent?.event_name}
            </h2>

            {panelLoading ? (
              <div className="text-gray-400">Loading users...</div>
            ) : (
              <>
                <button
                  onClick={handleSelectAll}
                  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {selectedUsers.length === registeredUsers.length
                    ? "Deselect All"
                    : "Select All"}
                </button>

                <div className="max-h-40 overflow-y-auto mb-4">
                  {registeredUsers.map((user) => (
                    <div key={user.user.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.user.id)}
                        onChange={() =>
                          handleUserToggle(user.user.id)
                        }
                        className="mr-2"
                      />
                      <span className="text-white">
                        {user.user.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSubmitRewards}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Submit Rewards
                  </button>
                  <button
                    onClick={() => setShowPanel(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}