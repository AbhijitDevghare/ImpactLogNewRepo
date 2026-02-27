// src/redux/slices/EventSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { eventAxios, registrationAxios, rewardsAxios } from "../../helpers/axiosInstances";
import toast from "react-hot-toast";

// ✅ Create a new event
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await toast.promise(
        eventAxios.post("/", eventData),
        {
          loading: "Wait! Creating event...",
          success: "Event created 🎉",
          error: "Failed to create event ❌",
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error creating event");
    }
  }
);

// ✅ Fetch all events
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventAxios.get("/");
      console.log("/fetchEvents Response : ",response)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching events");
    }
  }
);

// ✅ Register for an event
export const registerEvent = createAsyncThunk(
  "events/registerEvent",
  async ({ eventId, userId }, { rejectWithValue }) => {
    try {
      const response = await toast.promise(
        registrationAxios.post(`/register/${eventId}`, { userId }),
        {
          loading: "Registering...",
          success: "Registered 🎉",
          error: "Registration failed ❌",
        }
      );
      return { eventId, userId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error registering");
    }
  }
);

// ✅ Fetch upcoming events for a user
export const fetchUpcomingEvents = createAsyncThunk(
  "events/fetchUpcomingEvents",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await registrationAxios.get(`register/user/${userId}`);
      console.log("fetchUserUpcomingEvents : ",response.data)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching upcoming events");
    }
  }
);

// ✅ Fetch attended events for a user
export const fetchAttendedEvents = createAsyncThunk(
  "events/fetchAttendedEvents",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await eventAxios.get(`/user/${userId}/attended`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching attended events");
    }
  }
);

// ✅ Fetch unpublished events
export const getUnpublishedEvents = createAsyncThunk(
  "events/getUnpublishedEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventAxios.get("/getUnpublishedEvents");
      console.log("REPSINE EVNTE SUNPUBLISHED ",response)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching unpublished events");
    }
  }
);

// ✅ Publish an event
export const publishEvent = createAsyncThunk(
  "events/publishEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await toast.promise(
        eventAxios.post(`/publish/${eventId}`),
        {
          loading: "Publishing event...",
          success: "Event published 🎉",
          error: "Failed to publish event ❌",
        }
      );
      return { eventId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error publishing event");
    }
  }
);

export const unregisterEvent = createAsyncThunk(
  "event/unregisterEvent",
  async ({ registrationId }, { rejectWithValue }) => {
    try {
      const res = await registrationAxios.put(`/register/${registrationId}/cancel`);
      console.log("unregister event : ",res)
      return res.data;
    } catch (error) {
      console.log("unregister event : ",error)

      return rejectWithValue(
        error.response?.data || { message: "Unregister failed" }
      );
    }
  }
);

export const getPublishedEvents = createAsyncThunk(
  'event/getPublishedEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventAxios.get('/getPublishedEvent');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const changeEventStatus = createAsyncThunk(
  'event/changeEventStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await eventAxios.put(`/${id}/${status}`);
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change status');
    }
  }
);

