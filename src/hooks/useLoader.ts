import { useEffect, useState } from 'react';

/**
 * Controls the loader visibility lifecycle.
 *
 * Waits for `window` load (all assets resolved) plus a minimum display
 * time so the animation always has room to breathe.  Returns a single
 * `visible` boolean — the overlay handles its own exit animation.
 */

const MIN_DISPLAY_MS = 1200;

export function useLoader()
{
    const [visible, setVisible] = useState(true);

    useEffect(() =>
    {
        const start = performance.now();

        const dismiss = () =>
        {
            const elapsed = performance.now() - start;
            const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
            setTimeout(() => setVisible(false), remaining);
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

    return { visible };
}
