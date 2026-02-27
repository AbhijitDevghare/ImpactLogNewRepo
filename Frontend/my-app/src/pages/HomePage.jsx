import React from "react";
import MainLayout from "../layout/MainLayout";
import MainFeed from "../components/MainFeed";
import RightSidebar from "../components/RightSidebar";

function HomePage() {
  return (
    <MainLayout>
      <div className="grid grid-cols-12 gap-8">
        {/* Feed */}
        <div className="col-span-12 lg:col-span-8">
          <MainFeed />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block col-span-4">
          <RightSidebar />
        </div>
      </div>
    </MainLayout>
  );
}

export default HomePage;
