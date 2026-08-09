import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import './SidebarDock.css'

const BASE_ITEM_HEIGHT = 30
const MAGNIFIED_ITEM_HEIGHT = 38
const DOCK_DISTANCE = 88
const dockSpring = { mass: 0.12, stiffness: 220, damping: 20 }

function useDockPointer() {
  const [isFinePointer, setIsFinePointer] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine) and (hover: hover)')
    const update = () => setIsFinePointer(query.matches)

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return isFinePointer
}

export type SidebarDockItemData<T extends string> = {
  id: T
  label: string
  icon: LucideIcon
  count: number
}

type SidebarDockItemProps<T extends string> = {
  item: SidebarDockItemData<T>
  active: boolean
  effectsEnabled: boolean
  mouseY: MotionValue<number>
  onSelect: (id: T) => void
}

function SidebarDockItem<T extends string>({
  item,
  active,
  effectsEnabled,
  mouseY,
  onSelect,
}: SidebarDockItemProps<T>) {
  const itemRef = useRef<HTMLButtonElement>(null)
  const mouseDistance = useTransform(mouseY, (value) => {
    const rect = itemRef.current?.getBoundingClientRect()
    if (!rect) return Number.POSITIVE_INFINITY
    return value - rect.top - rect.height / 2
  })
  const heightTarget = useTransform(
    mouseDistance,
    [-DOCK_DISTANCE, 0, DOCK_DISTANCE],
    [BASE_ITEM_HEIGHT, MAGNIFIED_ITEM_HEIGHT, BASE_ITEM_HEIGHT],
  )
  const iconScaleTarget = useTransform(mouseDistance, [-DOCK_DISTANCE, 0, DOCK_DISTANCE], [1, 1.16, 1])
  const contentShiftTarget = useTransform(mouseDistance, [-DOCK_DISTANCE, 0, DOCK_DISTANCE], [0, 3, 0])
  const height = useSpring(heightTarget, dockSpring)
  const iconScale = useSpring(iconScaleTarget, dockSpring)
  const contentShift = useSpring(contentShiftTarget, dockSpring)
  const Icon = item.icon

  const focusItem = () => {
    if (!effectsEnabled || !itemRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    mouseY.set(rect.top + rect.height / 2)
  }

  return (
    <motion.button
      ref={itemRef}
      type="button"
      className={`nav-item sidebar-dock-item ${active ? 'active' : ''}`}
      style={effectsEnabled ? { height } : {}}
      onClick={() => onSelect(item.id)}
      onFocus={focusItem}
      onBlur={() => mouseY.set(Number.POSITIVE_INFINITY)}
      aria-current={active ? 'page' : undefined}
    >
      <motion.span className="sidebar-dock-icon" style={effectsEnabled ? { scale: iconScale, x: contentShift } : {}}>
        <Icon size={16} aria-hidden="true" />
      </motion.span>
      <motion.span className="sidebar-dock-copy" style={effectsEnabled ? { x: contentShift } : {}}>
        {item.label}
      </motion.span>
      <em className="nav-count">{item.count}</em>
    </motion.button>
  )
}

export function SidebarDockGroup<T extends string>({
  label,
  items,
  activeId,
  onSelect,
}: {
  label: string
  items: SidebarDockItemData<T>[]
  activeId: T
  onSelect: (id: T) => void
}) {
  const mouseY = useMotionValue(Number.POSITIVE_INFINITY)
  const reduceMotion = useReducedMotion()
  const finePointer = useDockPointer()
  const effectsEnabled = finePointer && !reduceMotion

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!effectsEnabled || event.pointerType === 'touch') return
    mouseY.set(event.clientY)
  }

  useEffect(() => {
    if (!effectsEnabled) mouseY.set(Number.POSITIVE_INFINITY)
  }, [effectsEnabled, mouseY])

  return (
    <div
      className="nav-group sidebar-dock-group"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => mouseY.set(Number.POSITIVE_INFINITY)}
      data-effects={effectsEnabled ? 'enabled' : 'disabled'}
    >
      <p className="nav-label">{label}</p>
      {items.map((item) => (
        <SidebarDockItem
          key={item.id}
          item={item}
          active={activeId === item.id}
          effectsEnabled={effectsEnabled}
          mouseY={mouseY}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
