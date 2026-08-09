import { ArrowRight, Cloud, FileText, KeyRound, Lock, Search, ShieldCheck } from 'lucide-react'
import { brand } from '@keywall/brand'
import { PrimaryButton } from './PrimaryButton'
import { FadeIn } from '../../lib/FadeIn'

const vaultItems = [
  { icon: 'GH', title: 'GitHub', detail: 'john.doe@example.com' },
  { icon: 'G', title: 'Google Workspace', detail: 'john.doe@example.com' },
  { icon: 'V', title: 'Visa ending 4242', detail: 'Card and PIN protected' },
]

export function HeroSection() {
  return (
    <section id="product" className="kw-hero-section">
      <div className="kw-hero-field" aria-hidden="true" />
      <div className="landing-container kw-hero-layout">
        <div className="kw-hero-copy">
          <FadeIn delay={0.04} distance={12} blur={false}>
            <div className="kw-hero-kicker"><span />Controlled production beta</div>
          </FadeIn>

          <FadeIn delay={0.1} distance={22}>
            <h1 className="kw-hero-title" aria-label="Your vault should be unreadable to everyone. Including us.">
              <span>Your vault should</span>{' '}
              <span>be unreadable to</span>{' '}
              <span>everyone.</span>{' '}
              <span className="kw-accent-text">Including us.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.42} distance={16}>
            <p className="kw-hero-subtitle">
              Keywall encrypts every secret inside your browser. The service synchronizes ciphertext—not passwords, keys, or decrypted fields.
            </p>
          </FadeIn>

          <FadeIn delay={0.55} distance={12} blur={false}>
            <div className="kw-hero-actions">
              <PrimaryButton href="/app?mode=register" icon={<ArrowRight size={16} />}>
                {brand.copy.createAccountCta}
              </PrimaryButton>
              <PrimaryButton href="/app" variant="secondary">Sign in to your vault</PrimaryButton>
            </div>
          </FadeIn>

          <FadeIn delay={0.66} distance={10} blur={false}>
            <div className="kw-hero-proof" aria-label="Keywall privacy properties">
              <span><KeyRound size={15} /> Device-held keys</span>
              <span><ShieldCheck size={15} /> Zero-knowledge design</span>
              <span><Cloud size={15} /> Ciphertext-only sync</span>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.28} direction="left" distance={28} scale={0.98} className="kw-vault-stage">
          <div className="kw-vault-window">
            <div className="kw-vault-window-bar">
              <div className="kw-window-controls" aria-hidden="true"><span /><span /><span /></div>
              <span>Keywall Vault</span>
              <span className="kw-local-status"><i /> Local session</span>
            </div>

            <div className="kw-vault-window-body">
              <aside className="kw-vault-sidebar" aria-label="Vault preview categories">
                <div className="kw-vault-mark"><Lock size={18} /></div>
                <span className="active"><ShieldCheck size={15} /> All items</span>
                <span><KeyRound size={15} /> Logins</span>
                <span><FileText size={15} /> Notes</span>
              </aside>

              <div className="kw-vault-content">
                <div className="kw-vault-content-head">
                  <div><small>Private workspace</small><h2>Your vault</h2></div>
                  <div className="kw-vault-search"><Search size={14} /><span>Search</span></div>
                </div>

                <div className="kw-vault-list">
                  {vaultItems.map((item) => (
                    <div className="kw-vault-item" key={item.title}>
                      <span className="kw-item-monogram">{item.icon}</span>
                      <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                      <span className="kw-secret-mask">••••••••</span>
                    </div>
                  ))}
                </div>

                <div className="kw-encryption-rail">
                  <span><Lock size={14} /> Encrypted on this device</span>
                  <span className="kw-rail-line"><i /></span>
                  <span>Ciphertext ready to sync</span>
                </div>
              </div>
            </div>
          </div>
          <div className="kw-stage-note"><Lock size={14} /> Plaintext never crosses this boundary</div>
        </FadeIn>
      </div>
    </section>
  )
}
