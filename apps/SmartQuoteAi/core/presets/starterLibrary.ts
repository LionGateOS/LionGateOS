import { PresetLibrary } from './types';

export const STARTER_PRESET_LIBRARY: PresetLibrary = {
  trades: [
    {
      id: 'trade-general-contractor',
      label: 'General Contractor',
      industryKey: 'General Construction',
      tradeName: 'General Contractor',
      defaultDetailLevel: 'detailed',
    },
    {
      id: 'trade-electrician-residential',
      label: 'Residential Electrician',
      industryKey: 'Electrical',
      tradeName: 'Electrician',
      defaultDetailLevel: 'detailed',
    },
    {
      id: 'trade-plumber-residential',
      label: 'Residential Plumber',
      industryKey: 'Plumbing & HVAC',
      tradeName: 'Plumber',
      defaultDetailLevel: 'detailed',
    },
    {
      id: 'trade-interior-painter',
      label: 'Interior Painter',
      industryKey: 'Finishing & Painting',
      tradeName: 'Painter',
    },
    {
      id: 'trade-roofer',
      label: 'Roofer',
      industryKey: 'Specialty',
      tradeName: 'Roofer',
    },
    {
      id: 'trade-landscaper',
      label: 'Landscaper',
      industryKey: 'Landscaping',
      tradeName: 'Landscaper',
    },
    {
      id: 'trade-flooring-installer',
      label: 'Flooring Installer',
      industryKey: 'Finishing & Painting',
      tradeName: 'Flooring Installer',
    },
    {
      id: 'trade-tiler',
      label: 'Tiler',
      industryKey: 'Finishing & Painting',
      tradeName: 'Tiler',
    },
    {
      id: 'trade-hvac-tech',
      label: 'HVAC Technician',
      industryKey: 'Plumbing & HVAC',
      tradeName: 'HVAC Technician',
    },
    {
      id: 'trade-handyman',
      label: 'Handyman',
      industryKey: 'General Construction',
      tradeName: 'Handyman',
      defaultDetailLevel: 'simple',
    },
  ],
  scopes: [
    {
      id: 'scope-interior-paint-room',
      label: 'Paint Interior Room',
      descriptionTemplate:
        'Prep, prime, and paint interior walls and trim for a standard room, including minor patching, masking, and cleanup.',
      recommendedTrade: 'Painter',
      typicalDurationHours: 8,
    },
    {
      id: 'scope-bathroom-remodel',
      label: 'Bathroom Remodel (Standard)',
      descriptionTemplate:
        'Full bathroom remodel including demolition, rough plumbing, rough electrical, waterproofing, tiling, fixtures, and finishing.',
      recommendedTrade: 'General Contractor',
      typicalDurationHours: 80,
    },
    {
      id: 'scope-roof-replacement',
      label: 'Asphalt Shingle Roof Replacement',
      descriptionTemplate:
        'Tear off existing asphalt shingles, inspect decking, install underlayment, flashings, and new asphalt shingles with ridge cap.',
      recommendedTrade: 'Roofer',
      typicalDurationHours: 40,
    },
    {
      id: 'scope-panel-upgrade',
      label: 'Electrical Panel Upgrade',
      descriptionTemplate:
        'Upgrade existing electrical panel to modern capacity, including permits, coordination with utility, labeling, and inspection.',
      recommendedTrade: 'Electrician',
      typicalDurationHours: 24,
    },
    {
      id: 'scope-landscape-refresh',
      label: 'Landscape Refresh',
      descriptionTemplate:
        'Refresh front-yard landscaping including light grading, soil amendment, plantings, edging, and mulch.',
      recommendedTrade: 'Landscaper',
      typicalDurationHours: 16,
    },
    {
      id: 'scope-flooring-install',
      label: 'Install Luxury Vinyl Plank Flooring',
      descriptionTemplate:
        'Remove existing flooring as needed, prep subfloor, and install luxury vinyl plank flooring with transitions and trim.',
      recommendedTrade: 'Flooring Installer',
      typicalDurationHours: 24,
    },
    {
      id: 'scope-kitchen-backsplash',
      label: 'Install Kitchen Backsplash',
      descriptionTemplate:
        'Install tile backsplash at kitchen counters including layout, cutting, setting, grouting, and caulking.',
      recommendedTrade: 'Tiler',
      typicalDurationHours: 12,
    },
    {
      id: 'scope-hvac-replacement',
      label: 'Replace Furnace and AC',
      descriptionTemplate:
        'Remove existing furnace and condenser, and install new matched furnace and AC system including startup and testing.',
      recommendedTrade: 'HVAC Technician',
      typicalDurationHours: 32,
    },
    {
      id: 'scope-basement-finish',
      label: 'Finish Basement (Standard)',
      descriptionTemplate:
        'Frame, insulate, drywall, and finish basement walls and ceilings, including basic electrical and doors/trim.',
      recommendedTrade: 'General Contractor',
      typicalDurationHours: 120,
    },
    {
      id: 'scope-small-handyman',
      label: 'Small Handyman Package',
      descriptionTemplate:
        'Bundle of small handyman tasks such as minor drywall repairs, caulking, hardware installs, and adjustments.',
      recommendedTrade: 'Handyman',
      typicalDurationHours: 6,
    },
    {
      id: 'scope-interior-repaint-whole',
      label: 'Repaint Interior – Whole Home',
      descriptionTemplate:
        'Repaint the interior of a typical single-family home including walls and trim in standard condition.',
      recommendedTrade: 'Painter',
      typicalDurationHours: 120,
    },
    {
      id: 'scope-kitchen-remodel',
      label: 'Kitchen Remodel (Standard)',
      descriptionTemplate:
        'Standard kitchen remodel including demolition, layout changes as needed, cabinets, counters, backsplash, lighting, and finishes.',
      recommendedTrade: 'General Contractor',
      typicalDurationHours: 160,
    },
  ],
  bundles: [
    {
      id: 'bundle-bathroom-refresh',
      label: 'Bathroom Refresh Bundle',
      descriptionTemplate:
        'Bundle estimate for a standard bathroom refresh including fixtures, finishes, and minor layout tweaks.',
      suggestedLineItems: [
        'Demolition and disposal',
        'Rough plumbing and valve replacements',
        'Rough electrical and GFCI protection',
        'Backer board and waterproofing',
        'Tile setting and grouting',
        'Vanity, toilet, and trim installations',
      ],
      scopePresetIds: ['scope-bathroom-remodel'],
      tradePresetIds: ['trade-general-contractor', 'trade-plumber-residential'],
    },
    {
      id: 'bundle-interior-paint-standard',
      label: 'Interior Repaint Bundle',
      descriptionTemplate:
        'Standard interior repaint bundle for walls and trim in good condition.',
      suggestedLineItems: [
        'Surface prep and masking',
        'Primer coat as required',
        'Finish coats (2x) on walls',
        'Trim and door finishing',
        'Cleanup and touch-ups',
      ],
      scopePresetIds: ['scope-interior-paint-room', 'scope-interior-repaint-whole'],
      tradePresetIds: ['trade-interior-painter'],
    },
    {
      id: 'bundle-kitchen-remodel-standard',
      label: 'Kitchen Remodel Bundle',
      descriptionTemplate:
        'Standard kitchen remodel bundle with cabinetry, counters, backsplash, and lighting.',
      suggestedLineItems: [
        'Demolition and disposal',
        'Cabinet installation',
        'Countertop fabrication and install',
        'Backsplash tiling and grout',
        'Lighting and electrical adjustments',
        'Appliance connections',
      ],
      scopePresetIds: ['scope-kitchen-remodel'],
      tradePresetIds: ['trade-general-contractor', 'trade-electrician-residential'],
    },
    {
      id: 'bundle-landscape-refresh',
      label: 'Landscape Refresh Bundle',
      descriptionTemplate:
        'Front-yard landscape refresh including prep, planting, and finishing touches.',
      suggestedLineItems: [
        'Removal of old plantings as needed',
        'Grading and soil preparation',
        'Planting of shrubs and perennials',
        'Edging and mulch installation',
        'Final cleanup and haul away',
      ],
      scopePresetIds: ['scope-landscape-refresh'],
      tradePresetIds: ['trade-landscaper'],
    },
    {
      id: 'bundle-flooring-whole-home',
      label: 'Whole-Home Flooring Bundle',
      descriptionTemplate:
        'Bundle for whole-home luxury vinyl plank flooring installation.',
      suggestedLineItems: [
        'Removal and disposal of existing flooring',
        'Subfloor prep and leveling',
        'Underlayment as required',
        'LVP installation',
        'Transitions and trim',
      ],
      scopePresetIds: ['scope-flooring-install'],
      tradePresetIds: ['trade-flooring-installer'],
    },
    {
      id: 'bundle-basement-finish',
      label: 'Basement Finish Bundle',
      descriptionTemplate:
        'Full basement finish bundle for a standard single-family home.',
      suggestedLineItems: [
        'Framing and layout',
        'Insulation and vapor barrier',
        'Drywall hanging and finishing',
        'Doors, trim, and hardware',
        'Prime and paint',
        'Basic electrical rough-in and trim-out',
      ],
      scopePresetIds: ['scope-basement-finish'],
      tradePresetIds: ['trade-general-contractor'],
    },
  ],
};
