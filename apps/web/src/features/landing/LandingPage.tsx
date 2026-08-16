import { useEffect } from 'react'
import '../../styles/landing.css'
import { Navbar } from '../../components/landing/Navbar'
import { HeroSection } from '../../components/landing/HeroSection'
import { SecurityArchitectureSection } from '../../components/landing/SecurityArchitectureSection'
import { EncryptionFlowSection } from '../../components/landing/EncryptionFlowSection'
import { PrivacySection } from '../../components/landing/PrivacySection'
import { ReleaseBoundarySection } from '../../components/landing/ReleaseBoundarySection'
import { ClosingSection } from '../../components/landing/ClosingSection'
import { Footer } from '../../components/landing/Footer'

export function LandingPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Keywall \u2013 zero-knowledge password manager'
    document.body.classList.add('landing-viewport')
    return () => {
      document.title = previousTitle
      document.body.classList.remove('landing-viewport')
    }
  }, [])

  return (
    <div className="keywall-landing-root">
      <Navbar />
      <HeroSection />
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
