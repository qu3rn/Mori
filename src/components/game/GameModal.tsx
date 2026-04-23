import { useEffect } from 'react';
// import Game from './Game'
import { Game } from 'void-protocol';

interface Props
{
    onClose: () => void;
}

/**
 * Full-screen game modal.
 *
 * Opens with a fast fade-in. Closes via:
 *   — the geometric × button (top-right)
 *   — the Escape key
 *
 * Focus is trapped inside the modal while open.
 * Body scroll is locked while the modal is mounted.
 */
export default function GameModal({ onClose }: Props)
{
    // Escape key + body scroll lock
    useEffect(() =>
    {
        const onKey = (e: KeyboardEvent) =>
        {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () =>
        {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    function GameBoundry()
    {
        try
        {
            return <Game />;
        }
        catch (error)
        {
            console.error('Error initializing game:', error);
            return null;
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center game-modal-enter"
            style={{ backgroundColor: 'rgba(9,9,11,0.97)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Void Protocol game"
        >
            {/* Backdrop click → close */}
            <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

            {/* Modal content — positioned above backdrop */}
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-6 my-8 flex flex-col">

                {/* ── Corner marks — match the preview window aesthetic ── */}
                <span className="absolute top-0 left-0 w-6 h-px bg-accent/40 pointer-events-none" />
                <span className="absolute top-0 left-0 w-px h-6 bg-accent/40 pointer-events-none" />
                <span className="absolute top-0 right-12 w-6 h-px bg-accent/40 pointer-events-none" />
                <span className="absolute bottom-0 left-0 w-6 h-px bg-accent/40 pointer-events-none" />
                <span className="absolute bottom-0 left-0 w-px h-6 bg-accent/40 pointer-events-none" />
                <span className="absolute bottom-0 right-0 w-6 h-px bg-accent/40 pointer-events-none" />
                <span className="absolute bottom-0 right-0 w-px h-6 bg-accent/40 pointer-events-none" />

                {/* ── Header bar ── */}
                <div className="flex items-center justify-between px-1 pb-4 shrink-0">
                    <span className="text-zinc-600 font-mono text-[10px] tracking-[0.25em] uppercase select-none">
                        Void Protocol
                    </span>

                    {/* Crosshair × close button */}
                    <button
                        onClick={onClose}
                        aria-label="Close game"
                        className="group relative flex items-center justify-center w-8 h-8
                       text-zinc-600 hover:text-zinc-100 transition-colors duration-200"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:rotate-90"
                        >
                            <line x1="0" y1="0" x2="14" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
                            <line x1="14" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
                        </svg>
                        {/* Subtle crosshair arms */}
                        <span className="absolute top-1/2 left-0 right-0 h-px bg-current opacity-0 group-hover:opacity-20 transition-opacity" />
                        <span className="absolute left-1/2 top-0 bottom-0 w-px bg-current opacity-0 group-hover:opacity-20 transition-opacity" />
                    </button>
                </div>

                {/* ── Game area ── */}
                <div className="flex-1 border border-zinc-800/60 overflow-hidden relative">
                    {/* Dot-grid backdrop matching the preview window */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                            opacity: 0.25,
                        }}
                    />
                    <GameBoundry />
                    <div id="game-container"></div>
                    <div id="ui-root"></div>
                </div>

                {/* ── Footer hint ── */}
                <p className="pt-3 text-zinc-700 font-mono text-[9px] tracking-widest text-right shrink-0 select-none">
                    ESC to close
                </p>
            </div>
        </div>
    );
}
