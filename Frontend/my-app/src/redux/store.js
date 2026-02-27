import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "../redux/slices/AuthSlice"
import postReducer from "../redux/slices/PostSlice"
import rewardsBadgesReducer from "../redux/slices/RewardsBadgesSlice"
import eventReducer from "../redux/slices/EventSlice"
import chatReducer from './slices/ChatSlice';
import verificationReducer from './slices/VerificationSlice';

const store = configureStore({
    reducer:{
        auth:AuthReducer ,
        posts:postReducer,
        rewardsBadges:rewardsBadgesReducer,
        event:eventReducer,
        chat: chatReducer,
        verification: verificationReducer,
    },
    devTools:true
})
//   const viewedUser = useSelector((state) => state?.auth?.viewedUser ?? null);
//   const points = useSelector((state) => state?.rewardsBadges?.userPoints ?? 0);
//   const badges = useSelector((state) => state?.rewardsBadges?.userBadges ?? []);
//   const registeredEvents = useSelector((state) => state?.event?.upcomingEvents ?? []);
//   const attendedEvents = useSelector((state) => state?.event?.attendedEvents ?? []);

export default store