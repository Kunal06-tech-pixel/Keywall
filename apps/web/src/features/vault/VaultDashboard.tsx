import { motion, type Variants } from 'framer-motion'
import {
  Activity,
  Check,
  ChevronRight,
  HeartPulse,
  KeyRound,
  Layers3,
  Plus,
  RefreshCw,
  ShieldCheck,
  Star,
  Upload,
} from 'lucide-react'
import type { VaultItem } from '@keywall/contracts'
import * as React from 'react'
import type { passwordHealth } from '../../health'
import { categoryCounts, healthLabel, recentItems, relativeTime, securityScore } from './dashboard-metrics'
import { safeSubtitle } from './vault-item-validation'
import type { View } from './VaultScreen'
import { easeOut } from '../../lib/motion'
import { typeLabels, typeIcons } from './item-types'
import { DashboardBentoCard, DashboardBentoGrid } from './DashboardBento'

type DashboardView = Extract<View, VaultItem['type'] | 'archive' | 'health'>

const cardContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

const cardItem: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: easeOut } },
}

function setupItem(label: string, detail: string, done: boolean, action: () => void) {
  return { label, detail, done, action }
}

export function VaultDashboard({ items, visibleItems, health, compromised, loading, onSelect, onNavigate, onToggleFavorite, onCreateItem, onImport }: {
  items: VaultItem[]
  visibleItems: VaultItem[]
  health: ReturnType<typeof passwordHealth>
  compromised: number | null
  loading: boolean
  onSelect: (item: VaultItem) => void
  onNavigate: (view: DashboardView) => void
  onToggleFavorite: (item: VaultItem) => void
  onCreateItem: () => void
  onImport: () => void
}) {
  const counts = categoryCounts(items)
  const liveItems = items.filter((item) => !item.archived)
  const recent = recentItems(items)
  const score = securityScore(health, compromised ?? 0)
  const status = healthLabel(score)
  const attention = health.weak + health.reused + (compromised ?? 0)
  const healthPercent = health.total ? Math.round((health.strong / health.total) * 100) : 100
  const setup = [
    setupItem('Create your first item', 'Add a login, card, or secure note', liveItems.length > 0, onCreateItem),
    setupItem('Import your data', 'Bring in an encrypted backup', false, onImport),
    setupItem('Review password health', 'Check for weak or reused logins', false, () => onNavigate('health')),
  ]
  const completedSetup = setup.filter((item) => item.done).length

  if (loading) {
    return (
      <section className="dashboard-skeleton" aria-label="Loading vault overview">
        {Array.from({ length: 4 }, (_, index) => (
          <i key={index} />
        ))}
      </section>
    )
  }

  return (
    <section className="vault-dashboard" aria-label="Vault overview">
      <DashboardBentoGrid className="dashboard-summary-grid" variants={cardContainer} initial="hidden" animate="visible">
        <DashboardBentoCard variants={cardItem} className="dashboard-card metrics-hero-card bento-vault-card">
          <div className="card-top-row">
            <span className="card-eyebrow">Vault items</span>
            <Layers3 className="card-icon" aria-hidden="true" size={19} />
          </div>
          <b className="card-metric-val">{liveItems.length}</b>
          <p className="card-subtext">Across {Object.values(counts).filter(Boolean).length} item categories</p>
        </DashboardBentoCard>

        <DashboardBentoCard variants={cardItem} className="dashboard-card metrics-hero-card bento-security-card">
          <div className="card-top-row">
            <span className="card-eyebrow">Security score</span>
            <ShieldCheck className="card-icon" aria-hidden="true" size={19} />
          </div>
          <div className="score-metric-row">
            <b className="card-metric-val">{score}</b>
            <span className={`score-badge ${status.tone}`}>{status.label}</span>
          </div>
          <p className="card-subtext">{attention ? `${attention} items need attention` : 'No items need attention'}</p>
        </DashboardBentoCard>

        <DashboardBentoCard variants={cardItem} className="dashboard-card metrics-hero-card sync-metric-card bento-sync-card">
          <div className="card-top-row">
            <span className="card-eyebrow">Sync status</span>
            <RefreshCw className="card-icon" aria-hidden="true" size={19} />
          </div>
          <div className="status-metric-row">
            <b className="card-metric-val status-title">Protected</b>
            <span className="live-status-pill">Synced</span>
          </div>
          <p className="card-subtext">Client-side AES-256-GCM encryption</p>
        </DashboardBentoCard>

        <DashboardBentoCard variants={cardItem} className="dashboard-card metrics-hero-card health-metric-card bento-health-card">
          <div className="card-top-row">
            <span className="card-eyebrow">Password health</span>
            <button className="metric-link" onClick={() => onNavigate('health')}>Inspect</button>
          </div>
          <div className="health-metric-content">
            <div className="health-stat-list compact-health-stat-list">
              <div className="stat-row"><span className="stat-dot strong" /><span className="stat-label">Strong</span><b className="stat-val">{health.strong}</b></div>
              <div className="stat-row"><span className="stat-dot weak" /><span className="stat-label">Weak</span><b className="stat-val">{health.weak}</b></div>
              <div className="stat-row"><span className="stat-dot reused" /><span className="stat-label">Reused</span><b className="stat-val">{health.reused}</b></div>
              <div className="stat-row"><span className="stat-dot compromised" /><span className="stat-label">Compromised</span><b className="stat-val">{compromised ?? 0}</b></div>
            </div>
            <div className="health-ring" style={{ background: `conic-gradient(var(--color-mint) ${healthPercent}%, rgba(247, 251, 248, .08) ${healthPercent}% 100%)` }} aria-label={`${healthPercent}% of passwords are strong`} role="img">
              <strong>{health.total}</strong>
              <span>Total</span>
            </div>
          </div>
        </DashboardBentoCard>
      </DashboardBentoGrid>

      <motion.div className="dashboard-reference-layout" variants={cardContainer} initial="hidden" animate="visible">
        <motion.article variants={cardItem} className="dashboard-panel dashboard-items-panel">
          <header className="panel-header items-panel-header">
            <div>
              <h2>All vault items</h2>
              <p className="panel-sub">Quick access to your most important items.</p>
            </div>
            <div className="dashboard-table-tools" aria-label="Vault list summary">
              <span className="table-filter-chip">All categories <ChevronRight size={13} /></span>
              <span className="table-view-count">{visibleItems.length} shown</span>
            </div>
          </header>

          {visibleItems.length ? (
            <div className="dashboard-table" role="table" aria-label="Vault items">
              <div className="dashboard-table-head" role="row">
                <span role="columnheader">Item name</span>
                <span role="columnheader">Category</span>
                <span role="columnheader">Security</span>
                <span role="columnheader">Updated</span>
                <span aria-hidden="true" />
              </div>
              <div className="dashboard-table-body">
                {visibleItems.map((item) => {
                  const Icon = typeIcons[item.type]
                  return (
                    <div className={`dashboard-item-row ${item.favorite ? 'is-favorite' : ''}`} key={item.id} role="row">
                      <button className="dashboard-item-main" onClick={() => onSelect(item)} role="cell">
                        <span className="site-avatar"><Icon size={16} /></span>
                        <span className="entry-primary"><b>{item.name}</b><small>{safeSubtitle(item)}</small></span>
                      </button>
                      <span className="item-category-cell" role="cell"><i>{typeLabels[item.type]}</i></span>
                      <span className="item-security-cell" role="cell"><i className="security-dot protected" />Protected</span>
                      <time className="item-updated-cell" dateTime={item.updatedAt} role="cell">{relativeTime(item.updatedAt)}</time>
                      <button className={`favorite-action-btn ${item.favorite ? 'is-favorite' : ''}`} onClick={() => onToggleFavorite(item)} aria-label={`${item.favorite ? 'Remove' : 'Add'} ${item.name} ${item.favorite ? 'from' : 'to'} favorites`}>
                        <Star size={16} fill={item.favorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <KeyRound size={28} />
              <b>No encrypted items found</b>
              <p>Add a secure item to store logins, cards, or notes encrypted on your device.</p>
            </div>
          )}

          <footer className="dashboard-table-footer">
            <span>Showing {visibleItems.length} of {liveItems.length} active items</span>
            <span><ShieldCheck size={13} /> Ciphertext-only sync</span>
          </footer>
        </motion.article>

        <aside className="dashboard-side-rail" aria-label="Vault activity and setup">
          <motion.article variants={cardItem} className="dashboard-panel activity-panel">
            <header className="panel-header">
              <div><h2>Recent activity</h2><p className="panel-sub">Latest local vault changes</p></div>
              <Activity size={17} aria-hidden="true" className="panel-header-icon" />
            </header>
            {recent.length ? (
              <div className="recent-items-list">
                {recent.map((item) => {
                  const Icon = typeIcons[item.type]
                  return (
                    <div className="recent-row" key={item.id}>
                      <button className="recent-main-btn" onClick={() => onSelect(item)}>
                        <span className="item-icon-box"><Icon size={15} /></span>
                        <span className="item-info"><b className="item-name">{item.name}</b><small className="item-sub">{typeLabels[item.type]}</small></span>
                        <time className="item-time" dateTime={item.updatedAt}>{relativeTime(item.updatedAt)}</time>
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="dashboard-empty-state compact-empty-state"><KeyRound size={22} /><b>No recent activity</b><p>New and updated items will appear here.</p></div>
            )}
          </motion.article>

          <motion.article variants={cardItem} className="dashboard-panel getting-started-panel">
            <header className="panel-header">
              <div><h2>Get started with Keywall</h2><p className="panel-sub">{completedSetup} / {setup.length} completed</p></div>
            </header>
            <div className="setup-progress"><span style={{ width: `${(completedSetup / setup.length) * 100}%` }} /></div>
            <div className="setup-list">
              {setup.map((step) => (
                <button className={`setup-step ${step.done ? 'is-complete' : ''}`} key={step.label} onClick={step.action}>
                  <span className="setup-check">{step.done ? <Check size={12} /> : <span />}</span>
                  <span className="setup-copy"><b>{step.label}</b><small>{step.detail}</small></span>
                  <ChevronRight size={14} className="setup-arrow" />
                </button>
              ))}
            </div>
            <button className="dashboard-setup-link" onClick={onCreateItem}><Plus size={14} /> Add a vault item</button>
          </motion.article>
        </aside>
      </motion.div>
    </section>
  )
}
