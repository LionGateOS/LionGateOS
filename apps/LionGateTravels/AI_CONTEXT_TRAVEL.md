# LionGate Travel Module - Master Baseline (2026-02-04)

## Overview
This document serves as the "Save State" for the Travel Module. It contains the verified, hardened logic for the Unified Search Engine and the high-density layout.

## Current Working Version - Status: MASTER BASELINE
- **Singleton Script Fixed**: `FlightSearch.tsx` prevents duplicate injection.
- **Widget Placement**: Injected specifically into `containerRef`, not leaking to body.
- **Layout**: Tightened 60px min-height, unified dashboard feel.
- **Diagnostics**: "Light Check" and "Smart Shield" fully active.

---

### src/components/FlightSearch.tsx
```tsx
import React, { useEffect, useRef } from 'react';

/**
 * FlightSearch Component - HARDENED
 * Prevents duplicate script injection and cleans up ghost instances.
 */
export const FlightSearch: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Remove any old script instances from the body immediately
    const oldScript = document.getElementById('tp-widget-script');
    if (oldScript) oldScript.remove();

    // 2. Clear the container to prevent visual 'stacking'
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // 3. Create and inject the fresh script
    const script = document.createElement('script');
    script.id = 'tp-widget-script';
    script.src = "https://tpwgt.com/content?currency=usd&campaign_id=100&promo_id=7879&plain=true&no_labels=true&border_radius=17&color_focused=%2332a8dd&special=%23FFFFFFff&secondary=%23010101ff&light=%235D21AAfc&dark=%23262626&color_icons=%2332a8dd&color_button=%235618EAff&primary_override=%2332a8dd&searchUrl=www.aviasales.com%2Fsearch&locale=en&powered_by=true&show_hotels=true&shmarker=701220&trs=495278";
    script.async = true;
    script.charset = "utf-8";
    
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Cleanup: When the component unmounts, kill the script
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      const scriptToRemove = document.getElementById('tp-widget-script');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, []);

  return (
    <div className="w-full bg-[#161618] rounded-2xl overflow-hidden border border-white/5 shadow-2xl mb-0 p-0">
      <div ref={containerRef} className="tp-widget-wrapper min-h-[60px]" />
    </div>
  );
};
```

---

### src/App.tsx (Main Layout Section)
```tsx
        <main className="space-y-2">
          {/* Horizontal Search Matrix Bar - Priority Positioning */}
          <div className="mb-2">
            <SearchMatrix 
              onFilterChange={(newFilters) => setFilters(newFilters)} 
              filteredCount={filteredHotels.length}
              mode={mode}
            />
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-2">
            {/* Left Column - 8 cols */}
            <div className="col-span-8 space-y-2">
              <GlobalConnectivityHub />
              <RouteVisualizer />
              <ExpediaIntegration filters={filters} filteredHotels={filteredHotels} />
            </div>
            {/* ... */}
          </div>
        </main>
```
