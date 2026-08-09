import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Logo } from '../../ui/Logo'
import { FadeIn } from '../../lib/FadeIn'

const footerLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Security', href: '#security' },
  { label: 'How it works', href: '#flow' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Beta status', href: '#beta' },
  { label: 'Questions', href: '#questions' },
]

export function Footer() {
  return (
    <footer className="kw-footer">
      <FadeIn distance={14} className="landing-container">
        <div className="kw-footer-main">
          <div className="kw-footer-brand">
            <a href="#product" aria-label="Keywall home"><Logo light /></a>
            <p>A zero-knowledge vault with client-side encryption and ciphertext-only sync.</p>
            <span><ShieldCheck size={15} /> Controlled production beta</span>
          </div>

          <nav className="kw-footer-nav" aria-label="Footer navigation">
            <h2>Explore</h2>
            {footerLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          </nav>

          <div className="kw-footer-actions">
            <h2>Your vault</h2>
            <a href="/app">Sign in <ArrowRight size={14} /></a>
            <a href="/app?mode=register">Create account <ArrowRight size={14} /></a>
          </div>
        </div>

        <div className="kw-footer-bottom">
          <span>Keywall</span>
          <span>Keys stay on your device. Servers synchronize ciphertext only.</span>
        </div>
      </FadeIn>
    </footer>
  )
}
