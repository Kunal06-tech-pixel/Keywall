import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react'
import { brand } from '@keywall/brand'
import { PrimaryButton } from './PrimaryButton'
import { FadeIn } from '../../lib/FadeIn'
import { StaggerContainer, StaggerItem } from '../../lib/StaggerContainer'

const questions = [
  {
    icon: ShieldCheck,
    question: 'Do cloud providers see vault secrets?',
    answer: 'No. They receive encrypted records and operational metadata, not decrypted vault fields or vault keys.',
  },
  {
    icon: KeyRound,
    question: 'Can email reset a lost vault?',
    answer: 'No. Account recovery requires the offline recovery key that independently wraps the vault key.',
  },
]

export function ClosingSection() {
  return (
    <section id="questions" className="kw-section kw-closing-section">
      <div className="landing-container">
        <div className="kw-faq-heading">
          <span>Two important answers</span>
          <h2>Privacy without fine print.</h2>
        </div>

        <StaggerContainer staggerDelay={0.1} className="kw-faq-list">
          {questions.map((item) => {
            const Icon = item.icon
            return (
              <StaggerItem key={item.question}>
                <article className="kw-faq-row">
                  <Icon size={20} />
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        <FadeIn delay={0.1} scale={0.98}>
          <div className="kw-final-cta-card">
            <div className="kw-cta-keyway" aria-hidden="true"><span /><i /><span /></div>
            <div className="cta-content">
              <small>Controlled production beta</small>
              <h2>Your keys.<br />Your rules.</h2>
              <p>Build a private vault whose readable contents stay with you.</p>
            </div>
            <div className="cta-actions">
              <PrimaryButton href="/app?mode=register" icon={<ArrowRight size={16} />}>
                {brand.copy.createAccountCta}
              </PrimaryButton>
              <PrimaryButton href="/app" variant="secondary">Sign in</PrimaryButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
