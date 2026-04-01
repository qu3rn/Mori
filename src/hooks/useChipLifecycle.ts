import { useEffect, useState } from 'react';

// ─── Configurable timings ──────────────────────────────────────────────────────

/** All values in milliseconds. Centralised here for easy tuning. */
export const CHIP_TIMINGS = {
    /** Delay between loader overlay fully gone and chip appearance. */
    POST_LOADER_DELAY: 400,
    /** How long the chip is visible before auto-disintegration starts. */
    AUTO_DISMISS: 3000,
    /** Duration of the disintegration + fragment animation before unmount. */
    DISINTEGRATE_DURATION: 800,
    /** Duration of the manual close fade-out before unmount. */
    CLOSE_DURATION: 280,
} as const;

// ─── Phase ─────────────────────────────────────────────────────────────────────

/**
 * Linear lifecycle phases for the chip.
 *
 * hidden        → waiting for loader + data + delay
 * visible       → fully shown, counting down to auto-disintegration
 * closing       → user pressed ×, playing quick fade-out
 * disintegrating→ auto-timeout fired, playing fragment scatter animation
 * gone          → unmounted
 */
export type ChipPhase = 'hidden' | 'visible' | 'closing' | 'disintegrating' | 'gone';

// ─── Hook ──────────────────────────────────────────────────────────────────────

interface Options
{
    /** True once the loader overlay has fully finished its exit animation. */
    loaderDone: boolean;
    /** True once weather data is resolved (ready or error — either way chip shows). */
    dataReady: boolean;
}

export function useChipLifecycle({ loaderDone, dataReady }: Options)
{
    const [phase, setPhase] = useState<ChipPhase>('hidden');
    const [hovered, setHovered] = useState(false);

    // hidden → visible: both preconditions met + post-loader delay elapsed
    useEffect(() =>
    {
        if (!loaderDone || !dataReady || phase !== 'hidden')
        {
            return;
        };

        const t = setTimeout(
            () => setPhase('visible'),
            CHIP_TIMINGS.POST_LOADER_DELAY,
        );
        return () =>
        {
            clearTimeout(t);
        };
    }, [loaderDone, dataReady, phase]);

    // visible → disintegrating: auto countdown — suspended while hovered
    useEffect(() =>
    {
        if (phase !== 'visible' || hovered)
        {
            return;
        };

        const t = setTimeout(
            () => setPhase('disintegrating'),
            CHIP_TIMINGS.AUTO_DISMISS,
        );

        return () =>
        {
            clearTimeout(t);
        };
    }, [phase, hovered]);

    // disintegrating → gone: after animation completes
    useEffect(() =>
    {
        if (phase !== 'disintegrating')
        {
            return;
        };

        const t = setTimeout(
            () => setPhase('gone'),
            CHIP_TIMINGS.DISINTEGRATE_DURATION,
        );
        return () =>
        {
            clearTimeout(t);
        };
    }, [phase]);

    // closing → gone: after quick fade completes
    useEffect(() =>
    {
        if (phase !== 'closing')
        {
            return;
        };

        const t = setTimeout(
            () => setPhase('gone'),
            CHIP_TIMINGS.CLOSE_DURATION,
        );

        return () =>
        {
            clearTimeout(t);
        };
    }, [phase]);

    const dismiss = () =>
    {
        if (phase === 'visible') setPhase('closing');
    };

    const pause  = () => setHovered(true);
    const resume = () => setHovered(false);

    return { phase, dismiss, pause, resume };
}
