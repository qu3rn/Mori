import { useEffect, useState } from 'react';
import { resolveCondition, type WeatherCondition } from '@/utility/weatherMessages';

// ─── Location ──────────────────────────────────────────────────────────────────
// Wrocław, Poland
const LAT = 51.1;
const LON = 17.03;

// Open-Meteo forecast endpoint -> current block with all required fields.
// `precipitation` and `weather_code` are explicitly requested so message
// selection can distinguish clear / cloudy / rain reliably.
const ENDPOINT =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${LAT}&longitude=${LON}` +
    `&current=temperature_2m,precipitation,weather_code` +
    `&timezone=auto`;

// ─── Types ─────────────────────────────────────────────────────────────────────

export type WeatherData =
    | { status: 'loading'; }
    | { status: 'ready'; condition: WeatherCondition; temperature: number; }
    | { status: 'error'; };

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Fetches current weather from Open-Meteo on mount.
 * Validates each numeric field before use -> external data never reaches the DOM raw.
 * Returns a discriminated union so callers handle all three states explicitly.
 */
export function useWeatherData(): WeatherData
{
    const [result, setResult] = useState<WeatherData>({ status: 'loading' });

    useEffect(() =>
    {
        let cancelled = false;

        fetch(ENDPOINT)
            .then((res) =>
            {
                if (!res.ok)
                {
                    throw new Error(`HTTP ${res.status}`);
                };

                return res.json() as Promise<unknown>;
            })
            .then((raw) =>
            {
                if (cancelled) return;

                // Validate shape — guard against unexpected API responses
                const current = (raw as Record<string, unknown>)?.current;

                if (typeof current !== 'object' || current === null)
                {
                    throw new Error('unexpected shape');
                };

                const c = current as Record<string, unknown>;
                const code = typeof c.weather_code === 'number' ? c.weather_code : 0;
                const precip = typeof c.precipitation === 'number' ? c.precipitation : 0;
                const temp = typeof c.temperature_2m === 'number' ? c.temperature_2m : 0;

                setResult({
                    status: 'ready',
                    condition: resolveCondition(code, precip),
                    temperature: Math.round(temp),
                });
            })
            .catch(() =>
            {
                if (!cancelled)
                {
                    setResult({ status: 'error' });
                }
            });

        return () => { cancelled = true; };
    }, []);

    return result;
}
