import { EyeOff, Fingerprint, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react'
import { FadeIn } from '../../lib/FadeIn'
import { StaggerContainer, StaggerItem } from '../../lib/StaggerContainer'

const trustFacts = [
  {
    label: 'Vault keys',
    value: 'Device only',
    description: 'Master passwords and vault keys never leave the browser.',
    icon: KeyRound,
  },
  {
    label: 'Server visibility',
    value: 'Ciphertext',
    description: 'The service stores encrypted records and operational metadata.',
    icon: EyeOff,
  },
  {
    label: 'Recovery',
    value: 'Offline key',
    description: 'Email alone cannot decrypt a vault or replace the recovery key.',
    icon: RefreshCw,
  },
  {
    label: 'Breach checks',
    value: 'Opt-in',
    description: 'Compromised-password checks use k-anonymous range queries.',
    icon: Fingerprint,
  },
]

export function PrivacySection() {
  return (
    <section id="privacy" className="kw-section kw-privacy-section">
      <div className="landing-container">
        <div className="kw-privacy-intro">
          <FadeIn direction="right" distance={26}>
            <div className="kw-section-kicker">What stays private</div>
            <h2>Secrets are decrypted only <span>inside your app session.</span></h2>
          </FadeIn>
          <FadeIn delay={0.12} direction="left" distance={26} className="kw-privacy-summary">
            <p>Authentication, encryption, recovery, and breach checks are designed so one service cannot quietly become the key to everything.</p>
            <span><ShieldCheck size={17} /> You stay in control of the readable vault.</span>
          </FadeIn>
        </div>

        <StaggerContainer staggerDelay={0.08} className="kw-trust-grid">
          {trustFacts.map((fact) => {
            const Icon = fact.icon
            return (
              <StaggerItem key={fact.label}>
                <article className="kw-trust-cell">
                  <div className="kw-trust-cell-head"><span>{fact.label}</span><Icon size={18} /></div>
                  <strong>{fact.value}</strong>
                  <p>{fact.description}</p>
                </article>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
