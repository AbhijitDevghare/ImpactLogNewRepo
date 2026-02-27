import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../helpers/axiosInstance"
import axios from "axios";
import { authAxios, userAxios } from "../../helpers/axiosInstances";

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    role: localStorage.getItem('role') || "",
    data: localStorage.getItem('data') && localStorage.getItem('data') !== 'undefined' ? JSON.parse(localStorage.getItem('data')) : {},
    viewedUser: null,
    communities: [],
    loading: false,
    viewedUser: null,
    forgotPassword:{}
};


export const createAccount = createAsyncThunk("/auth/register", async (data) => {
    try {
        const res = authAxios.post("/register", data);
        toast.promise(res, {
            loading: "Wait! creating your account",
            success: (data) => {
                // console.log("RETURN DATA : ",data)
                return data?.data?.message;     // first data is basically a response
            },
            error: "Failed to create account"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
})


export const getUser = createAsyncThunk("/getUser", async (_, thunkAPI) => {
  try {
    const response = await userAxios.get("/profile", {
      withCredentials: true,
      redirect: "follow"
    });

    // console.log("response getUser",response);

    return response.data.data;
  } catch (error) {
    console.error("getUser failed", error);
  }
});



export const getCommunities = createAsyncThunk(
  "auth/getCommunities",
  async (_, thunkAPI) => {
    try {
      const response = await userAxios.get("/communities", {
        withCredentials: true,
      });
    //   console.log(response.data);
      return response.data.communities; // <- fix here
    } catch (error) {
      console.error("getCommunities failed", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);
export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = authAxios.post("/login", data);
        toast.promise(res, {
            loading: "Wait! authentication in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to log in"
        });
        // console.log("response login",res)
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});



export const adminLogin = createAsyncThunk("/auth/adminLogin", async (data) => {
    try {
        const res = authAxios.post("/admin/login", data);
        toast.promise(res, {
            loading: "Wait! authentication in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to log in"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        const res = authAxios.get("/logout");
        toast.promise(res, {
            loading: "Logging you out...",
            success: (resp) => resp?.data?.message || "Logged out",
            error: "Failed to log out",
        });
        
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Logout failed");
        throw error;
    }
});


export const updateProfile = createAsyncThunk("/updateProfile", async (data) => {
    try {
        // console.log(data)   
        const res = userAxios.put("/profile", data);
        toast.promise(res, {    
            loading: "Wait... Updating the profile",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to Update Profile"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});


// Forget Password
export const forgetPassword = createAsyncThunk("/auth/forgetPassword", async (email, { rejectWithValue }) => {
  try {
    const res = authAxios.post("/password/forgot/verifyEmail", { email });
    toast.promise(res, {
      loading: "Sending password reset email...",
      success: (data) => data?.data?.message || "Reset email sent!",
      error: "Failed to send reset email",
    });
    return (await res).data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Failed to send reset email";
    toast.error(message);
    return rejectWithValue(message);
  }
});

// Reset Password
export const resetPassword = createAsyncThunk("/auth/resetPassword", async ({ resetToken, newPassword }, { rejectWithValue }) => {
  try {
    const res = authAxios.put(`/password/ reset/${resetToken}`, { password: newPassword });
    toast.promise(res, {
      loading: "Resetting password...",
      success: (data) => data?.data?.message || "Password reset successful!",
      error: "Failed to reset password",
    });
    return (await res).data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Failed to reset password";
    toast.error(message);
    return rejectWithValue(message);
  }
});

// Send OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async ({ phoneNumber, email }, { rejectWithValue }) => {
    try {
      const response = await authAxios.post("/password/forgot/send-otp", {
        phoneNumber,
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "OTP send failed");
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ phoneNumber, email, otp, password }, { rejectWithValue }) => {
    try {
      const response = await authAxios.post("/password/reset/verify-otp", {
        phoneNumber,
        email,
        otp,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "OTP verification failed");
    }
  }
);


// Fetch user profile for viewing other users
export const fetchUserProfile = createAsyncThunk("/user/fetchProfile", async (userId) => {
    try {
        const res = userAxios.get(`/profile/${userId}`);
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch user profile");
        throw error;
    }
});

// Follow a user
export const followUser = createAsyncThunk("/users/follow", async (userId) => {
    try {
        const res = userAxios.post(`${userId}/follow`);
        toast.promise(res, {
            loading: "Following user...",
            success: (data) => data?.data?.message || "Successfully followed user",
            error: "Failed to follow user"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to follow user");
        throw error;
    }
});

// Unfollow a user
export const unfollowUser = createAsyncThunk("/user/unfollow", async (userId) => {
    try {
        const res = userAxios.delete(`${userId}/unfollow`);
        toast.promise(res, {
            loading: "Unfollowing user...",
            success: (data) => data?.data?.message || "Successfully unfollowed user",
            error: "Failed to unfollow user"
        });
        
        return (await res).data;
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "Failed to unfollow user");
        throw error;
    }
});


// Signup User
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authAxios.post('/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("SIGNUP REpsonse : ",response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAxios.post('/password/forgot/verify-email', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Email verification failed');
    }
  }
);



export const getUserWhenAppLoads = createAsyncThunk(
    'auth/getUserWhenAppLoads',
    async (_, thunkAPI) => {
        try {
            const response = await userAxios.get("/profile", {
                withCredentials: true,
                redirect: "follow"
            });
            return response.data.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Token expired → clear storage and update state
                localStorage.removeItem("data");
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("role");
                thunkAPI.dispatch(logout());
            }
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
       setForgotPasswordData: (state, action) => {
      state.forgotPassword = { ...state.forgotPassword, ...action.payload };
    },
    clearForgotPasswordData: (state) => {
      state.forgotPassword = {};
    },
    },
    extraReducers: (builder) => {
        builder
        .addCase(createAccount.fulfilled, (state, action) => {
            console.log(action)
            if(!action?.payload?.user)
                return
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role
        })
        .addCase(login.fulfilled, (state, action) => {
            console.log(action)
            if(!action?.payload?.user)
                return
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role
        })
        .addCase(adminLogin.fulfilled,(state,action)=>{
            if(!action?.payload?.user)
                return
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            
            console.log(action)
            if(action?.payload?.success)
            {
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                state.data = action?.payload?.user;
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));

            }
            // console.log(JSON.stringify(action))
        })
         .addCase(getUserWhenAppLoads.fulfilled, (state, action) => {
                if (!action?.payload?.user) return;
                localStorage.setItem("data", JSON.stringify(action.payload.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action.payload.user?.role);
                state.isLoggedIn = true;
                state.data = action.payload.user;
                state.role = action.payload.user?.role;
            })
            .addCase(getUserWhenAppLoads.rejected, (state) => {
                state.isLoggedIn = false;
                state.data = {};
                state.role = "";
            })
        .addCase(logout.fulfilled, (state, action) => {
            // Clear client auth state regardless of server response details
            try {
                localStorage.removeItem("data");
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("role");
            } catch (_) {}
            state.isLoggedIn = false;
            state.data = {};
            state.role = "";
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
            console.log("fetchProfileState  action : ",action)
            state.viewedUser = action.payload?.user || action.payload;
            console.log(state.viewedUser)
        })
        .addCase(fetchUserProfile.rejected, (state, action) => {
            state.viewedUser = null;
        })
        .addCase(followUser.fulfilled, (state, action) => {
            // Update the current user's following list
            if (state.data && action.payload?.success) {
                if (!state.data.following) state.data.following = [];
                if (!state.data.following.includes(action.meta.arg)) {
                    state.data.following.push(action.meta.arg);
                }
            }
        })
        .addCase(unfollowUser.fulfilled, (state, action) => {
            // Update the current user's following list
            if (state.data && action.payload?.success) {
                if (state.data.following) {
                    state.data.following = state.data.following.filter(id => id !== action.meta.arg);
                }
            }
        })
        
     .addCase(getCommunities.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload;
      })
      .addCase(getCommunities.rejected, (state) => {
        state.loading = false;
        state.communities = [];
      })
      .addCase(getUser.rejected,(state)=>{
        state.isLoggedIn=false;
        state.data=undefined;
        state.role=undefined;
      })
      .addCase(getUser.fulfilled,(state,action)=>{
         console.log("getUSer action : ",action)
            if(!action?.payload?.data?.user)
                return
            localStorage.setItem("data", JSON.stringify(action?.payload?.data?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.data?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.data?.user;
            state.role = action?.payload?.user?.data?.role
      })
    .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    }
});

export const { setForgotPasswordData, clearForgotPasswordData } = authSlice.actions;
// export const {} = authSlice.actions;
export default authSlice.reducer;