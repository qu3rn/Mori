import { useEffect, useState, type ReactNode } from 'react'

interface Props {
  visible: boolean
  children: ReactNode
}

/**
 * Full-screen overlay that mounts its children while `visible` is true,
 * plays a CSS exit animation when `visible` flips to false, then unmounts.
 *
 * Also locks body scroll while the overlay is present so the user cannot
 * accidentally scroll past the hero during the loading phase.
 */
export default function LoaderOverlay({ visible, children }: Props) {
  const [mounted, setMounted]   = useState(true)
  const [exiting, setExiting]   = useState(false)

  // When the parent signals ready: trigger exit animation, then unmount
  useEffect(() => {
    if (!visible) {
      setExiting(true)
      const t = setTimeout(() => setMounted(false), 700) // matches CSS duration
      return () => clearTimeout(t)
    }
  }, [visible])

  // Lock / unlock body scroll
  useEffect(() => {
    if (mounted) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-live="polite"
      className={`fixed inset-0 z-[100] flex items-center justify-center${exiting ? ' loader-exiting' : ''}`}
      style={{ backgroundColor: '#09090b' /* zinc-950 */ }}
    >
      {children}
    </div>
  )
}
