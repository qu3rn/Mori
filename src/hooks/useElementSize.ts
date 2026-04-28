import { useEffect, useRef, useState } from 'react';

interface ElementSize
{
    width: number;
    height: number;
}

/**
 * Returns a ref to attach to a DOM element and its measured content size.
 * Updates whenever the element resizes via ResizeObserver.
 */
export function useElementSize<T extends HTMLElement>()
{
    const ref = useRef<T>(null);
    const [size, setSize] = useState<ElementSize | null>(null);

    useEffect(() =>
    {
        const el = ref.current;
        if (!el) return;

        const observer = new ResizeObserver(entries =>
        {
            const { width, height } = entries[0].contentRect;
            setSize({ width: Math.floor(width), height: Math.floor(height) });
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, size };
}