export const updateEvent = createAsyncThunk(
  "event/updateEvent",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      console.log(updatedData)
      const res = await eventAxios.put(`/${id}`, updatedData);
      console.log(res)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPastEvents = createAsyncThunk(
  "event/fetchPastEvents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await eventAxios.get('/getPastEvents');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch completed events
export const fetchCompletedEvents = createAsyncThunk(
  "event/fetchCompletedEvents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await eventAxios.get('/completed');
      console.log("PRINTING COMPLETED EVENTS : ",res)
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch registered users for an event
export const fetchRegisteredUsers = createAsyncThunk(
  "event/fetchRegisteredUsers",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await registrationAxios.get(`/register/event/${eventId}`);
       console.log("event/fetchRegisteredUsers",res)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Give rewards to users
export const giveRewards = createAsyncThunk(
  "event/giveRewards",
  async ({ selectedUsers, event_id, points, badge_id,badge_name}, { rejectWithValue }) => {
    try {
      console.log(selectedUsers, event_id, points, badge_id,badge_name)
      const res = await rewardsAxios.post(`/giveRewards/${event_id}`, {
        selectedUsers, eventId:event_id, points, badge_id,badge_name
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getRegisteredUsersByEvent = createAsyncThunk(
  "event/getRegisteredUsersByEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await registrationAxios.get(`/register/event/${eventId}`);
      console.log("event/getRegisteredUsersByEvent",res)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAttendance = createAsyncThunk(
  "event/fetchAttendance",
  async ({ userId, eventId }, { rejectWithValue }) => {
    try {
      const res = await registrationAxios.get(`/attendence/user/${userId}/${eventId}`);
      console.log("ATTENDEDECE REPSONSE ",res.data)
      return res.data.attendance
;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUserAttendance = createAsyncThunk(
  "event/fetchUserAttendance",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await registrationAxios.get(`/attendence/user/${userId}/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const fetchAttendenceByEventId = createAsyncThunk(
  "event/fetchAttendenceByEventId",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await registrationAxios.get(`/attendence/event/${eventId}/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// Add to the slice
const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    upcomingEvents: [],
    attendedEvents: [],
    unpublished: [],
    publishedEvents: [],
    registeredUsers: [],
    pastEvents: [],
    completedEvents: [],
    attendance: null,
    userAttendance: [],
    verifiedUsersForEvent: [],
    loading: false,
    error: null
    },
  reducers: {
    resetAttendance: (state) => {
      state.attendance = null;
    },
  },
  extraReducers: (builder) => {
    builder
     .addCase(getRegisteredUsersByEvent.pending, (state) => {
    state.loading = true;
  })
  .addCase(getRegisteredUsersByEvent.fulfilled, (state, action) => {
    state.loading = false;
    state.registeredUsers = action.payload;
  })
  .addCase(getRegisteredUsersByEvent.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
      // Create
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerEvent.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        const ev = state.events.find((e) => e.id === eventId);
        if (ev) {
          ev.isRegistered = true;
        }
      })
      .addCase(unregisterEvent.fulfilled, (state, { payload }) => {
      state.upcomingEvents = state.upcomingEvents.filter(
        (e) => e.eventId !== payload.eventId
      );
      })
      // Upcoming
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEvents = action.payload;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Attended
      .addCase(fetchAttendedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.attendedEvents = action.payload;
      })
      .addCase(fetchAttendedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Unpublished
      .addCase(getUnpublishedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUnpublishedEvents.fulfilled, (state, action) => {
        state.loading = false;  
        // console.log('Unpublished events fetched:', action);
        state.unpublished = action.payload;
        // console.log("Unpublished event : ",state.unpublished)
        // console.log("LOADING OF THE DRAFT EVENT : ",state.loading)
      })
      .addCase(getUnpublishedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Publish
      .addCase(publishEvent.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        // Remove from unpublished or mark as published
        state.unpublished = state.unpublished.filter((e) => e.id !== eventId);
      })
      // Get Published Events
      .addCase(getPublishedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublishedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.publishedEvents = action.payload;
      })
      .addCase(getPublishedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change Event Status
      .addCase(changeEventStatus.pending, (state) => {
        // optional loading for status change
      })
      .addCase(changeEventStatus.fulfilled, (state, action) => {
        // Update the event in the list
        const updatedEvent = action.payload;
        const index = state.publishedEvents.findIndex(ev => ev.id === updatedEvent.id);
        if (index !== -1) {
          state.publishedEvents[index] = updatedEvent;
        }
      })
      .addCase(changeEventStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        // Update the event in unpublished array if present
        if (state.unpublished && Array.isArray(state.unpublished)) {
          const index = state.unpublished.findIndex(event => event.id === action.payload.id);
          if (index !== -1) {
            state.unpublished[index] = action.payload;
          }
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPastEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.pastEvents = action.payload;
      })
      .addCase(fetchPastEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompletedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.completedEvents = action.payload;
      })
      .addCase(fetchCompletedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRegisteredUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisteredUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.registeredUsers = action.payload;
      })
      .addCase(fetchRegisteredUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(giveRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(giveRewards.fulfilled, (state, action) => {
        state.loading = false;
        // Handle rewards given
      })
      .addCase(giveRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.userAttendance = action.payload;
      })
      .addCase(fetchUserAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAttendenceByEventId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendenceByEventId.fulfilled, (state, action) => {
        state.loading = false;
        state.verifiedUsersForEvent = action.payload;
      })
      .addCase(fetchAttendenceByEventId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAttendance } = eventSlice.actions;
export default eventSlice.reducer;
