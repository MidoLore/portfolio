import { useEffect, useRef } from 'react';
import { useTheme } from '../themes/ThemeProvider';

/* ================= settings ================= */
const PX = 3;                        // size of one "pixel"
const GRID = 20;                     // matches the desktop grid (backgroundSize: '20px 20px')
const GLYPHS = '0123456789';         // characters used by the glyph (matrix) effect
const FONT = 13;
const MAX_FPS = 60;                  // set to 30 to halve the work on slow machines

// glyphs (matrix rain)
const RAIN_COUNT = 45;               // number of falling streams
const RAIN_LENGTH = [8, 22];         // trail length in cells
const RAIN_SPEED = [3, 8];           // frames per cell — lower = faster
const RAIN_FLICKER = 0.03;           // chance per frame that each trail character changes

// flow
const FLOW_COUNT = 150;              // number of nodes
const FLOW_SPEED = 1.1;              // px per frame
const FLOW_SCALE = 0.0028;           // swirl size — lower = bigger, lazier curves
const FLOW_PULL = 0.1;               // how hard nodes steer into the flow — lower = more separate roads
const FLOW_BIAS = 0.25;              // personal angle offset per node (radians) — higher = more spread
const FLOW_TRAIL = 30;               // trail length (points, one every 2 frames)

// solar system
const SOLAR_SPEED = 0.0006;          // orbit speed — higher = faster planets
const SOLAR_TILT = 0.38;             // orbit tilt (1 = seen from above, lower = flatter)
const SOLAR_CENTER = [0.5, 0.5];     // sun position as a fraction of the screen (keeps the icons clear)

/* ================= internals ================= */
const COLOR_KEYS = ['text', 'accent', 'accent2']; // theme colors effects can use
const TEXT = 0, ACCENT = 1, ACCENT2 = 2;
const LEVELS = 8;                    // opacity steps used for batching

const between = (r, [lo, hi]) => lo + r() * (hi - lo);
const randInt = (r, n) => (r() * n) | 0;

/* Collects everything drawn in a frame and draws it grouped by color + opacity,
   so the canvas switches state a few dozen times per frame instead of thousands. */
class Painter {
  constructor() {
    const buckets = () => COLOR_KEYS.map(() => Array.from({ length: LEVELS + 1 }, () => []));
    this.rects = buckets();
    this.sprites = buckets();
  }
  level(a) { return a <= 0.02 ? 0 : Math.min(LEVELS, Math.ceil(a * LEVELS)); }
  rect(ci, a, x, y, w, h) {
    const l = this.level(a);
    if (l) this.rects[ci][l].push(x | 0, y | 0, w, h);
  }
  glyph(ci, a, gi, x, y) {
    const l = this.level(a);
    if (l) this.sprites[ci][l].push(gi, x | 0, y | 0);
  }
  flush(ctx, colors, atlas) {
    for (let ci = 0; ci < COLOR_KEYS.length; ci++) {
      for (let l = 1; l <= LEVELS; l++) {
        const rects = this.rects[ci][l];
        if (rects.length) {
          ctx.globalAlpha = l / LEVELS;
          ctx.fillStyle = colors[COLOR_KEYS[ci]];
          ctx.beginPath();
          for (let i = 0; i < rects.length; i += 4) ctx.rect(rects[i], rects[i + 1], rects[i + 2], rects[i + 3]);
          ctx.fill();
          rects.length = 0;
        }
        const sprites = this.sprites[ci][l];
        if (sprites.length && atlas) {
          ctx.globalAlpha = l / LEVELS;
          const { canvas, cw, ch } = atlas;
          for (let i = 0; i < sprites.length; i += 3)
            ctx.drawImage(canvas, sprites[i] * cw, ci * ch, cw, ch, sprites[i + 1], sprites[i + 2], cw, ch);
          sprites.length = 0;
        }
      }
    }
  }
}

/* Pre-renders every glyph in every color once; drawing a sprite is much cheaper than fillText. */
function buildAtlas(colors) {
  const cw = Math.ceil(FONT * 0.7) + 2, ch = FONT + 4;
  const canvas = document.createElement('canvas');
  canvas.width = cw * GLYPHS.length;
  canvas.height = ch * COLOR_KEYS.length;
  const g = canvas.getContext('2d');
  g.font = `${FONT}px monospace`;
  g.textBaseline = 'top';
  COLOR_KEYS.forEach((key, ci) => {
    g.fillStyle = colors[key];
    [...GLYPHS].forEach((c, gi) => g.fillText(c, gi * cw + 1, ci * ch + 2));
  });
  return { canvas, cw, ch };
}

