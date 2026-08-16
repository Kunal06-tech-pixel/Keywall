import { useEffect, useState } from 'react'
import { Cloud, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react'
import '../../styles/landing.css'
import { SecurityArchitectureSection } from '../../components/landing/SecurityArchitectureSection'
import { EncryptionFlowSection } from '../../components/landing/EncryptionFlowSection'
import { PrivacySection } from '../../components/landing/PrivacySection'
import { ReleaseBoundarySection } from '../../components/landing/ReleaseBoundarySection'
import { ClosingSection } from '../../components/landing/ClosingSection'
import { Footer } from '../../components/landing/Footer'

/*
THESIS: Keywall opens as a cinematic security boundary, then proves the promise through its real architecture and release constraints.
OWN-WORLD: Full-bleed motion, pure black fields, crisp white pills, graphite controls, hairline dividers, and circular pixel display type.
STORY: Visitors learn where encryption happens, what the service can see, how records move, and why the product remains a controlled beta.
FIRST VIEWPORT: Floating navigation, factual security proof, a two-line zero-knowledge promise, clear account action, and four verified product properties.
FORM: A product premiere flowing into the complete technical landing narrative; no invented customers, benchmarks, or scale claims.
*/

const proofItems = [
  { icon: '<', value: 'Device', label: 'Key custody' },
  { icon: '%', value: 'AES-256', label: 'Vault encryption' },
  { icon: '*', value: 'Offline', label: 'Encrypted cache' },
  { icon: '#', value: 'Private beta', label: 'Release stage' },
] as const

const navItems = [
  { id: 'product', label: 'Home', href: '#product' },
  { id: 'security', label: 'Security', href: '#security' },
  { id: 'flow', label: 'How it works', href: '#flow' },
  { id: 'privacy', label: 'Privacy', href: '#privacy' },
] as const

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<(typeof navItems)[number]['id']>('product')

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Keywall - zero-knowledge password manager'
    document.body.classList.add('landing-viewport')

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth > 720) setMenuOpen(false)
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 24)

      const activationLine = window.scrollY + 140
      let currentSection: (typeof navItems)[number]['id'] = 'product'
      for (const item of navItems) {
        const section = document.getElementById(item.id)
        const sectionTop = section ? section.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY
        if (sectionTop <= activationLine) currentSection = item.id
      }
      setActiveSection(currentSection)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      document.title = previousTitle
      document.body.classList.remove('landing-viewport', 'menu-open')
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="keywall-landing-root">
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
          <a className="landing-logo" href="#product" aria-label="Keywall home">
            <img src="/assets/logo.webp" alt="" width="52" height="52" />
          </a>

          <nav className="evolve-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.id}
                className={activeSection === item.id ? 'active' : ''}
                href={item.href}
                aria-current={activeSection === item.id ? 'location' : undefined}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a className="landing-sign-in" href="/app">Sign in</a>

          <button
            type="button"
            className={`landing-menu-toggle ${menuOpen ? 'open' : ''}`}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>
      </header>

      {menuOpen && (
        <div className="landing-menu-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeMenu()
        }}>
          <div id="landing-mobile-menu" className="landing-mobile-menu">
            <nav aria-label="Mobile navigation">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  className={activeSection === item.id ? 'active' : ''}
                  href={item.href}
                  aria-current={activeSection === item.id ? 'location' : undefined}
                  onClick={() => {
                    setActiveSection(item.id)
                    closeMenu()
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a className="mobile-sign-in" href="/app" onClick={closeMenu}>Sign in</a>
          </div>
        </div>
      )}

      <section id="product" className="landing-viewport-section" aria-label="Keywall introduction">
        <div className="landing-bg" aria-hidden="true">
          <video className="landing-bg-video" autoPlay muted loop playsInline crossOrigin="anonymous">
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="evolve-hero">
          <div
            className="evolve-trust anim"
            aria-label="Device-held keys, client-side encryption, and ciphertext-only synchronization"
          >
            <div className="trust-avatars" aria-hidden="true">
              <span className="trust-avatar trust-avatar-one"><KeyRound /></span>
              <span className="trust-avatar trust-avatar-two"><LockKeyhole /></span>
              <span className="trust-avatar trust-avatar-three"><Cloud /></span>
            </div>
            <div className="trust-pill">Zero-knowledge by design</div>
          </div>

          <h1 className="landing-headline" aria-label="Your vault stays unreadable to us">
            <span>Your Vault Stays</span>
            <span>Unreadable To Us</span>
          </h1>

          <p className="landing-subhead anim">
            Keywall encrypts every secret inside your browser. The service synchronizes ciphertext—not passwords, keys, or decrypted fields.
          </p>

          <a className="landing-cta anim" href="/app?mode=register">Create Your Vault</a>
        </div>

        <div className="landing-stats" aria-label="Verified Keywall product properties">
          {proofItems.map((item) => (
            <div key={item.label} className="landing-stat anim">
              <span className="stat-icon" aria-hidden="true">{item.icon}</span>
              <span className="stat-value">{item.value}</span>
              <span className="stat-label">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <main className="landing-content" aria-label="Keywall product details">
        <SecurityArchitectureSection />
        <EncryptionFlowSection />
        <PrivacySection />
        <ReleaseBoundarySection />
        <ClosingSection />
      </main>
      <Footer />
    </div>
  )
}
