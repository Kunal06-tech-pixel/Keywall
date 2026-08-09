import { useState } from 'react'
import { Cloud, Database, KeyRound, LockKeyhole, MonitorCheck, ShieldCheck } from 'lucide-react'
import { FadeIn } from '../../lib/FadeIn'

const steps = [
  {
    label: 'Unlock locally',
    title: 'Your credentials unlock material in the browser.',
    description: 'Key derivation and vault-key unwrapping happen inside the active Keywall session—not on the API.',
    icon: KeyRound,
    payload: ['Argon2id derivation', 'Vault key unwrapped locally', 'No plaintext request'],
  },
  {
    label: 'Encrypt on device',
    title: 'Plaintext becomes authenticated ciphertext before sync.',
    description: 'Vault fields are encrypted with client-held key material. Only the encrypted record is prepared for transport.',
    icon: LockKeyhole,
    payload: ['AES-256-GCM', 'Unique nonce', 'Authenticated payload'],
  },
  {
    label: 'Sync ciphertext',
    title: 'The service receives an opaque encrypted record.',
    description: 'The API can synchronize identifiers, revisions, nonces, timestamps, and ciphertext without reading vault fields.',
    icon: Cloud,
    payload: ['Opaque item ID', 'Revision metadata', 'Ciphertext body'],
  },
  {
    label: 'Read locally',
    title: 'The browser decrypts only inside your session.',
    description: 'Synchronized records become readable after local decryption, while the encrypted cache supports offline access.',
    icon: MonitorCheck,
    payload: ['Local decrypt', 'Session-only plaintext', 'Encrypted offline cache'],
  },
]

export function EncryptionFlowSection() {
  const [activeStep, setActiveStep] = useState(0)
  const active = steps[activeStep]!
  const ActiveIcon = active.icon

  return (
    <section id="flow" className="kw-section kw-flow-section">
      <div className="landing-container">
        <FadeIn className="kw-flow-heading">
          <div className="kw-section-kicker">The encryption lifecycle</div>
          <h2>Readable here.<br /><span>Opaque everywhere else.</span></h2>
          <p>Follow one vault item from unlock to sync and back again.</p>
        </FadeIn>

        <div className="kw-flow-layout">
          <div className="kw-flow-tabs" role="tablist" aria-label="Encryption lifecycle steps">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <button
                  key={step.label}
                  type="button"
                  role="tab"
                  id={`kw-flow-tab-${index}`}
                  aria-selected={activeStep === index}
                  aria-controls="kw-flow-panel"
                  tabIndex={activeStep === index ? 0 : -1}
                  className={activeStep === index ? 'active' : ''}
                  onClick={() => setActiveStep(index)}
                  onKeyDown={(event) => {
                    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
                    event.preventDefault()
                    const next = event.key === 'ArrowDown'
                      ? (index + 1) % steps.length
                      : (index - 1 + steps.length) % steps.length
                    setActiveStep(next)
                    document.getElementById(`kw-flow-tab-${next}`)?.focus()
                  }}
                >
                  <span className="kw-flow-step"><small>{String(index + 1).padStart(2, '0')}</small><Icon size={18} /></span>
                  <span><strong>{step.label}</strong><small>{step.description}</small></span>
                </button>
              )
            })}
          </div>

          <FadeIn delay={0.12} direction="left" distance={22} className="kw-flow-panel-wrap">
            <div
              id="kw-flow-panel"
              className="kw-flow-panel"
              role="tabpanel"
              aria-labelledby={`kw-flow-tab-${activeStep}`}
            >
              <div className="kw-flow-panel-head">
                <span><ActiveIcon size={20} /></span>
                <small>Step {activeStep + 1} of {steps.length}</small>
              </div>
              <h3>{active.title}</h3>
              <p>{active.description}</p>

              <div className="kw-boundary-diagram" aria-label="Client and service data boundary">
                <div className="kw-boundary-zone client">
                  <small>Your device</small>
                  <span><ShieldCheck size={17} /> Keys + plaintext</span>
                </div>
                <div className="kw-boundary-transfer"><span /><LockKeyhole size={18} /><span /></div>
                <div className="kw-boundary-zone service">
                  <small>Sync service</small>
                  <span><Database size={17} /> Ciphertext only</span>
                </div>
              </div>

              <ul>{active.payload.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
