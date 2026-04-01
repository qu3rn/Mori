import { useEffect, useState } from 'react';

/**
 * Controls the loader visibility lifecycle.
 *
 * Waits for `window` load (all assets resolved) plus a minimum display
 * time so the animation always has room to breathe.
 *
 * Returns:
 *   visible -> true while the overlay should be rendered / playing its exit animation
 *   done    -> true once the overlay's CSS exit animation has fully completed
 *             (used by WeatherChip to start its own post-loader delay)
 */

const MIN_DISPLAY_MS = 1200;
/** Must match the `loader-exit` keyframe duration in global.css */
const OVERLAY_EXIT_MS = 700;

export function useLoader()
{
    const [visible, setVisible] = useState(true);
    const [done, setDone] = useState(false);

    useEffect(() =>
    {
        const start = performance.now();

        const dismiss = () =>
        {
            const elapsed = performance.now() - start;
            const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
            setTimeout(() => setVisible(false), remaining);
            // `done` fires after the overlay's CSS exit animation finishes
            setTimeout(() => setDone(true), remaining + OVERLAY_EXIT_MS);
        };

        if (document.readyState === 'complete')
        {
            dismiss();
        }
        else
        {
            window.addEventListener('load', dismiss, { once: true });
            return () => window.removeEventListener('load', dismiss);
        }
    }, []);

    return { visible, done };
}
