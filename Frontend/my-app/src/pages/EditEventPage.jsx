import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { updateEvent } from "../redux/slices/EventSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchBadges } from "../redux/slices/RewardsBadgesSlice";

export default function EditEventPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event || {};
  const dispatch = useDispatch();
  const { badges = [] } = useSelector((state) => state.rewardsBadges);

  const [formData, setFormData] = useState({
    event_name: event.event_name || "",
    description: event.description || "",
    scheduled_date: event.scheduled_date || "",
    start_time: event.start_time
      ? new Date(event.start_time).toISOString().slice(0, 16)
      : "",
    end_time: event.end_time
      ? new Date(event.end_time).toISOString().slice(0, 16)
      : "",
    lat: event.location?.lat || "",
    long: event.location?.long || "",
    address: event.location?.address || "",
    capacity: event.capacity || "",
    tags: event.tags ? event.tags.join(", ") : "",
    status: event.status || "draft",
    points: event.points || "",
    badge_id: event.badge_id || "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchBadges());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation: end_time > start_time
    if (new Date(formData.end_time) <= new Date(formData.start_time)) {
      setError("End time must be after start time");
      return;
    }

    const updatedData = {
      event_name: formData.event_name,
      description: formData.description,
      scheduled_date: formData.scheduled_date,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      location: {
        lat: parseFloat(formData.lat),
        long: parseFloat(formData.long),
        address: formData.address,
      },
      capacity: parseInt(formData.capacity),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: formData.status,
      points: parseInt(formData.points),
      badge_id: formData.badge_id,
    };

    

    // try {
    //   await axios.put(`http://localhost:3005/events/${event.id}`, updatedData);
    //   navigate("/publish-events");
    // } catch (err) {
    //   console.error(err);
    //   setError("Failed to update event");
    // }
    const res = await dispatch(updateEvent({ id: event.id, updatedData }));

    if (!res.error) 
        navigate("/publish-events"); 

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Edit Event Details
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1">Event Name</label>
            <input
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800"
              rows="4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Scheduled Date</label>
              <input
                type="date"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800"
              />
            </div>

            <div>
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Start Time</label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1">End Time</label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Location</label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                step="any"
                name="lat"
                placeholder="Latitude"
                value={formData.lat}
                onChange={handleChange}
                className="p-2 rounded bg-gray-800"
              />
              <input
                type="number"
                step="any"
                name="long"
                placeholder="Longitude"
                value={formData.long}
                onChange={handleChange}
                className="p-2 rounded bg-gray-800"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="p-2 rounded bg-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1">Points</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800"
            />
          </div>

          <div>
            <label className="block mb-1">Badge ID</label>
            <select
              name="badge_id"
              value={formData.badge_id}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800"
              required
            >
              <option value="">Select a Badge</option>
              {badges.map((badge) => (
                <option key={badge.id} value={badge.id}>
                  {badge.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold mt-4"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}
