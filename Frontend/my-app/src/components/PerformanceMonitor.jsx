import React, { useEffect, useState, useRef } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    scrollPerformance: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsRef = useRef(0);

  useEffect(() => {
    // FPS monitoring
    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / delta);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      requestAnimationFrame(measureFPS);
    };

    // Memory usage monitoring (if available)
    const measureMemory = () => {
      if (performance.memory) {
        const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1048576);
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memoryMB,
          fps: fpsRef.current
        }));
      }
    };

    // Scroll performance monitoring
    const handleScroll = () => {
      const startTime = performance.now();
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const scrollTime = endTime - startTime;
        setMetrics(prev => ({
          ...prev,
          scrollPerformance: Math.round(scrollTime * 100) / 100
        }));
      });
    };

    // Start monitoring
    measureFPS();
    const memoryInterval = setInterval(measureMemory, 2000);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(memoryInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle visibility with keyboard shortcut (Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-800/90 backdrop-blur border border-gray-700 rounded-lg p-4 text-white text-sm font-mono shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-purple-400 font-semibold">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={fpsRef.current >= 50 ? 'text-green-400' : fpsRef.current >= 30 ? 'text-yellow-400' : 'text-red-400'}>
            {fpsRef.current}
          </span>
        </div>

        {performance.memory && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className={metrics.memoryUsage < 50 ? 'text-green-400' : metrics.memoryUsage < 100 ? 'text-yellow-400' : 'text-red-400'}>
              {metrics.memoryUsage}MB
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Scroll:</span>
          <span className={metrics.scrollPerformance < 16 ? 'text-green-400' : metrics.scrollPerformance < 33 ? 'text-yellow-400' : 'text-red-400'}>
            {metrics.scrollPerformance}ms
          </span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;
