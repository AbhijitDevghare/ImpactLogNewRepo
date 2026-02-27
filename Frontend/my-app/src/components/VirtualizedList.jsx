import React, { useState, useEffect, useRef, useMemo, memo } from 'react';

const VirtualizedList = memo(({
  items = [],
  itemHeight = 400,
  containerHeight = 600,
  renderItem,
  className = '',
  overscan = 5,
  onEndReached,
  endThreshold = 100
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeightState, setContainerHeightState] = useState(containerHeight);
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeightState / itemHeight);
    const end = Math.min(start + visibleCount + overscan, items.length);

    return {
      start: Math.max(0, start - overscan),
      end: end
    };
  }, [scrollTop, itemHeight, containerHeightState, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index,
      style: {
        position: 'absolute',
        top: (visibleRange.start + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, visibleRange, itemHeight]);

  // Handle scroll
  const handleScroll = (e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);

    // Check if we're near the end
    if (onEndReached && sentinelRef.current) {
      const { scrollHeight, scrollTop: currentScrollTop, clientHeight } = e.target;
      const distanceFromBottom = scrollHeight - currentScrollTop - clientHeight;

      if (distanceFromBottom < endThreshold) {
        onEndReached();
      }
    }
  };

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeightState(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Total height for the virtual container
  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, style }) => (
          <div key={item.id || index} style={style}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Sentinel for end detection */}
      {onEndReached && (
        <div
          ref={sentinelRef}
          style={{
            position: 'absolute',
            top: totalHeight - endThreshold,
            height: endThreshold,
            width: '100%'
          }}
        />
      )}
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

export default VirtualizedList;