/* Smooth, slowly shifting direction (radians) for any point — the "wind" flow nodes follow */
const flowAngle = (x, y, t) =>
    (Math.sin(x * FLOW_SCALE + t * 0.0002) +
        Math.cos(y * FLOW_SCALE * 1.3 - t * 0.00015) +
        Math.sin((x - y) * FLOW_SCALE * 0.7 + t * 0.0001)) * Math.PI;

/* A pixel with a short fading trail, flying in direction (dx, dy) */
const flyer = (dx, dy) => ({
  count: 30, alpha: 0.85, colors: [ACCENT, ACCENT2, TEXT],
  spawn(w, h, r, initial) {
    const p = { v: 1.5 + r() * 4, trail: 3 + randInt(r, 5), s: r() < 0.8 ? PX : PX * 2 };
    if (dx) { p.x = initial ? r() * w : dx > 0 ? -PX * 20 : w + PX * 20; p.y = randInt(r, h / PX) * PX; }
    else    { p.y = initial ? r() * h : dy > 0 ? -PX * 20 : h + PX * 20; p.x = randInt(r, w / PX) * PX; }
    return p;
  },
  update(p, dt, w, h, t, r) {
    p.x += dx * p.v * dt;
    p.y += dy * p.v * dt;
    if (p.x > w + PX * 20 || p.x < -PX * 20 || p.y > h + PX * 20 || p.y < -PX * 20) Object.assign(p, this.spawn(w, h, r, false));
    return 1;
  },
  draw(p, a, painter) {
    for (let k = 0; k < p.trail; k++)
      painter.rect(p.ci, a * (1 - k / p.trail), p.x - dx * k * p.s, p.y - dy * k * p.s, p.s, p.s);
  },
});

/* Pixel-disc offsets (in PX blocks) for a given radius, cached */
const discCache = new Map();
function discBlocks(rad) {
  if (!discCache.has(rad)) {
    const out = [];
    for (let y = -rad; y <= rad; y++) for (let x = -rad; x <= rad; x++)
      if (x * x + y * y <= rad * rad + rad * 0.8) out.push(x, y);
    discCache.set(rad, out);
  }
  return discCache.get(rad);
}
const snap = (v) => Math.round(v / PX) * PX;

// orbit = fraction of the largest orbit, size = radius in pixel blocks
const PLANETS = [
  { orbit: 0.16, size: 1, color: '#b5b0a8' },                // mercury
  { orbit: 0.24, size: 2, color: '#e8c27a' },                // venus
  { orbit: 0.33, size: 3, color: '#4f9dff', moon: true },    // earth
  { orbit: 0.42, size: 2, color: '#e0603a' },                // mars
  { orbit: 0.58, size: 5, color: '#d9a066' },                // jupiter
  { orbit: 0.72, size: 4, color: '#e6d3a3', ring: true },    // saturn
  { orbit: 0.85, size: 3, color: '#7fd6e0' },                // uranus
  { orbit: 0.97, size: 3, color: '#4b6cff' },                // neptune
];

/* ================= effects =================
   Particle effects: spawn(w, h, rand, initial) → particle, update(p, dt, w, h, t, rand) → opacity,
   optional draw(p, opacity, painter) (default: a square).
   Custom effects (flow): init(w, h, rand) → state, update(state, dt, w, h), drawCtx(ctx, state, colors, alpha). */
