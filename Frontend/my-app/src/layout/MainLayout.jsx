import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import HomeSideBar from "../components/HomeSideBar";
import useScrollReveal from "./useScrollReveal";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import PerformanceMonitor from "../components/PerformanceMonitor";
import ImpactLogLogo from "../assets/Header.png";

function MainLayout({ children }) {
  useScrollReveal();
  useSmoothScroll();
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const panelRef = useRef(null);

  const toggleDrawer = (state) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setOpen(state);
    setTimeout(() => setIsProcessing(false), 250);
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && toggleDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { if (open) toggleDrawer(false); }, [location.pathname]);
  useEffect(() => { document.documentElement.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <div className="relative min-h-screen w-full font-sans text-white bg-gray-900 overflow-x-hidden">
      {/* Performance optimized background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          // Optimize background rendering
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64
        bg-gray-800/80 backdrop-blur border-r border-gray-700/60 shadow-lg
        px-6 py-8 overflow-y-auto z-30 rounded-r-2xl">
        <HomeSideBar />
      </aside>

      {/* Mobile Topbar */}
      <header className="md:hidden sticky top-0 left-0 right-0 z-50
        bg-gray-800/90 backdrop-blur border-b border-gray-700/60 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            aria-label="Open sidebar"
            onClick={() => toggleDrawer(true)}
            className="inline-flex items-center justify-center h-10 w-10
              rounded-md hover:bg-purple-900/40 transition-all duration-200 border border-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
              fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/>
            </svg>
          </button>
          {/* <img src={ImpactLogLogo} alt="ImpactLog" className="h-32 " /> */}
<p className="text-2xl md:text-1xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 tracking-wide text-center h-12 flex items-center justify-center select-none">
  ImpactLog
</p>
          <div className="w-10" />
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div
          onClick={() => toggleDrawer(false)}
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40
            ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        />
        {/* Panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          className={`fixed top-0 left-0 bottom-0 w-72 max-w-[80vw] z-50
          bg-gray-800/90 backdrop-blur border-r border-gray-700/60 shadow-lg rounded-r-2xl
          transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-end px-4 py-4 border-b border-gray-700/60 sticky top-0 z-10 bg-gray-800/90 backdrop-blur">
            <button
              onClick={() => toggleDrawer(false)}
              aria-label="Close menu"
              className="h-9 w-9 flex items-center justify-center rounded-md
                hover:bg-purple-900/40 border border-gray-700 transition"
            >
              ✕
            </button>
          </div>
          <div className="px-4 py-6">
            <HomeSideBar onNavigate={() => toggleDrawer(false)} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`relative z-10 md:ml-64 px-4 sm:px-8 py-10 ${open ? "pointer-events-none select-none" : ""}`}>
        <div className="mx-auto max-w-7xl animate-fadeIn">{children}</div>
      </main>

      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Enhanced Styles */}
      <style>{`
        /* Smooth fade-in animation */
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }

        /* Glassmorphism backdrop effect */
        .backdrop-blur {
          backdrop-filter: blur(12px);
        }

        /* Buttons hover glow */
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(139, 92, 246, 0.2);
        }

        /* Transition utilities */
        .transition-all {
          transition: all 0.3s ease;
        }
        .transition-opacity {
          transition: opacity: 0.3s ease;
        }

        /* Rounded utilities */
        .rounded-r-2xl {
          border-top-right-radius: 1rem;
          border-bottom-right-radius: 1.5rem;
        }

        /* Purple hover */
        .hover\\:bg-purple-900\\/40:hover {
          background-color: rgba(139, 92, 246, 0.4);
        }

        /* Performance optimizations */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Optimize scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #9333ea, #4f46e5);
        }

        /* Optimize for GPU acceleration */
        .gpu-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Reduce paint on hover */
        button, a {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}

export default MainLayout;