import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { brand } from '@keywall/brand'
import { Logo } from '../../ui/Logo'
import { PrimaryButton } from './PrimaryButton'
import { easeOut } from '../../lib/motion'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstMobileLinkRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [mobileMenuOpen])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className={`kw-navbar ${scrolled ? 'kw-navbar--scrolled' : ''}`}>
      <div className="landing-container kw-navbar-shell">
        <div className="kw-navbar-inner">
          <a href="#product" className="kw-brand-link" aria-label="Keywall home">
            <Logo light />
          </a>

          <nav className="kw-nav-links" aria-label="Main navigation">
            <a href="#security" className="kw-nav-link">Security</a>
            <a href="#flow" className="kw-nav-link">How it works</a>
            <a href="#privacy" className="kw-nav-link">Privacy</a>
            <a href="#beta" className="kw-nav-link">Beta status</a>
          </nav>

          <div className="kw-nav-actions">
            <a href="/app" className="kw-nav-link">Sign in</a>
            <PrimaryButton href="/app" icon={<ArrowRight size={15} />}>
              {brand.copy.launchCta}
            </PrimaryButton>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="kw-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="kw-mobile-navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="kw-mobile-navigation"
              className="kw-mobile-menu"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: easeOut }}
            >
              <nav aria-label="Mobile navigation">
                <a ref={firstMobileLinkRef} href="#security" onClick={closeMobileMenu}>Security</a>
                <a href="#flow" onClick={closeMobileMenu}>How it works</a>
                <a href="#privacy" onClick={closeMobileMenu}>Privacy</a>
                <a href="#beta" onClick={closeMobileMenu}>Beta status</a>
              </nav>
              <div className="kw-mobile-menu-actions">
                <PrimaryButton href="/app" variant="secondary" onClick={closeMobileMenu}>Sign in</PrimaryButton>
                <PrimaryButton href="/app?mode=register" icon={<ArrowRight size={15} />} onClick={closeMobileMenu}>
                  {brand.copy.createAccountCta}
                </PrimaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
