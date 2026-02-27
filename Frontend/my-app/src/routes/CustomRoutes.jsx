import { Routes, Route } from "react-router-dom";
import HomeLayout from "../layout/MainLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import { useSelector } from "react-redux";
import EventPage from "../pages/EventsPage";
import MyProfilePage from "../pages/MyProfilePage";
import HomePage from "../pages/HomePage";
import ViewProfile from "../pages/ViewProfile";
import Create from "../pages/Create";
import MainLayout from "../layout/MainLayout";
import HelpPage from "../pages/HelpPage";
import CommunityPage from "../pages/CommunityPage";
import ChatPage from "../pages/ChatPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import OtpVerificationPage from "../pages/OtpVerificationPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import EventPreview from "../components/EventPreview";
import PublishedEventsPage from "../pages/PublishedEventsPage";
import RegisteredUsersPage from "../pages/RegisteredUsersPage";
import EditEventPage from "../pages/EditEventPage";
import PastEventsList from "../pages/PastEventsList";
import CompletedEventsPage from "../pages/CompletedEventsPage";
import QRScanner from '../pages/QRScanner';

function CustomeRoutes() {
    
  const { isLoggedIn} = useSelector((state) => state?.auth);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />   
        <Route path={`/profile/:id`} element={<MyProfilePage />} />
      <Route path="/events" element={<EventPage/>}/>
      <Route path="/viewprofile/:userId" element={<ViewProfile />} />
      <Route path="/help" element={<HelpPage/>  }/>
      <Route path="/create" element={<MainLayout><Create/></MainLayout>}/>
      {/* ✅ conditional route */}
      {isLoggedIn && <Route path="/app" element={<HomePage />} />}

      <Route path="/communities" element={<CommunityPage/>}/>
      <Route path="/chats" element={<ChatPage/>}/>
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/otp-verification" element={<OtpVerificationPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      <Route path="/event-preview" element={<EventPreview />} />
      <Route path="/published-events" element={<MainLayout><PublishedEventsPage/></MainLayout>} />
        <Route path="/event/:eventId/registereduser" element={<MainLayout><RegisteredUsersPage /></MainLayout>} />
    <Route path="/edit-event/:id" element={<MainLayout><EditEventPage/></MainLayout>}/>
    <Route path="/past-events" element={<MainLayout><PastEventsList/></MainLayout>}/>

      <Route path="/completed-events" element={<MainLayout>
        <CompletedEventsPage/>
      </MainLayout>}/>  
      <Route path="/chat/:conversationId?" element={<ChatPage />} />
      <Route path="/event/:eventId/registereduser" element={<MainLayout><RegisteredUsersPage/></MainLayout>}/>
      <Route path="/qr-scanner" element={<QRScanner />} />
    </Routes>
  );
}

export default CustomeRoutes;
