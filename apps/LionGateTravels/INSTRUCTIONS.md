# LionGate Travel Module - AI Instruction Manifest

## Context
This module is the replacement for the existing travel site. It is currently in the "Bootstrap/Development" phase to secure Expedia Rapid API approval.

## The Search Matrix
- **Current State:** Contains UI elements (Price Range, Safety Score, Amenities, Neighborhood) that are currently static/non-functional.
- **Goal:** These must be "hooked up" to filter data (mock data for now, API data later).
- **Location:** Should be positioned as a horizontal bar at the top of the main content area for professional layout.

## Data Filtering Logic
Any AI assistant working on this project must ensure:
1. **Price Slider:** Filters results where `hotel.price <= sliderValue`.
2. **Safety Score:** Filters results where `hotel.safety_score >= sliderValue`.
3. **Amenities:** Toggle state (e.g., Wi-Fi, Pool) must match the boolean values in the result data.
4. **Provider:** Currently using Travelpayouts Widgets; transitioning to direct API integration.

## File Map (Priority)
- `src/App.tsx`: Main layout and Search Matrix positioning.
- `src/components/SearchMatrix.tsx`: UI for toggles and sliders.
- `src/data/mockResults.ts`: (To be created) The source for "Real-feeling" test data.

## Anti-Hallucination Guardrail
- Do not invent new components without checking the existing `LionGateOS` library.
- If a provider (like Booking.com) is declined, focus on making the UI "functional" with mock data to re-apply.