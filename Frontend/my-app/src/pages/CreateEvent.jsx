// src/pages/CreateEvents.js
import React, { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../redux/slices/EventSlice";
import { fetchBadges } from "../redux/slices/RewardsBadgesSlice";

// Leaflet imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function CreateEvents() {
  const dispatch = useDispatch();
  const { badges } = useSelector((state) => state.rewardsBadges);

  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    start_time: "",
    end_time: "",
    scheduled_date: "",
    location: { lat: 18.5204, long: 73.8567, address: "" },
    capacity: "",
    tags: [],
    status: "draft",
    points: 0,
    media: [],
    badge_id: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchBadges());
  }, [dispatch]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("eventDraft");
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("eventDraft", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setFormData((prev) => ({ ...prev, tags: value.split(",") }));
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.event_name.trim())
      errors.event_name = "Event name is required.";
    if (!formData.description.trim())
      errors.description = "Description is required.";
    if (!formData.scheduled_date)
      errors.scheduled_date = "Scheduled date is required.";
    if (!formData.start_time) errors.start_time = "Start time is required.";
    if (!formData.end_time) errors.end_time = "End time is required.";
    if (formData.start_time && formData.end_time) {
      const start = new Date(`1970-01-01T${formData.start_time}`);
      const end = new Date(`1970-01-01T${formData.end_time}`);
      if (start >= end) errors.end_time = "End time must be after start time.";
    }
    if (!formData.location.address.trim())
      errors.location = "Address is required.";
    if (
      formData.capacity &&
      (isNaN(formData.capacity) || formData.capacity <= 0)
    )
      errors.capacity = "Capacity must be a positive number.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const payload = new FormData();
      for (const key of Object.keys(formData)) {
        if (key === "media") {
          formData.media.forEach((m) => {
            if (m.file) payload.append("media", m.file);
          });
        } else if (key === "tags") {
  formData.tags.forEach(tag => payload.append("tags", tag));
} else if (key === "location") {
  payload.append("location", JSON.stringify(formData.location));

        } else {
          payload.append(key, formData[key]);
        }
      }

      await dispatch(createEvent(payload)).unwrap();
      setSuccess(true);
      setFormData({
        event_name: "",
        description: "",
        start_time: "",
        end_time: "",
        scheduled_date: "",
        location: { lat: 18.5204, long: 73.8567, address: "" },
        capacity: "",
        tags: [],
        status: "draft",
        points: 0,
        media: [],
        badge_id: "",
      });
      setValidationErrors({});
      localStorage.removeItem('eventDraft');
    } catch (err) {
      setError(err.message || "Something went wrong");
      setSuccess(false); // Ensure success is false on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: parseFloat(lat),
            long: parseFloat(lon),
            address: display_name,
          },
        }));
        setSearchQuery("");
      } else {
        alert("Location not found. Please try a different search.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Error searching location. Please try again.");
    }
  };

  // Map click handler
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, lat: e.latlng.lat, long: e.latlng.lng },
        }));
      },
    });
    return formData.location.lat && formData.location.long ? (
      <Marker position={[formData.location.lat, formData.location.long]} />
    ) : null;
  }

  // Scroll reveal animation
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      el.classList.add("reveal-init");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Calculate progress based on filled required fields
  useEffect(() => {
    const requiredFields = [
      "event_name",
      "description",
      "scheduled_date",
      "start_time",
      "end_time",
      "location.address",
    ];
    const filledFields = requiredFields.filter((field) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return formData[parent][child]?.trim();
      }
      return formData[field]?.trim();
    });
    setProgress((filledFields.length / requiredFields.length) * 100);
  }, [formData]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm">Form Progress</span>
            <span className="text-white text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-800/80 border border-green-600 rounded-lg text-green-200">
            Event created successfully!
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md w-full mx-4">
              <h3 className="text-white text-lg font-semibold mb-4">Confirm Event Creation</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to create this event?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-md text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-md text-white transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main form */}
        <section className="space-y-6">
          <div
            data-reveal
            className="rounded-2xl p-8 bg-gray-800/80 backdrop-blur border border-gray-700/60 shadow-xl hover:shadow-2xl transition"
          >
            <h2 className="text-2xl font-semibold mb-6 text-white">Create New Event</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Name */}
              <div className="md:col-span-2">
                <label className="block text-white mb-2">Event Name *</label>
                <input
                  type="text"
                  name="event_name"
                  placeholder="Event Name"
                  value={formData.event_name}
                  onChange={handleChange}
                  required
                  className={`w-full border ${validationErrors.event_name ? 'border-red-500' : 'border-gray-600'} bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400`}
                  aria-describedby={validationErrors.event_name ? "event_name_error" : undefined}
                />
                {validationErrors.event_name && <p id="event_name_error" className="text-red-400 text-sm mt-1">{validationErrors.event_name}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-white mb-2">Description *</label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full border ${validationErrors.description ? 'border-red-500' : 'border-gray-600'} bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400`}
                  aria-describedby={validationErrors.description ? "description_error" : undefined}
                />
                {validationErrors.description && <p id="description_error" className="text-red-400 text-sm mt-1">{validationErrors.description}</p>}
              </div>

              {/* Scheduled Date */}
              <div>
                <label className="block text-white mb-2">Scheduled Date *</label>
                <input
                  type="date"
                  name="scheduled_date"
                  value={formData.scheduled_date}
                  onChange={handleChange}
                  required
                  className={`w-full border ${validationErrors.scheduled_date ? 'border-red-500' : 'border-gray-600'} bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400`}
                  aria-describedby={validationErrors.scheduled_date ? "scheduled_date_error" : undefined}
                />
                {validationErrors.scheduled_date && <p id="scheduled_date_error" className="text-red-400 text-sm mt-1">{validationErrors.scheduled_date}</p>}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-white mb-2">Start Time *</label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  className={`w-full border ${validationErrors.start_time ? 'border-red-500' : 'border-gray-600'} bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400`}
                  aria-describedby={validationErrors.start_time ? "start_time_error" : undefined}
                />
                {validationErrors.start_time && <p id="start_time_error" className="text-red-400 text-sm mt-1">{validationErrors.start_time}</p>}
              </div>

              {/* End Time */}
              <div>
                <label className="block text-white mb-2">End Time *</label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  className={`w-full border ${validationErrors.end_time ? 'border-red-500' : 'border-gray-600'} bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400`}
                  aria-describedby={validationErrors.end_time ? "end_time_error" : undefined}
                />
                {validationErrors.end_time && <p id="end_time_error" className="text-red-400 text-sm mt-1">{validationErrors.end_time}</p>}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-white mb-2">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className={`w-full border ${validationErrors.capacity ? 'border-red-500' : 'border-gray-600'} bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400`}
                  aria-describedby={validationErrors.capacity ? "capacity_error" : undefined}
                />
                {validationErrors.capacity && <p id="capacity_error" className="text-red-400 text-sm mt-1">{validationErrors.capacity}</p>}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white mb-2">Tags</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="Tags (comma separated)"
                  value={formData.tags.join(",")}
                  onChange={handleChange}
                  className="w-full border border-gray-600 bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-white mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-600 bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Points */}
              <div>
                <label className="block text-white mb-2">Points</label>
                <input
                  type="number"
                  name="points"
                  placeholder="Points"
                  value={formData.points}
                  onChange={handleChange}
                  className="w-full border border-gray-600 bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
                />
              </div>

              {/* Badge */}
              {badges?.length > 0 && (
                <div>
                  <label className="block text-white mb-2">Badge</label>
                  <select
                    name="badge_id"
                    value={formData.badge_id}
                    onChange={handleChange}
                    className="w-full border border-gray-600 bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="">Select Badge</option>
                    {badges.map((badge) => (
                      <option key={badge.id} value={badge.id}>
                        {badge.name} ({badge.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-white mb-2">Location *</label>
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Search for a location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 border border-gray-600 bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md text-white transition"
                  >
                    Search
                  </button>
                </div>
                <div className="h-64 mb-4 border border-gray-600 rounded-md overflow-hidden">
                  <MapContainer
                    center={[formData.location.lat, formData.location.long]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                  </MapContainer>
                </div>
                <input
                  type="text"
                  name="location.address"
                  placeholder="Address"
                  value={formData.location.address}
                  onChange={handleChange}
                  className={`w-full border ${validationErrors.location ? 'border-red-500' : 'border-gray-600'} bg-gray-700/80 px-3 py-2 rounded-md text-white focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400`}
                  aria-describedby={validationErrors.location ? "location_error" : undefined}
                />
                {validationErrors.location && <p id="location_error" className="text-red-400 text-sm mt-1">{validationErrors.location}</p>}
              </div>

              {/* Media Upload */}
              <div className="md:col-span-2">
                <label className="block text-white mb-2">Upload Media</label>
                <div
                  className="border-2 border-dashed border-gray-600 rounded-md p-6 text-center hover:border-purple-400 transition-colors"
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    files.forEach(file => {
                      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                        const newMedia = [...formData.media, {
                          file,
                          type: file.type.startsWith("image") ? "image" : "video",
                          preview: URL.createObjectURL(file),
                        }];
                        setFormData((prev) => ({ ...prev, media: newMedia }));
                      }
                    });
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <p className="text-gray-400 mb-2">Drag and drop files here or click to select</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      files.forEach(file => {
                        const newMedia = [...formData.media, {
                          file,
                          type: file.type.startsWith("image") ? "image" : "video",
                          preview: URL.createObjectURL(file),
                        }];
                        setFormData((prev) => ({ ...prev, media: newMedia }));
                      });
                    }}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white transition">
                    Select Files
                  </label>
                </div>
                {formData.media.map((m, idx) => (
                  <div key={idx} className="flex gap-4 items-center mt-4 p-4 bg-gray-700/50 rounded-md">
                    {m.preview && (
                      <div className="w-16 h-16 bg-gray-600 rounded-md overflow-hidden">
                        {m.type === "image" ? (
                          <img src={m.preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <video src={m.preview} className="w-full h-full object-cover" />
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-white text-sm">{m.file?.name}</p>
                      <p className="text-gray-400 text-xs">{m.type}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newMedia = formData.media.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, media: newMedia }));
                      }}
                      className="text-red-400 font-semibold hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading || progress < 100}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-md font-semibold text-white hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Event...
                    </div>
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
