import { motion, useReducedMotion, type Variants } from 'framer-motion'
import gsap from 'gsap'
import {
  type PointerEvent as ReactPointerEvent,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import './DashboardBento.css'

const GLOW_RADIUS = 320
const PARTICLE_COUNT = 6

function useFinePointer() {
  const [isFinePointer, setIsFinePointer] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine) and (hover: hover)')
    const update = () => setIsFinePointer(query.matches)

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return isFinePointer
}

type DashboardBentoGridProps = PropsWithChildren<{
  className?: string
  variants: Variants
  initial: string
  animate: string
}>

export function DashboardBentoGrid({
  children,
  className = '',
  variants,
  initial,
  animate,
}: DashboardBentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()
  const finePointer = useFinePointer()
  const effectsEnabled = finePointer && !reduceMotion

  const clearGlow = useCallback(() => {
    const grid = gridRef.current
    if (!grid) return

    grid.style.setProperty('--bento-spotlight-opacity', '0')
    grid.querySelectorAll<HTMLElement>('[data-bento-card]').forEach((card) => {
      card.style.setProperty('--bento-glow-intensity', '0')
    })
  }, [])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!effectsEnabled || event.pointerType === 'touch') return

    const clientX = event.clientX
    const clientY = event.clientY
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)

    frameRef.current = requestAnimationFrame(() => {
      const grid = gridRef.current
      if (!grid) return

      const gridRect = grid.getBoundingClientRect()
      grid.style.setProperty('--bento-spotlight-x', `${clientX - gridRect.left}px`)
      grid.style.setProperty('--bento-spotlight-y', `${clientY - gridRect.top}px`)
      grid.style.setProperty('--bento-spotlight-opacity', '1')

      grid.querySelectorAll<HTMLElement>('[data-bento-card]').forEach((card) => {
        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.hypot(clientX - centerX, clientY - centerY)
        const intensity = Math.max(0, 1 - distance / GLOW_RADIUS)

        card.style.setProperty('--bento-glow-x', `${clientX - rect.left}px`)
        card.style.setProperty('--bento-glow-y', `${clientY - rect.top}px`)
        card.style.setProperty('--bento-glow-intensity', intensity.toFixed(3))
      })
    })
  }, [effectsEnabled])

  useEffect(() => {
    if (!effectsEnabled) clearGlow()
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [clearGlow, effectsEnabled])

  return (
    <motion.div
      ref={gridRef}
      className={`dashboard-bento-grid ${className}`.trim()}
      variants={variants}
      initial={initial}
      animate={animate}
      onPointerMove={handlePointerMove}
      onPointerLeave={clearGlow}
      data-effects={effectsEnabled ? 'enabled' : 'disabled'}
    >
      <span className="dashboard-bento-spotlight" aria-hidden="true" />
      {children}
    </motion.div>
  )
}

type DashboardBentoCardProps = PropsWithChildren<{
  className?: string
  variants: Variants
}>

export function DashboardBentoCard({ children, className = '', variants }: DashboardBentoCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const finePointer = useFinePointer()
  const effectsEnabled = finePointer && !reduceMotion

  const removeParticles = useCallback(() => {
    cardRef.current?.querySelectorAll('.dashboard-bento-particle').forEach((particle) => particle.remove())
  }, [])

  const resetContent = useCallback(() => {
    if (!contentRef.current) return
    gsap.to(contentRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.28,
      ease: 'power2.out',
      overwrite: true,
    })
  }, [])

  const createParticleBurst = useCallback((x: number, y: number) => {
    const card = cardRef.current
    if (!card || !effectsEnabled) return

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const particle = document.createElement('i')
      const angle = (Math.PI * 2 * index) / PARTICLE_COUNT + Math.random() * 0.35
      const distance = 22 + Math.random() * 34
      particle.className = 'dashboard-bento-particle'
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      card.appendChild(particle)

      gsap.fromTo(
        particle,
        { x: 0, y: 0, scale: 0.35, opacity: 0 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          scale: 1,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out',
          onStart: () => gsap.set(particle, { opacity: 0.72 }),
          onComplete: () => particle.remove(),
        },
      )
    }
  }, [effectsEnabled])

  const handlePointerEnter = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!effectsEnabled || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    createParticleBurst(event.clientX - rect.left, event.clientY - rect.top)
  }, [createParticleBurst, effectsEnabled])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const content = contentRef.current
    if (!content || !effectsEnabled || event.pointerType === 'touch') return

    const rect = event.currentTarget.getBoundingClientRect()
    const horizontal = (event.clientX - rect.left) / rect.width - 0.5
    const vertical = (event.clientY - rect.top) / rect.height - 0.5

    gsap.to(content, {
      x: horizontal * 2,
      y: vertical * 2,
      rotateX: vertical * -2.4,
      rotateY: horizontal * 2.4,
      transformPerspective: 800,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: true,
    })
  }, [effectsEnabled])

  const handleClickCapture = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const target = event.target as Element
    const action = target.closest('button, a')
    const card = cardRef.current
    if (!action || !card || !effectsEnabled) return

    const rect = card.getBoundingClientRect()
    const ripple = document.createElement('i')
    ripple.className = 'dashboard-bento-ripple'
    ripple.style.left = `${event.clientX - rect.left}px`
    ripple.style.top = `${event.clientY - rect.top}px`
    card.appendChild(ripple)

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 0.3 },
      { scale: 18, opacity: 0, duration: 0.55, ease: 'power2.out', onComplete: () => ripple.remove() },
    )
  }, [effectsEnabled])

  useEffect(() => {
    if (effectsEnabled || !contentRef.current) return
    gsap.killTweensOf(contentRef.current)
    gsap.set(contentRef.current, { x: 0, y: 0, rotateX: 0, rotateY: 0 })
    removeParticles()
  }, [effectsEnabled, removeParticles])

  useEffect(() => () => {
    if (contentRef.current) gsap.killTweensOf(contentRef.current)
    removeParticles()
  }, [removeParticles])

  return (
    <motion.article
      ref={cardRef}
      variants={variants}
      className={`dashboard-bento-card ${className}`.trim()}
      data-bento-card
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetContent}
      onPointerDownCapture={handleClickCapture}
    >
      <div ref={contentRef} className="dashboard-bento-card-content">
        {children}
      </div>
    </motion.article>
  )
}
