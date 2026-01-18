# SmartQuoteAi Pro – Proposal Module Specification
Version: 1.0
Status: Approved architecture for Phase 5 implementation

## 1. Overview

The Proposal module in SmartQuoteAi Pro is responsible for generating client-ready proposals that stay in sync with the estimator and scope modules, while presenting content in a clean, professional, export-friendly layout.

This document defines the content model, layout, and behavior of the Proposal workspace. It is the source of truth for Phase 5 (Proposal Shell Integration) and future phases that extend proposal functionality.

## 2. High-level Goals

- Two-column Hybrid Shell layout (editor left, live preview right)
- White-card proposal preview styled to match real client documents
- Reusable, modular proposal sections (template-friendly)
- Direct linkage to estimator pricing and scope summaries
- Foundation for AI writing assistants and export engines
- Consistency with LionGateOS and NeonShell v2.2 visual language

## 3. Data Model

Each proposal is represented conceptually as:

- metadata: Proposal-level details (client, project, identifiers)
- summary: Executive summary text
- sections: A list of structured proposal sections
- pricing: Aggregated pricing information from the estimator
- legal: Terms and conditions text
- attachments: A list of external references (files, images, URLs)

This is an internal conceptual model and does not impose a specific storage format yet.

### 3.1 Metadata Fields

Mandatory / core fields:

- ProposalTitle
- ClientName
- ClientAddress
- ClientPhone
- ClientEmail
- ProjectAddress
- DatePrepared
- PreparedBy
- ProposalNumber
- RevisionNumber
- LinkedEstimateId (reference to estimator draft or job)

The UI should allow adding optional custom metadata fields in later phases.

### 3.2 Summary

- Single rich-text block used for the Executive Summary section.
- Intended for AI rewriting and tone adjustments in future phases.

### 3.3 Sections

Each proposal section has:

- id (internal)
- title (display name)
- body (rich-text content)
- order (for sorting)
- flags (reserved for future behaviors, e.g., “optional”, “internal-only”)

Recommended default sections:

1. Project Understanding
2. Work Breakdown
3. Materials & Finishes
4. Site Preparation & Cleanup
5. Warranty Information
6. Project Timeline
7. Payment Schedule

### 3.4 Pricing

This area is primarily derived from the estimator module and is read-only in the Proposal UI (editable at the estimator layer).

Fields (subject to estimator model):

- BaseCost
- WasteAndHandling
- OverheadAllocation
- Margin
- Tax
- ClientPriceEstimate
- PaymentScheduleSummary (may mirror a section)

### 3.5 Legal

- Rich-text block containing terms and conditions.
- May be replaced or extended by templates.
- Must support standard contractor clauses (liability, change orders, delays, warranty, etc.).

### 3.6 Attachments

Attachment model is reserved for later implementation:

- type (image, pdf, url, note)
- label
- reference (path/URL)

The current phase needs only to reserve UI space for attachments in the preview.

## 4. Layout & UX – Universal Hybrid Shell

The Proposal workspace runs inside the Universal Hybrid Shell, sharing the same topbar, sidebar, and workspace geometry as the Estimate module.

### 4.1 Overall Layout

- Shell: Universal Hybrid Shell · NeonShell v2.2
- Background: Dark navy gradient with subtle circuitry
- Workspace: Central frosted sheet with neon-blue edge accent

Two-column layout:

- Left: Proposal Editor (input)
- Right: Live Proposal Preview (output)
- Columns scroll independently.

### 4.2 Left Column – Editor Panels

The left column uses accordion-style panels (only one or a few open at a time).

Panels:

1. Metadata
2. Executive Summary
3. Sections – Prebuilt and custom
4. Pricing Summary (read-only from estimator)
5. Legal & Terms
6. Attachments (placeholder for future behavior)

Each panel:

- Uses dark frosted cards with rounded corners
- Uses NeonShell focus outlines and hover states
- Contains labeled form controls and rich-text editors where appropriate

#### 4.2.1 Metadata Panel

- Text fields for all core metadata fields.
- Basic validation (e.g., not empty for key fields).
- Changes instantly sync to the preview header.

#### 4.2.2 Executive Summary Panel

- Multi-line rich-text editor.
- Reserved toolbar area for AI tools in future phases (e.g., “Rewrite”, “Shorten”).

#### 4.2.3 Sections Panel

- List of existing sections displayed with drag-and-drop order in later phases.
- Controls:
  - Add Section
  - Remove Section
  - Rename Section
- Editing a section opens a body editor for that section.

#### 4.2.4 Pricing Summary Panel

- Displays totals from the estimator (read-only).
- Includes a link or reference stating “Edit in Estimate module” rather than editing locally.

#### 4.2.5 Legal & Terms Panel

- Single rich-text editor for terms and conditions.
- May be pre-populated from templates in future phases.

#### 4.2.6 Attachments Panel

- Placeholder for listing attachments.
- May simply show a message like “Attachment management will be added in a future release” in current phases.

### 4.3 Right Column – Live Proposal Preview

The right column displays a client-ready preview using white cards with subtle neon-blue halo.

#### 4.3.1 Preview Structure

Order of blocks:

1. Proposal Header
2. Executive Summary
3. Scope / Work Summary
4. Detailed Sections
5. Pricing Summary
6. Legal Terms
7. Attachments

All blocks share:

- White card background
- Rounded radius consistent with NeonShell
- Soft Electric Halo blue outer glow
- Adequate padding and line height for readability

#### 4.3.2 Proposal Header Card

Displays:

- Company name (placeholder or from settings)
- Proposal title
- Client name and address
- Project address
- Date prepared
- Prepared by
- Proposal number and revision

#### 4.3.3 Executive Summary Card

- Shows the Executive Summary content as a single formatted section.

#### 4.3.4 Scope / Work Summary Card

- Presents a summarized scope of work based on sections and/or a dedicated field.
- Supports bullet lists and formatted paragraphs.

#### 4.3.5 Detailed Sections Cards

Each section becomes its own card:

- Section title
- Section body text

#### 4.3.6 Pricing Summary Card

- Presents the key totals and payment schedule.
- Matches the estimator numbers but in a client-friendly layout.

#### 4.3.7 Legal Terms Card

- Renders the full terms and conditions content.

#### 4.3.8 Attachments Area

- Shows labels for attached items or a placeholder note if none.

## 5. Shell & Theme Integration

The Proposal module must:

- Use the same topbar as Estimate, with appropriate title text:
  - “SMARTQUOTEAI PRO · Universal Hybrid Shell · NeonShell v2.2”
- Highlight the Proposal tab in the shell sidebar.
- Respect all NeonShell v2.2 design rules:
  - Electric Halo blue glows
  - White cards for client-facing sections
  - Dark navy backgrounds and frosted surfaces
  - Gate-inspired radii

## 6. Future Phases (Reserved Hooks)

The following capabilities are not implemented in the initial Proposal Shell phase, but the design reserves space and structure for them:

- AI Proposal Writer tools for each text block
- Proposal template packs
- PDF and DOCX export
- Proposal revision history
- Multi-theme support and branding variations
- Per-section visibility flags (internal vs client-facing)

## 7. Implementation Notes

- Initial implementation can store proposal state in memory or in a simple client-side structure.
- Data wiring to the estimator and scope modules can begin with readonly references and progress incrementally.
- The primary goal of the first Proposal Shell phase is to establish:
  - Stable layout
  - Consistent styling
  - Predictable data model
  - A preview that closely resembles the eventual exported document.

---

This document should be placed under a docs or architecture path in the repository, for example:

- docs/proposal-module-spec.md
