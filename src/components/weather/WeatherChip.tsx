import type { CSSProperties } from 'react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useChipLifecycle } from '@/hooks/useChipLifecycle';
import { WEATHER_MESSAGES } from '@/utility/weatherMessages';

// ─── Fragment configs ──────────────────────────────────────────────────────────
// Each fragment is a tiny square that starts on the chip surface and scatters
// outward when the chip disintegrates. Positions are in px within the
// position:relative chip wrapper (chip ≈ 300 × 52 px).
//
// dx / dy: scatter vector  |  rot: end rotation in degrees
// orange: true = accent color, false = zinc-600
// delay: stagger in ms (0–100)

interface FragmentConfig
{
    x: number; y: number;
    dx: number; dy: number;
    rot: number; size: number;
    orange: boolean; delay: number;
}

const FRAGMENTS: FragmentConfig[] = [
    { x: 14, y: 6, dx: -34, dy: -28, rot: 135, size: 3, orange: false, delay: 0 },
    { x: 88, y: 5, dx: -6, dy: -38, rot: 72, size: 3, orange: false, delay: 35 },
    { x: 152, y: 8, dx: 4, dy: -40, rot: 200, size: 4, orange: true, delay: 15 },
    { x: 242, y: 5, dx: 36, dy: -22, rot: 155, size: 3, orange: false, delay: 55 },
    { x: 9, y: 25, dx: -40, dy: 6, rot: 88, size: 3, orange: false, delay: 75 },
    { x: 270, y: 23, dx: 38, dy: 8, rot: 172, size: 3, orange: false, delay: 25 },
    { x: 44, y: 44, dx: -22, dy: 32, rot: 215, size: 4, orange: false, delay: 50 },
    { x: 138, y: 46, dx: 2, dy: 34, rot: 110, size: 3, orange: true, delay: 10 },
    { x: 222, y: 44, dx: 26, dy: 28, rot: 180, size: 3, orange: false, delay: 65 },
    { x: 106, y: 20, dx: -8, dy: -16, rot: 52, size: 4, orange: false, delay: 88 },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props
{
    /** True once the loader overlay has fully faded out. */
    loaderDone: boolean;
}

/**
 * Bottom-right minimal weather chip.
 *
 * Shows a short weather-aware message after the loader closes.
 * Can be dismissed manually (×) or will auto-disintegrate after 3 s.
 *
 * Data fetching, lifecycle timing, and message mapping are each handled by
 * dedicated modules -> this component is assembly only.
 */
export default function WeatherChip({ loaderDone }: Props)
{
    const weather = useWeatherData();
    const dataReady = weather.status !== 'loading';

    const { phase, dismiss, pause, resume } = useChipLifecycle({ loaderDone, dataReady });

    if (phase === 'gone') return null;

    const message =
        weather.status === 'ready'
            ? WEATHER_MESSAGES[weather.condition]
            : null; // error state: still show chip but no message (fade in naturally)

    const temperature =
        weather.status === 'ready' ? weather.temperature : null;

    // ── Phase CSS class ──────────────────────────────────────────────────────────
    const phaseClass =
        phase === 'hidden' ? 'opacity-0 pointer-events-none' :
            phase === 'visible' ? 'wchip-enter' :
                phase === 'closing' ? 'wchip-exit-close' :
    /* disintegrating */        'wchip-disintegrate';

    return (
        <div
            className={`fixed bottom-6 right-6 z-40 ${phaseClass}`}
            aria-live="polite"
            aria-atomic="true"
            onMouseEnter={pause}
            onMouseLeave={resume}
        >
            {/* Relative wrapper so fragments position against the chip face */}
            <div className="relative" style={{ overflow: 'visible' }}>

                {/* ── Chip content ───────────────────────────────────────────────── */}
                <div className="
                    flex flex-col gap-1.5 px-4 py-3
                    bg-zinc-950/95 backdrop-blur-sm
                    border border-zinc-800/70 border-l-2 border-l-[#c8622a]/50
                    max-w-[300px]
                ">
                    {/* Header row */}
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[9px] font-mono tracking-[0.22em] text-zinc-600 uppercase select-none">
                            Wrocław{temperature !== null ? ` · ${temperature}°C` : ''}
                        </span>

                        <button
                            onClick={dismiss}
                            aria-label="Dismiss weather chip"
                            className="text-zinc-700 hover:text-zinc-400 transition-colors duration-150 shrink-0 -mr-0.5"
                        >
                            {/* Geometric × — consistent with the site's X motif */}
                            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                                <line x1="0" y1="0" x2="8" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
                                <line x1="8" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
                            </svg>
                        </button>
                    </div>

                    {/* Message */}
                    {message && (
                        <p className="text-[11px] font-mono text-zinc-400 leading-relaxed pr-1 select-none">
                            {message}
                        </p>
                    )}
                </div>

                {/* ── Disintegration fragments ─────────────────────────────────────
            Rendered only during the disintegrating phase. Each fragment is
            absolutely positioned at its starting location on the chip face
            and uses CSS custom properties for its scatter vector.         */}
                {phase === 'disintegrating' && FRAGMENTS.map((frag, i) => (
                    <div
                        key={i}
                        className="wchip-fragment"
                        style={{
                            position: 'absolute',
                            left: frag.x,
                            top: frag.y,
                            width: frag.size,
                            height: frag.size,
                            backgroundColor: frag.orange ? '#c8622a' : '#52525b',
                            animationDelay: `${frag.delay}ms`,
                            '--f-dx': `${frag.dx}px`,
                            '--f-dy': `${frag.dy}px`,
                            '--f-rot': `${frag.rot}deg`,
                        } as CSSProperties}
                    />
                ))}
            </div>
        </div>
    );
}
