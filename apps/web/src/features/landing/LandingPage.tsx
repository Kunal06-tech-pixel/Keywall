import { useEffect } from 'react'
import { Cloud, KeyRound, LockKeyhole } from 'lucide-react'
import '../../styles/landing.css'
import { Navbar } from '../../components/landing/Navbar'
import { SecurityArchitectureSection } from '../../components/landing/SecurityArchitectureSection'
import { EncryptionFlowSection } from '../../components/landing/EncryptionFlowSection'
import { PrivacySection } from '../../components/landing/PrivacySection'
import { ReleaseBoundarySection } from '../../components/landing/ReleaseBoundarySection'
import { ClosingSection } from '../../components/landing/ClosingSection'
import { Footer } from '../../components/landing/Footer'

const proofItems = [
  { icon: '<', value: 'Device', label: 'Key custody' },
  { icon: '%', value: 'AES-256', label: 'Vault encryption' },
  { icon: '*', value: 'Offline', label: 'Encrypted cache' },
  { icon: '#', value: 'Private beta', label: 'Release stage' },
] as const

export function LandingPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Keywall – zero-knowledge password manager'
    document.body.classList.add('landing-viewport')
    return () => {
      document.title = previousTitle
      document.body.classList.remove('landing-viewport')
    }
  }, [])

  return (
    <div className="keywall-landing-root">
      <Navbar />

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
