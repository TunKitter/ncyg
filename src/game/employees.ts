import type { EmployeeDef, HiredEmployee, SyntaxId } from './types'

export const EMPLOYEE_DEFS: EmployeeDef[] = [
  {
    defId: 'junior-js',
    name: 'Junior JS Dev',
    language: 'javascript',
    baseSyntaxes: ['console.log'],
    upgradePath: ['variable', 'if'],
    baseHireCost: 60,
    speed: 0.5,
  },
  {
    defId: 'mid-js',
    name: 'Mid JS Dev',
    language: 'javascript',
    baseSyntaxes: ['console.log', 'variable'],
    upgradePath: ['if', 'while', 'function'],
    baseHireCost: 400,
    speed: 1.2,
  },
  {
    defId: 'junior-py',
    name: 'Junior Python Dev',
    language: 'python',
    baseSyntaxes: ['print'],
    upgradePath: ['lambda'],
    baseHireCost: 300,
    speed: 0.5,
  },
]

export function getEmployeeDef(defId: string): EmployeeDef {
  const def = EMPLOYEE_DEFS.find((d) => d.defId === defId)
  if (!def) throw new Error(`Unknown employee def: ${defId}`)
  return def
}

/** Every hire of the same def costs 1.6x the last — the usual idle cost curve. */
export function hireCost(def: EmployeeDef, ownedOfThisDef: number): number {
  return Math.floor(def.baseHireCost * 1.6 ** ownedOfThisDef)
}

/** Upgrades get steeper as an employee learns more. */
export function upgradeCost(def: EmployeeDef, upgradeLevel: number): number {
  return Math.floor(def.baseHireCost * 0.8 * 2 ** upgradeLevel)
}

export function knownSyntaxes(employee: HiredEmployee): SyntaxId[] {
  const def = getEmployeeDef(employee.defId)
  return [...def.baseSyntaxes, ...def.upgradePath.slice(0, employee.upgradeLevel)]
}

/** What a role knows straight out of the store, before any upgrades. */
export function knownSyntaxesForDef(def: EmployeeDef): SyntaxId[] {
  return def.baseSyntaxes
}

export function isFullyUpgraded(employee: HiredEmployee): boolean {
  return employee.upgradeLevel >= getEmployeeDef(employee.defId).upgradePath.length
}

/** The syntax unlocked by the next upgrade, or null when maxed. */
export function nextSyntax(employee: HiredEmployee): SyntaxId | null {
  const def = getEmployeeDef(employee.defId)
  return def.upgradePath[employee.upgradeLevel] ?? null
}
