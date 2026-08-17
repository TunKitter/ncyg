export type LanguageId = 'javascript' | 'python'

export type SyntaxId = 'console.log' | 'variable' | 'if' | 'while' | 'function' | 'print' | 'lambda'

/** Inventory is a nested map, so adding a language stays pure data. */
export type Inventory = Partial<Record<LanguageId, Partial<Record<SyntaxId, number>>>>

export interface Snippet {
  syntax: SyntaxId
  language: LanguageId
  /** The exact text the player must retype. */
  text: string
}

export interface ProjectDef {
  id: string
  name: string
  client: string
  /** Items consumed on delivery, keyed by `${language}:${syntax}`. */
  requirements: Record<string, number>
  reward: number
}

export interface EmployeeDef {
  defId: string
  name: string
  /** An employee only ever writes this one language. */
  language: LanguageId
  /** Known at hire time; `upgradePath` adds to this, in order. */
  baseSyntaxes: SyntaxId[]
  upgradePath: SyntaxId[]
  /** Cost of the first hire; each further hire of this def costs more. */
  baseHireCost: number
  /** Lines written per second. */
  speed: number
}

export interface HiredEmployee {
  /** Unique per hire, so you can own several of the same def. */
  instanceId: string
  defId: string
  /** Unlocks `upgradePath.slice(0, upgradeLevel)`. */
  upgradeLevel: number
  /** Which syntax this employee is currently writing; null means idle. */
  assignment: SyntaxId | null
  /** Fractional lines banked toward the next finished item. */
  progress: number
}
