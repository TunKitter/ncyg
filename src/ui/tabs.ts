import { atom } from 'jotai'

export const TABS = [
  { id: 'studio', label: 'Studio' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
  { id: 'store', label: 'Store' },
] as const

export type TabId = (typeof TABS)[number]['id']

export const activeTabAtom = atom<TabId>('studio')
