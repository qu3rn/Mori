import { useEffect, useRef } from 'react';
import { Application, Graphics } from 'pixi.js';

/**
 * PixiBackground
 *
 * A full-viewport canvas rendered by pixi.js, intended to sit behind your
 * landing-page content.  The canvas is absolutely-positioned and
 * pointer-events are disabled so it never blocks clicks on elements above it.
 *
 * ─────────────────────────────────────────────
 *  HOW TO CUSTOMISE
 * ─────────────────────────────────────────────
 *  • Replace the placeholder drawing inside the `draw` function with your
 *    own pixi.js scene (sprites, particles, shaders, tilings, etc.).
 *  • Add an `app.ticker.add(...)` callback for any animation you want to
 *    run every frame.
 *  • Pass props into this component (colours, speed, asset URLs, …) to make
 *    it configurable.
 * ─────────────────────────────────────────────
 */
export default function PixiBackground()
{
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() =>
  {
    const container = containerRef.current;

    if (!container)
    {
      return
    };

    const app = new Application();

    let running = true;
    let initialized = false;

    (async () =>
    {
      await app.init({
        resizeTo: window,
        backgroundAlpha: 0, // transparent – set a hex colour if you prefer
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio ?? 1,
      });

      initialized = true;

      if (!running || !containerRef.current)
      {
        app.destroy(true, true);
        return;
      }

      // ── Mount the canvas ──────────────────────────────────────────────
      app.canvas.style.position = 'absolute';
      app.canvas.style.inset = '0';
      app.canvas.style.pointerEvents = 'none';
      containerRef.current.appendChild(app.canvas);

      // ── TODO: build your scene here ──────────────────────────────────
      //
      // Example: a simple animated gradient circle so you can see it works.
      const circle = new Graphics();
      app.stage.addChild(circle);

      let time = 0;
      app.ticker.add(() =>
      {
        time += 0.02;
        const x = app.screen.width / 2 + Math.cos(time) * 120;
        const y = app.screen.height / 2 + Math.sin(time) * 60;
        const radius = 80 + Math.sin(time * 1.5) * 20;

        circle.clear();
        circle.circle(x, y, radius);
        circle.fill({ color: 0x7c3aed, alpha: 0.25 });
      });
      // ─────────────────────────────────────────────────────────────────
    })();

    return () =>
    {
      running = false;
      if (initialized)
      {
        app.destroy(true, true);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    />
  );
}
