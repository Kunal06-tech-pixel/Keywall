import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ShieldCheck, X } from 'lucide-react'
import type { VaultItem, VaultItemType } from '@keywall/contracts'
import { typeLabels } from './item-types'
import { ItemTypeSelector } from './ItemTypeSelector'
import { formStateFromItem, VaultItemForm } from './VaultItemForm'
import { itemTemplates } from './vault-item-templates'

export function ItemEditor({ existing, onSave, onClose }: { existing?: VaultItem; onSave: (item: VaultItem) => void; onClose: () => void }) {
  const [type, setType] = useState<VaultItemType | null>(existing?.type ?? null)
  const initial = useMemo(() => formStateFromItem(existing, existing?.type ?? 'login'), [existing])
  const [name, setName] = useState(initial.name)
  const [category, setCategory] = useState(initial.category)
  const [tags, setTags] = useState(initial.tags)
  const [favorite, setFavorite] = useState(initial.favorite)
  const [fields, setFields] = useState<VaultItem['fields']>(initial.fields)
  const [error, setError] = useState('')
  const selectType = (nextType: VaultItemType) => {
    setType(nextType)
    const next = formStateFromItem(undefined, nextType)
    setName('')
    setCategory(next.category)
    setTags('')
    setFavorite(false)
    setFields(next.fields)
    setError('')
  }
  const template = type ? itemTemplates[type] : undefined
  const EditorIcon = template?.icon ?? ShieldCheck

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return <div className="modal-backdrop item-editor-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal entry-modal" role="dialog" aria-modal="true" aria-labelledby="item-editor-title" aria-describedby="item-editor-description">
      <div className="modal-heading">
        <div className="editor-heading-cluster">
          <span className="editor-heading-icon" aria-hidden="true"><EditorIcon size={19} /></span>
          <div>
            <p className="eyebrow">{existing ? 'Edit vault item' : type ? 'New vault item' : 'Select item type'}</p>
            <h2 id="item-editor-title">{existing ? existing.name : type ? template?.label : 'Add secure item'}</h2>
            <p className="editor-subtitle" id="item-editor-description">{type ? template?.description : 'Choose the kind of encrypted information you want to store.'}</p>
          </div>
        </div>
        <button type="button" className="icon-button editor-close-button" onClick={onClose} aria-label="Close item editor"><X size={18} /></button>
      </div>
      {!type && <ItemTypeSelector onSelect={selectType} />}
      {type && !existing && <button type="button" className="secondary-button back-type-button" onClick={() => setType(null)}><ArrowLeft size={15} /> Back to item types</button>}
      {type && existing?.type === 'totp' && <p className="form-notice">Authenticator items are supported for existing records. New secure items use the main vault templates.</p>}
      {type && <div className="editor-security-strip"><ShieldCheck size={15} aria-hidden="true" /><span>Encrypted on this device</span><em>{typeLabels[type]}</em></div>}
      {type && <VaultItemForm
        type={type}
        {...(existing ? { existing } : {})}
        name={name}
        setName={setName}
        category={category}
        setCategory={setCategory}
        tags={tags}
        setTags={setTags}
        favorite={favorite}
        setFavorite={setFavorite}
        fields={fields}
        setFields={setFields}
        error={error}
        setError={setError}
        onSave={onSave}
      />}
    </section>
  </div>
}
