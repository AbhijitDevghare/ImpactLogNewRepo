import React from "react";

function RightSidebar() {
  return (
    <aside className="space-y-6">
      <div
        data-reveal
        className="rounded-2xl p-4 bg-gray-800/80 backdrop-blur border border-gray-700/60 shadow-xl hover:shadow-2xl transition"
      >
        <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-wide">
          Upcoming Community
        </h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>Neighborhood Clean-Up - Sun 20 Aug</li>
          <li>City Council Meeting - Tue 22 Aug</li>
          <li>Summer Music Fest - Sat 26 Aug</li>
        </ul>
      </div>

      <div
        data-reveal
        className="rounded-2xl p-4 bg-gray-800/80 backdrop-blur border border-gray-700/60 shadow-xl hover:shadow-2xl transition"
      >
        <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-wide">
          Connect with Others
        </h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>Engage with Us</li>
          <li>Local Connections</li>
          <li>Shared Rides</li>
        </ul>
      </div>
    </aside>
  );
}

export default RightSidebar;
