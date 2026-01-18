
import { Hammer, Zap, Droplets, PaintBucket, TreeDeciduous, Wrench } from 'lucide-react';
import React from 'react';

export const THEME_PALETTES: Record<string, string[]> = {
  // [Light (50-200), Main (300-700), Dark (800-950)]
  royal: ['#faf5ff', '#7e22ce', '#3b0764'],
  blue: ['#eff6ff', '#1d4ed8', '#172554'],
  eco: ['#f0fdf4', '#15803d', '#052e16'],
  industrial: ['#f8fafc', '#334155', '#0f172a'],
  crimson: ['#fef2f2', '#b91c1c', '#450a0a'],
  safety: ['#fffbeb', '#b45309', '#451a03'],
  ocean: ['#ecfeff', '#0e7490', '#083344'],
  midnight: ['#f5f3ff', '#4338ca', '#1e1b4b'],
  earth: ['#f7fee7', '#3f6212', '#1a2e05'],
  berry: ['#fdf2f8', '#db2777', '#831843'],
  sunset: ['#fff7ed', '#ea580c', '#7c2d12'],
  mint: ['#f0fdfa', '#0d9488', '#134e4a'],
};

export const THEME_COLORS_HEX: Record<string, string> = {
  royal: '#9333ea',
  blue: '#2563eb',
  eco: '#059669',
  industrial: '#475569',
  crimson: '#dc2626',
  safety: '#ca8a04',
  ocean: '#0891b2',
  midnight: '#312e81',
  earth: '#3f6212',
  berry: '#db2777',
  sunset: '#ea580c',
  mint: '#0d9488'
};

export const INDUSTRIES: Record<string, { color: string, trades: string[] }> = {
  "General Construction": { color: "bg-orange-50 text-orange-600", trades: ["General Contractor", "Handyman", "Demolition", "Drywaller", "Framer"] },
  "Electrical": { color: "bg-yellow-50 text-yellow-600", trades: ["Electrician", "Solar Installer", "Low Voltage", "Home Automation"] },
  "Plumbing & HVAC": { color: "bg-cyan-50 text-cyan-600", trades: ["Plumber", "HVAC Technician", "Pipefitter", "Gas Fitter"] },
  "Finishing & Painting": { color: "bg-purple-50 text-purple-600", trades: ["Painter", "Flooring Installer", "Tiler", "Cabinet Maker"] },
  "Landscaping": { color: "bg-green-50 text-green-600", trades: ["Landscaper", "Hardscaper", "Arborist", "Irrigation"] },
  "Specialty": { color: "bg-slate-50 text-slate-600", trades: ["Roofer", "Mason", "Welder", "Glazier", "Insulator"] }
};

export const US_STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "District of Columbia"];
export const CA_PROVINCES = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"];

export const US_TAX_RATES: Record<string, number> = {
  "Alabama": 4, "Alaska": 0, "Arizona": 5.6, "Arkansas": 6.5, "California": 7.25, "Colorado": 2.9, "Connecticut": 6.35, "Delaware": 0, "Florida": 6, "Georgia": 4, "Hawaii": 4, "Idaho": 6, "Illinois": 6.25, "Indiana": 7, "Iowa": 6, "Kansas": 6.5, "Kentucky": 6, "Louisiana": 4.45, "Maine": 5.5, "Maryland": 6, "Massachusetts": 6.25, "Michigan": 6, "Minnesota": 6.875, "Mississippi": 7, "Missouri": 4.225, "Montana": 0, "Nebraska": 5.5, "Nevada": 6.85, "New Hampshire": 0, "New Jersey": 6.625, "New Mexico": 5.125, "New York": 4, "North Carolina": 4.75, "North Dakota": 5, "Ohio": 5.75, "Oklahoma": 4.5, "Oregon": 0, "Pennsylvania": 6, "Rhode Island": 7, "South Carolina": 6, "South Dakota": 4.5, "Tennessee": 7, "Texas": 6.25, "Utah": 6.1, "Vermont": 6, "Virginia": 5.3, "Washington": 6.5, "West Virginia": 6, "Wisconsin": 5, "Wyoming": 4, "District of Columbia": 6
};

export const CA_TAX_RATES: Record<string, number> = {
  "Alberta": 5, "British Columbia": 12, "Manitoba": 12, "New Brunswick": 15, "Newfoundland and Labrador": 15, "Northwest Territories": 5, "Nova Scotia": 15, "Nunavut": 5, "Ontario": 13, "Prince Edward Island": 15, "Quebec": 14.975, "Saskatchewan": 11, "Yukon": 5
};
