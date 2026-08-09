import { Database, HardDrive, KeyRound, Lock, ShieldCheck, WifiOff } from 'lucide-react'
import { FadeIn } from '../../lib/FadeIn'
import { StaggerContainer, StaggerItem } from '../../lib/StaggerContainer'

const architecture = [
  {
    number: '01',
    title: 'Client-side encryption',
    description: 'Vault items, attachments, and recovery material are encrypted on your device before anything leaves it.',
    proof: 'Keys never leave your device',
    icon: KeyRound,
    visual: <><span className="kw-visual-node strong"><KeyRound size={22} /></span><span className="kw-visual-path" /><span className="kw-visual-node"><Lock size={19} /></span></>,
  },
  {
    number: '02',
    title: 'Ciphertext-only service',
    description: 'The API stores opaque identifiers, revisions, nonces, timestamps, and authenticated ciphertext—never your plaintext.',
    proof: 'Zero visibility into vault data',
    icon: Database,
    visual: <div className="kw-cipher-stack"><span>AEAD · xG7k…</span><span>nonce · 8f1a…</span><span>revision · 12</span></div>,
  },
  {
    number: '03',
    title: 'Local-first reads',
    description: 'An encrypted IndexedDB cache keeps your vault responsive and useful when the network is unavailable.',
    proof: 'Offline-ready by design',
    icon: WifiOff,
    visual: <><span className="kw-device-frame"><HardDrive size={24} /><small>Encrypted cache</small></span><span className="kw-offline-pill"><WifiOff size={13} /> Offline</span></>,
  },
]

export function SecurityArchitectureSection() {
  return (
    <section id="security" className="kw-section kw-architecture-section">
      <div className="landing-container">
        <FadeIn className="kw-editorial-heading">
          <div className="kw-section-kicker">Security architecture</div>
          <h2>Built around one boundary:<br /><span>your device.</span></h2>
          <p>Keywall separates the place where secrets are readable from the service that synchronizes them.</p>
        </FadeIn>

        <StaggerContainer staggerDelay={0.1} className="kw-architecture-list">
          {architecture.map((item) => {
            const Icon = item.icon
            return (
              <StaggerItem key={item.number}>
                <article className="kw-architecture-row">
                  <span className="kw-row-number">{item.number}</span>
                  <div className="kw-row-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="kw-row-proof"><Icon size={15} /> {item.proof}</span>
                  </div>
                  <div className="kw-row-visual" aria-hidden="true">{item.visual}</div>
                </article>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
        <div className="kw-architecture-note"><ShieldCheck size={16} /> The service cannot derive your vault key from synchronized data.</div>
      </div>
    </section>
  )
}
