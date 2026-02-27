// src/routes/OtherRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import isCommunityOrOrg from "../helpers/isCommunityOrOrg";
import CreateEvents from "../pages/CreateEvent";
import UnpublishedEventsPage from "../pages/UnpublishedEventsPage";
import MainLayout from "../layout/MainLayout";

function OtherRoutes() {
  const { role } = useSelector((state) => state?.auth);

  return (
    <Routes>
      {role && isCommunityOrOrg(role) && (
        <>
          <Route
            path="/create-events"
            element={<CreateEvents />}
          />
          <Route
            path="/publish-events"
            element={
              <MainLayout>
                <UnpublishedEventsPage />
              </MainLayout>
            }
          />
        </>
      )}
    </Routes>
  );
}

export default OtherRoutes;