const EFFECTS = {
  stars: {
    count: 120, alpha: 0.8, colors: [TEXT, ACCENT2],
    spawn: (w, h, r) => ({ x: r() * w, y: r() * h, s: r() < 0.85 ? PX : PX * 2, ph: r() * 6.28, v: 0.03 + r() * 0.06 }),
    update(p, dt, w, h, t) {
      p.x -= p.v * dt;
      if (p.x < -p.s) p.x = w;
      return 0.25 + 0.75 * Math.abs(Math.sin(t * 0.0012 + p.ph));
    },
  },

  leaves: {
    count: 40, alpha: 0.8, colors: [ACCENT, ACCENT2],
    spawn: (w, h, r, initial) => ({ x: r() * w, y: initial ? r() * h : -PX * 3, s: PX * (1 + randInt(r, 2)), ph: r() * 6.28, v: 0.3 + r() * 0.5 }),
    update(p, dt, w, h, t, r) {
      p.y += p.v * dt;
      p.x += Math.sin(t * 0.0015 + p.ph) * 0.5 * dt;
      if (p.y > h + PX * 3) { p.y = -PX * 3; p.x = r() * w; }
      return 1;
    },
  },

  rain: {
    count: 70, alpha: 0.45, colors: [ACCENT, TEXT],
    spawn: (w, h, r, initial) => ({ x: randInt(r, w / (PX * 4)) * PX * 4, y: initial ? r() * h : -PX * 8, s: PX, h: PX * (3 + randInt(r, 5)), v: 2 + r() * 3 }),
    update(p, dt, w, h, t, r) {
      p.y += p.v * dt;
      if (p.y > h) { p.y = -p.h; p.x = randInt(r, w / (PX * 4)) * PX * 4; }
      return 1;
    },
  },

  embers: {
    count: 50, alpha: 0.9, colors: [ACCENT, ACCENT2],
    spawn: (w, h, r, initial) => ({ x: r() * w, y: initial ? r() * h : h + PX, s: r() < 0.7 ? PX : PX * 2, ph: r() * 6.28, v: 0.3 + r() * 0.7 }),
    update(p, dt, w, h, t, r) {
      p.y -= p.v * dt;
      p.x += Math.sin(t * 0.002 + p.ph) * 0.3 * dt;
      if (p.y < -PX) { p.y = h + PX; p.x = r() * w; }
      return Math.min(1, p.y / h + 0.15);
    },
  },

  pixelsH: flyer(1, 0),
  pixelsV: flyer(0, 1),
  pixelsUp: flyer(0, -1),

  // Matrix-style digital rain: streams fall down the grid one cell at a time, the head
  // writes a new digit as it moves and the trail behind it fades out
  glyphs: {
    count: RAIN_COUNT, alpha: 0.8, colors: [ACCENT], usesGlyphs: true,
    spawn(w, h, r, initial) {
      const cols = Math.ceil(w / GRID), rows = Math.ceil(h / GRID);
      const len = Math.round(between(r, RAIN_LENGTH));
      const every = between(r, RAIN_SPEED);
      return {
        cols, rows, len, every, wait: r() * every,
        col: randInt(r, cols),
        head: initial ? randInt(r, rows + len) - len : -randInt(r, 15), // start above the top (staggered)
        chars: Array.from({ length: len }, () => randInt(r, GLYPHS.length)), // chars[0] = head
      };
    },
    update(p, dt, w, h, t, r) {
      if ((p.wait -= dt) <= 0) { // fall one cell; the head writes a fresh digit
        p.head++;
        p.chars.pop();
        p.chars.unshift(randInt(r, GLYPHS.length));
        p.wait += p.every;
      }
      for (let k = 1; k < p.chars.length; k++)
        if (r() < RAIN_FLICKER * dt) p.chars[k] = randInt(r, GLYPHS.length);
      if (p.head - p.len > p.rows) Object.assign(p, this.spawn(w, h, r, false)); // off screen → new stream
      return 1;
    },
    draw(p, a, painter) {
      const x = p.col * GRID + 4;
      for (let k = 0; k < p.len; k++) {
        const row = p.head - k;
        if (row < 0 || row >= p.rows) continue;
        if (k === 0) painter.glyph(TEXT, a, p.chars[0], x, row * GRID + 1); // bright head
        else painter.glyph(ACCENT, a * (1 - k / p.len), p.chars[k], x, row * GRID + 1);
      }
    },
  },

  // pixel-art solar system: a glowing sun, tilted dotted orbits and shaded planets
  solar: {
    custom: true, alpha: 1,
    init(w, h, r) {
      const cx = w * SOLAR_CENTER[0], cy = h * SOLAR_CENTER[1];
      const maxR = Math.min(w * 0.42, (h * 0.46) / SOLAR_TILT);
      const planets = PLANETS.map((pl) => ({ ...pl, R: pl.orbit * maxR, a: r() * Math.PI * 2, speed: SOLAR_SPEED / Math.pow(pl.orbit, 1.5), moonA: r() * 6.28 }));
      return { cx, cy, planets, t: 0 };
    },
    update(st, dt) {
      st.t += dt;
      for (const pl of st.planets) { pl.a += pl.speed * dt; pl.moonA += 0.04 * dt; }
    },
    drawCtx(ctx, st, colors, alpha) {
      const { cx, cy, planets } = st;
      const pos = (pl) => [cx + Math.cos(pl.a) * pl.R, cy + Math.sin(pl.a) * pl.R * SOLAR_TILT];

      // dotted orbits
      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = colors.accent2;
      ctx.beginPath();
      for (const pl of planets) {
        const dots = Math.max(30, Math.round(pl.R / 6));
        for (let k = 0; k < dots; k++) {
          const a = (k / dots) * Math.PI * 2;
          ctx.rect(snap(cx + Math.cos(a) * pl.R), snap(cy + Math.sin(a) * pl.R * SOLAR_TILT), 2, 2);
        }
      }
      ctx.fill();

      const drawPlanet = (pl) => {
        const [x0, y0] = pos(pl);
        const x = snap(x0), y = snap(y0), rad = pl.size;
        const blocks = discBlocks(rad);
        // body
        ctx.globalAlpha = alpha;
        ctx.fillStyle = pl.color;
        ctx.beginPath();
        for (let i = 0; i < blocks.length; i += 2) ctx.rect(x + blocks[i] * PX, y + blocks[i + 1] * PX, PX, PX);
        ctx.fill();
        // night side (facing away from the sun)
        const d = Math.hypot(cx - x, cy - y) || 1, ux = (cx - x) / d, uy = (cy - y) / d;
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        for (let i = 0; i < blocks.length; i += 2)
          if (blocks[i] * ux + blocks[i + 1] * uy < -0.15 * rad) ctx.rect(x + blocks[i] * PX, y + blocks[i + 1] * PX, PX, PX);
        ctx.fill();
        // saturn's ring
        if (pl.ring) {
          ctx.globalAlpha = alpha * 0.8;
          ctx.fillStyle = pl.color;
          ctx.beginPath();
          for (let k = 0; k < 28; k++) {
            const a = (k / 28) * Math.PI * 2;
            ctx.rect(snap(x + Math.cos(a) * (rad + 3) * PX), snap(y + Math.sin(a) * (rad + 3) * PX * 0.3), PX, PX);
          }
          ctx.fill();
        }
        // earth's moon
        if (pl.moon) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#cfcfcf';
          ctx.fillRect(snap(x + Math.cos(pl.moonA) * PX * 6), snap(y + Math.sin(pl.moonA) * PX * 6 * 0.5), PX, PX);
        }
      };

      // planets behind the sun first, then the sun, then the ones in front
      const behind = planets.filter((pl) => Math.sin(pl.a) < 0);
      const front = planets.filter((pl) => Math.sin(pl.a) >= 0);
      behind.forEach(drawPlanet);

      // sun: pulsing glow + core
      const pulse = 0.5 + 0.5 * Math.sin(st.t * 0.03);
      const sx = snap(cx), sy = snap(cy);
      [[16, 0.07 + pulse * 0.03], [12, 0.15 + pulse * 0.08], [9, 0.95]].forEach(([rad, a]) => {
        ctx.globalAlpha = alpha * a;
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        const blocks = discBlocks(rad);
        for (let i = 0; i < blocks.length; i += 2) ctx.rect(sx + blocks[i] * PX, sy + blocks[i + 1] * PX, PX, PX);
        ctx.fill();
      });
      ctx.globalAlpha = alpha * 0.6; // hot centre
      ctx.fillStyle = '#fff6d8';
      ctx.beginPath();
      const core = discBlocks(5);
      for (let i = 0; i < core.length; i += 2) ctx.rect(sx + core[i] * PX - PX, sy + core[i + 1] * PX - PX, PX, PX);
      ctx.fill();

      front.forEach(drawPlanet);
    },
  },

  // nodes drifting along a swirling flow field, each drawing its own fading trail
  flow: {
    custom: true, alpha: 0.55,
    init(w, h, r) {
      const spawn = () => {
        const x = r() * w, y = r() * h;
        return { x, y, a: r() * Math.PI * 2, bias: (r() * 2 - 1) * FLOW_BIAS, pts: [x, y], acc: 0, life: 150 + r() * 350, dying: false, c: r() < 0.75 ? 'accent' : 'accent2' };
      };
      return { spawn, nodes: Array.from({ length: FLOW_COUNT }, spawn), t: r() * 1e5 };
    },
    update(st, dt, w, h) {
      st.t += dt * 16.67;
      for (const n of st.nodes) {
        if (n.dying) { // shrink from the tail, then respawn
          n.pts.splice(0, 4);
          if (n.pts.length < 4) Object.assign(n, st.spawn());
          continue;
        }
        const target = flowAngle(n.x, n.y, st.t) + n.bias;
        n.a += Math.atan2(Math.sin(target - n.a), Math.cos(target - n.a)) * Math.min(1, FLOW_PULL * dt);
        n.x += Math.cos(n.a) * FLOW_SPEED * dt;
        n.y += Math.sin(n.a) * FLOW_SPEED * dt;
        // record a point every 2 frames; in between, just move the head
        if ((n.acc += dt) >= 2) { n.acc = 0; n.pts.push(n.x, n.y); if (n.pts.length > FLOW_TRAIL * 2) n.pts.splice(0, 2); }
        else { n.pts[n.pts.length - 2] = n.x; n.pts[n.pts.length - 1] = n.y; }
        n.life -= dt;
        if (n.life <= 0 || n.x < -20 || n.x > w + 20 || n.y < -20 || n.y > h + 20) n.dying = true;
      }
    },
    drawCtx(ctx, st, colors, alpha) {
      const BANDS = 3; // tail → head in 3 steps of rising opacity
      ctx.lineWidth = 1.2;
      for (const key of ['accent', 'accent2']) {
        ctx.strokeStyle = colors[key];
        for (let b = 0; b < BANDS; b++) {
          ctx.globalAlpha = alpha * ((b + 1) / BANDS);
          ctx.beginPath();
          for (const n of st.nodes) {
            if (n.c !== key) continue;
            const count = n.pts.length / 2;
            if (count < 2) continue;
            const from = Math.floor((b * (count - 1)) / BANDS);
            const to = Math.floor(((b + 1) * (count - 1)) / BANDS);
            if (to <= from) continue;
            ctx.moveTo(n.pts[from * 2], n.pts[from * 2 + 1]);
            for (let i = from + 1; i <= to; i++) ctx.lineTo(n.pts[i * 2], n.pts[i * 2 + 1]);
          }
          ctx.stroke();
        }
      }
    },
  },
};

