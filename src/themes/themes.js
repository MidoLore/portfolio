// particles: one effect or a list of them, e.g. "stars" or ["glyphs", "pixelsH"]
// effects: stars, leaves, rain, embers, pixelsH, pixelsV, pixelsUp, glyphs, none
export const DEFAULT_THEME = 'original';

export const THEMES = {
  original:  { particles: 'stars',  colors: { bg: '#0a0f1e', surface: '#001028', text: '#00ffc8', accent: '#00ffc8', accent2: '#ff3ea5' } },
  starfield: { particles: 'stars',  colors: { bg: '#081424', surface: '#0d1d33', text: '#cfe6ff', accent: '#4fb3ff', accent2: '#9fd8ff' } },
  forest:    { particles: 'leaves', colors: { bg: '#142116', surface: '#1b2c1d', text: '#d8ecd0', accent: '#7fc56b', accent2: '#c4e39a' } },
  terminal:  { particles: 'glyphs',   colors: { bg: '#050a05', surface: '#0a140a', text: '#b6ffb6', accent: '#33ff66', accent2: '#a0ffa0' } },
  retrowave: { particles: 'embers', colors: { bg: '#1a0b26', surface: '#261136', text: '#ffe3f5', accent: '#ff4d8d', accent2: '#ffb347' } },
  gameboy:   { particles: 'none',   colors: { bg: '#0f380f', surface: '#306230', text: '#9bbc0f', accent: '#9bbc0f', accent2: '#8bac0f' } },
  arcade:    { particles: ['stars', 'pixelsH'],  colors: { bg: '#101018', surface: '#1a1a28', text: '#f5f5ff', accent: '#ffe14d', accent2: '#ff4fa3' } },
  datastream: { particles: ['pixelsH', 'pixelsV'], colors: { bg: '#060b16', surface: '#0b1626', text: '#bfefff', accent: '#29d3ff', accent2: '#7b5cff' } },
  matrix:    { particles: ['glyphs'], colors: { bg: '#020602', surface: '#071207', text: '#7dff9a', accent: '#00ff41', accent2: '#00b32c' } },
  moss: { particles: 'flow', colors: { bg: '#1c1c1c', surface: '#151515', text: '#d6e8b0', accent: '#a8d84a', accent2: '#6f8f2f' } },
  paper:     { particles: 'none',   scheme: 'light', colors: { bg: '#f2efe6', surface: '#e4dfd0', text: '#1d1d1d', accent: '#e0475b', accent2: '#2f6fdf' } },
};