# LionGateOS Travels — Guide 03
## Hot / Dense / Urban Contrast (Canonical Guide Artifact)

**Artifact Type:** Destination Guide + Itinerary Template (Logic-Only)  
**Module:** LionGateOS Travels (Logic Processor)  
**Rendering / Storage / Monetization:** LionGateOS Core (System-of-Record)  
**Status:** Draft v1 (ready for content fill + testing)

---

## 0) Scope

This guide is designed for **hot-climate, high-density urban environments** where risk is primarily:
- heat exposure
- crowd density
- petty crime / scams
- transit complexity
- cultural / regulatory friction

This guide is **NOT** a city-specific article. It is a reusable **environment template** that Core can instantiate with a specific city.

---

## 1) Environment Profile

### 1.1 Environment Type
- **Climate:** Hot / humid / high UV
- **Density:** High (tourist zones + commuter corridors)
- **Mobility:** Mixed (walking + metro + ride-hail)
- **Typical patterns:** Midday heat peak, nightlife activity, congestion waves

### 1.2 User Modes
- **Fast-Transit Mode:** minimal stops, air-conditioned routing
- **Exploration Mode:** curated neighborhoods + food + culture
- **Safety-First Mode:** conservative schedule, vetted areas only
- **Budget Mode:** public transit + structured meal plan

---

## 2) Core Inputs Required (from LionGateOS Core)

Travels MUST NOT fetch data directly. Core provides snapshots.

### 2.1 Required Inputs
- **Destination Node:** city/region identifier
- **Travel Window:** dates (start/end), trip length
- **User Constraints:** mobility limits, dietary constraints, comfort level
- **Budget Envelope:** max daily spend target (optional)
- **Risk Profile:** low/medium/high tolerance

### 2.2 External Data Packets (Core-Fetched)
- weather snapshot (high/low, humidity, UV)
- safety advisory summary
- transit snapshot (operating hours, payment method)
- event density snapshot (holidays, festivals, known disruption days)

---

## 3) Outputs Produced (to Core only)

### 3.1 Artifacts
- `GUIDE_CONTENT_READY` — structured guide sections (Markdown/JSON)
- `PLAN_PROPOSAL_GENERATED` — itinerary nodes with constraints
- `RISK_ALERT_EMITTED` — heat/crowd/scam warnings with mitigations
- `AFFILIATE_LINK_PROPOSAL` — proposed services/gear/stays (no tracking)

---

## 4) Canonical Guide Structure (Rendered by Core)

### 4.1 Quick Read Summary
- one-paragraph overview
- who this destination-environment suits
- 3 biggest risks + mitigations

### 4.2 Do-First Checklist (Arrival)
- SIM/eSIM + offline maps
- transit card/app setup
- hydration + electrolytes plan
- heat strategy (midday indoor blocks)

### 4.3 Daily Rhythm Template (Hot Urban)
**Rule:** Avoid peak heat + peak crowd.
- **Morning (cooler):** outdoor walking, markets, scenic streets
- **Midday (heat peak):** museums, malls, cafes, rest
- **Late afternoon:** shaded parks, waterfronts, transit moves
- **Evening:** food + cultural nodes (with safety routing)

### 4.4 Safety Pattern (Urban)
- “phone discipline” rule
- safe-carry plan (front pocket / crossbody / minimal cash)
- ride-hail fallback thresholds (time, neighborhood, fatigue)
- scam categories (taxi, ATM, menu pricing, “helpful stranger”)

### 4.5 Heat Exposure Protocol
- hydration cadence
- sun protection defaults
- heat illness warning signs
- “stop conditions” (when to abort a node)

### 4.6 Transit Strategy
- primary: metro/bus
- secondary: walk corridors
- fallback: ride-hail
- **constraint:** avoid night walks through low-confidence zones

### 4.7 Food Strategy
- meal timing aligned to heat + energy
- safe water practices
- street food decision rules

---

## 5) Itinerary Artifact Template (Non-Temporal + Temporal-Optional)

Travels provides nodes. Calendar assigns times (via Core).

### 5.1 Node Types
- `AnchorNode` (must-do)
- `BufferNode` (cooldown / indoor)
- `ConnectorNode` (transit move)
- `RecoveryNode` (rest / medical / regroup)

### 5.2 Example Day Node Sequence (Hot Urban)
1. AnchorNode: early-market corridor (outdoor)
2. BufferNode: indoor museum / cafe (cooldown)
3. ConnectorNode: metro to second district
4. AnchorNode: cultural site (mixed indoor/outdoor)
5. RecoveryNode: hotel rest / hydration
6. AnchorNode: dinner neighborhood (vetted)
7. ConnectorNode: ride-hail back (late)

---

## 6) Risk Output Rules

### 6.1 Heat Risk Score (HRS)
- HRS = f(temp_high, humidity, UV, walking_duration, shade_access)
- Thresholds:
  - HRS >= 0.7 → emit `RISK_ALERT_EMITTED (Heat)`
  - HRS >= 0.85 → propose more BufferNodes and shorten outdoor segments

### 6.2 Crowd Risk Score (CRS)
- CRS = f(event_density, transit_load, tourist hotspots)
- CRS >= 0.7 → add connector alternatives and earlier start times

---

## 7) Monetization Handoff (Rule)

Travels may propose:
- accommodations categories (not bookings)
- city passes, transit cards
- travel insurance
- heat gear (hat, electrolyte, sunscreen)
- guided experiences

Travels MUST NOT:
- track clicks
- execute affiliate cookies
- process payments

---

## 8) Validation Checklist (for Core)

- [ ] All outputs are addressed to Core only
- [ ] No direct provider calls exist in this artifact
- [ ] Risk logic uses Core-provided data packets only
- [ ] Node sequence includes midday BufferNodes by default
- [ ] Affiliate proposals are optional and separated from planning

---

## 9) Versioning
- **Guide Version:** 0.1
- **Last Updated:** 2026-01-22
