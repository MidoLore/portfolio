import { useEffect, useRef } from 'react';
import { useTheme } from '../themes/ThemeProvider';

const PX = 3;                          // one "pixel"
const GLYPHS = '.,:;irsXAH2359G&@';    // light → dense, like ASCII art shading
const FONT = 13;

const pick = (r, str) => str[Math.floor(r() * str.length)];
const glyphLines = (r) =>
    Array.from({ length: 1 + Math.floor(r() * 3) }, () =>
        Array.from({ length: 1 + Math.floor(r() * 3) }, () => pick(r, GLYPHS)).join(''));

// Pixel with a short fading trail, flying in direction (dx, dy)
const flyer = (dx, dy, count) => ({
  count, alpha: 0.85, colors: ['accent', 'accent2', 'text'],
  spawn: (w, h, r, initial) => {
    const p = { v: 1.5 + r() * 4, trail: 3 + Math.floor(r() * 5), s: r() < 0.8 ? PX : PX * 2 };
    if (dx) { p.x = initial ? r() * w : dx > 0 ? -PX * 20 : w + PX * 20; p.y = Math.floor((r() * h) / PX) * PX; }
    else    { p.y = initial ? r() * h : dy > 0 ? -PX * 20 : h + PX * 20; p.x = Math.floor((r() * w) / PX) * PX; }
    return p;
  },
  step(p, w, h, t, r) {
    p.x += dx * p.v;
    p.y += dy * p.v;
    const out = p.x > w + PX * 20 || p.x < -PX * 20 || p.y > h + PX * 20 || p.y < -PX * 20;
    if (out) Object.assign(p, this.spawn(w, h, r, false));
    return 1;
  },
  render(ctx, p, alpha) {
    for (let k = 0; k < p.trail; k++) {
      ctx.globalAlpha = alpha * (1 - k / p.trail);
      ctx.fillRect(Math.round(p.x - dx * k * p.s), Math.round(p.y - dy * k * p.s), p.s, p.s);
    }
  },
});

// spawn(w, h, rand, initial) -> particle; step(p, w, h, t, rand) moves p and returns alpha;
// optional render(ctx, p, alpha) draws it (default: a square)
const EFFECTS = {
  stars: {
    count: 120, alpha: 0.8, colors: ['text', 'accent2'],
    spawn: (w, h, r) => ({ x: r() * w, y: r() * h, s: r() < 0.85 ? PX : PX * 2, ph: r() * 6.28, v: 0.03 + r() * 0.06 }),
    step: (p, w, h, t) => {
      p.x -= p.v;
      if (p.x < -p.s) p.x = w;
      return 0.25 + 0.75 * Math.abs(Math.sin(t * 0.0012 + p.ph));
    },
  },
  leaves: {
    count: 40, alpha: 0.8, colors: ['accent', 'accent2'],
    spawn: (w, h, r, initial) => ({ x: r() * w, y: initial ? r() * h : -PX * 3, s: PX * (1 + Math.floor(r() * 2)), ph: r() * 6.28, v: 0.3 + r() * 0.5 }),
    step: (p, w, h, t, r) => {
      p.y += p.v;
      p.x += Math.sin(t * 0.0015 + p.ph) * 0.5;
      if (p.y > h + PX * 3) { p.y = -PX * 3; p.x = r() * w; }
      return 1;
    },
  },
  rain: {
    count: 70, alpha: 0.45, colors: ['accent', 'text'],
    spawn: (w, h, r, initial) => ({ x: Math.floor((r() * w) / (PX * 4)) * PX * 4, y: initial ? r() * h : -PX * 8, s: PX, h: PX * (3 + Math.floor(r() * 5)), v: 2 + r() * 3 }),
    step: (p, w, h, t, r) => {
      p.y += p.v;
      if (p.y > h) { p.y = -p.h; p.x = Math.floor((r() * w) / (PX * 4)) * PX * 4; }
      return 1;
    },
  },
  embers: {
    count: 50, alpha: 0.9, colors: ['accent', 'accent2'],
    spawn: (w, h, r, initial) => ({ x: r() * w, y: initial ? r() * h : h + PX, s: r() < 0.7 ? PX : PX * 2, ph: r() * 6.28, v: 0.3 + r() * 0.7 }),
    step: (p, w, h, t, r) => {
      p.y -= p.v;
      p.x += Math.sin(t * 0.002 + p.ph) * 0.3;
      if (p.y < -PX) { p.y = h + PX; p.x = r() * w; }
      return Math.min(1, p.y / h + 0.15);
    },
  },

  // pixels zipping sideways / up / down
  pixelsH:    flyer(1, 0, 30),
  pixelsV:    flyer(0, 1, 30),
  pixelsUp:   flyer(0, -1, 30),

  // little clusters of random characters that fade in, flicker and fade out
  glyphs: {
    count: 70, alpha: 0.7, colors: ['accent', 'text'],
    spawn: (w, h, r, initial) => {
      const max = 180 + r() * 300; // lifetime in frames
      return { x: Math.floor(r() * w), y: Math.floor(r() * h), lines: glyphLines(r), life: initial ? r() * max : 0, max };
    },
    step(p, w, h, t, r) {
      p.life++;
      if (r() < 0.04) { // flicker: swap one character
        const i = Math.floor(r() * p.lines.length);
        const line = p.lines[i];
        const j = Math.floor(r() * line.length);
        p.lines[i] = line.slice(0, j) + pick(r, GLYPHS) + line.slice(j + 1);
      }
      if (p.life > p.max) Object.assign(p, this.spawn(w, h, r, false));
      return Math.sin((Math.PI * p.life) / p.max); // fade in → out
    },
    render(ctx, p, alpha) {
      ctx.globalAlpha = alpha;
      ctx.font = `${FONT}px monospace`;
      p.lines.forEach((line, i) => ctx.fillText(line, p.x, p.y + i * FONT));
    },
  },
};

export default function ThemeBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  // a theme can use one effect ("stars") or several (["glyphs", "pixelsH"])
  const effects = [].concat(theme.particles).filter((name) => EFFECTS[name]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fxList = [].concat(theme.particles).map((name) => EFFECTS[name]).filter(Boolean);
    if (!fxList.length || !canvas) return;

    const ctx = canvas.getContext('2d');
    const r = Math.random;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, particles = [];

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const fx = p.fx;
        const a = Math.max(0, reduceMotion ? 0.6 : fx.step(p, w, h, t, r)) * fx.alpha;
        ctx.fillStyle = theme.colors[p.c];
        if (fx.render) fx.render(ctx, p, a);
        else {
          ctx.globalAlpha = a;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.h ?? p.s);
        }
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      w = canvas.width = canvas.clientWidth;
      h = canvas.height = canvas.clientHeight;
      if (reduceMotion) draw(0);
    };

    resize();
    particles = fxList.flatMap((fx) =>
        Array.from({ length: fx.count }, () => ({ ...fx.spawn(w, h, r, true), fx, c: fx.colors[Math.floor(r() * fx.colors.length)] })));
    raf = requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, [theme]);

  if (!effects.length) return null;

  return (
      <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ imageRendering: 'pixelated' }}
      />
  );
}