/* ================= component ================= */
export default function ThemeBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  // a theme can use one effect ("stars") or several (["glyphs", "pixelsH"])
  const hasEffects = [].concat(theme.particles).some((name) => EFFECTS[name]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const list = [].concat(theme.particles).map((name) => EFFECTS[name]).filter(Boolean);
    if (!canvas || !list.length) return;

    const ctx = canvas.getContext('2d');
    const r = Math.random;
    const painter = new Painter();
    const atlas = list.some((fx) => fx.usesGlyphs) ? buildAtlas(theme.colors) : null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, last = 0, particles = [], systems = [];

    const seed = () => {
      particles = list.filter((fx) => !fx.custom).flatMap((fx) =>
          Array.from({ length: fx.count }, () => ({ ...fx.spawn(w, h, r, true), fx, ci: fx.colors[randInt(r, fx.colors.length)] })));
      systems = list.filter((fx) => fx.custom).map((fx) => ({ fx, state: fx.init(w, h, r) }));
    };

    const frame = (t) => {
      if (last && t - last < 1000 / MAX_FPS - 2) { raf = requestAnimationFrame(frame); return; } // fps cap
      const dt = last ? Math.min((t - last) / 16.67, 3) : 1; // 1 at 60 fps; same speed on any monitor
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const s of systems) {
        if (!reduceMotion) s.fx.update(s.state, dt, w, h);
        s.fx.drawCtx(ctx, s.state, theme.colors, s.fx.alpha);
      }
      for (const p of particles) {
        const fx = p.fx;
        const a = (reduceMotion ? 0.6 : fx.update(p, dt, w, h, t, r)) * fx.alpha;
        if (fx.draw) fx.draw(p, a, painter);
        else painter.rect(p.ci, a, p.x, p.y, p.s, p.h ?? p.s);
      }
      painter.flush(ctx, theme.colors, atlas);
      if (!reduceMotion) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const nw = canvas.clientWidth, nh = canvas.clientHeight;
      if (nw === w && nh === h) return; // ignore no-op resize callbacks
      w = canvas.width = nw;
      h = canvas.height = nh;
      seed();
      if (reduceMotion) frame(0);
    };

    resize();
    if (!reduceMotion) raf = requestAnimationFrame(frame);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, [theme]);

  if (!hasEffects) return null;

  return (
      <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ imageRendering: 'pixelated' }}
      />
  );
}