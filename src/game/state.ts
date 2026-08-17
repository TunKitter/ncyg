import { atom } from 'jotai'
import { BINARY_REWARD, UNLOCKED_SYNTAXES, randomSnippet } from './snippets'
import { PROJECTS, parseReqKey } from './projects'
import { EMPLOYEE_DEFS, getEmployeeDef, hireCost, upgradeCost } from './employees'
import type { HiredEmployee, Inventory, LanguageId, Snippet, SyntaxId } from './types'

export const binaryAtom = atom(1000)
export const inventoryAtom = atom<Inventory>({})

/** How many projects the studio can hold at once. Buyable later. */
export const PROJECT_SLOTS = 3

// --- Manual typing -------------------------------------------------------

export const currentSnippetAtom = atom<Snippet>(randomSnippet(UNLOCKED_SYNTAXES))
/** How many characters of the current snippet are correctly typed. */
export const typedAtom = atom('')

/** Snippets finished by hand, for the Stats screen later. */
export const linesWrittenAtom = atom(0)

/** Adds one item to the inventory. The single place stock goes up. */
function addItem(
  inventory: Inventory,
  language: LanguageId,
  syntax: SyntaxId,
  amount: number,
): Inventory {
  const forLanguage = inventory[language] ?? {}
  return {
    ...inventory,
    [language]: { ...forLanguage, [syntax]: (forLanguage[syntax] ?? 0) + amount },
  }
}

/** Commits the finished snippet: +1 item, +binary, then serves a new snippet. */
export const completeSnippetAtom = atom(null, (get, set) => {
  const snippet = get(currentSnippetAtom)

  set(inventoryAtom, (prev) => addItem(prev, snippet.language, snippet.syntax, 1))
  set(binaryAtom, (prev) => prev + BINARY_REWARD[snippet.syntax])
  set(linesWrittenAtom, (prev) => prev + 1)

  set(typedAtom, '')
  set(currentSnippetAtom, randomSnippet(UNLOCKED_SYNTAXES, snippet.text))
})

// --- Projects ------------------------------------------------------------

/**
 * Ids of the projects currently on the board, one per slot. Delivering frees a
 * slot, which the next undelivered project fills.
 */
export const activeProjectIdsAtom = atom<string[]>(
  PROJECTS.slice(0, PROJECT_SLOTS).map((p) => p.id),
)

/** How far down PROJECTS the board has reached, so refills never repeat. */
export const nextProjectCursorAtom = atom(PROJECT_SLOTS)

export const activeProjectsAtom = atom((get) => {
  const ids = get(activeProjectIdsAtom)
  const inventory = get(inventoryAtom)

  return ids.map((id) => {
    const project = PROJECTS.find((p) => p.id === id)!

    const requirements = Object.entries(project.requirements).map(([key, need]) => {
      const { language, syntax } = parseReqKey(key)
      const have = inventory[language]?.[syntax] ?? 0
      return { key, language, syntax, need, have, met: have >= need }
    })

    return { project, requirements, canDeliver: requirements.every((r) => r.met) }
  })
})

/** Consumes the required items, pays the reward, and refills the slot. */
export const deliverProjectAtom = atom(null, (get, set, projectId: string) => {
  const entry = get(activeProjectsAtom).find((e) => e.project.id === projectId)
  if (!entry || !entry.canDeliver) return

  const { project } = entry

  set(inventoryAtom, (prev) => {
    let next = prev
    for (const [key, need] of Object.entries(project.requirements)) {
      const { language, syntax } = parseReqKey(key)
      next = addItem(next, language, syntax, -need)
    }
    return next
  })

  set(binaryAtom, (prev) => prev + project.reward)

  // Refill this slot in place, so the board does not reshuffle under the cursor.
  const cursor = get(nextProjectCursorAtom)
  const replacement = PROJECTS[cursor]

  set(activeProjectIdsAtom, (prev) =>
    replacement
      ? prev.map((id) => (id === projectId ? replacement.id : id))
      : prev.filter((id) => id !== projectId),
  )
  if (replacement) set(nextProjectCursorAtom, cursor + 1)
})

// --- Employees -----------------------------------------------------------

export const employeesAtom = atom<HiredEmployee[]>([])

export const hireOptionsAtom = atom((get) => {
  const employees = get(employeesAtom)
  const binary = get(binaryAtom)

  return EMPLOYEE_DEFS.map((def) => {
    const owned = employees.filter((e) => e.defId === def.defId).length
    const cost = hireCost(def, owned)
    return { def, owned, cost, affordable: binary >= cost }
  })
})

export const hireEmployeeAtom = atom(null, (get, set, defId: string) => {
  const option = get(hireOptionsAtom).find((o) => o.def.defId === defId)
  if (!option || !option.affordable) return

  set(binaryAtom, (prev) => prev - option.cost)
  set(employeesAtom, (prev) => [
    ...prev,
    {
      instanceId: crypto.randomUUID(),
      defId,
      upgradeLevel: 0,
      // Start on the first thing they know, so a new hire is never dead weight.
      assignment: option.def.baseSyntaxes[0] ?? null,
      progress: 0,
    },
  ])
})

export const upgradeEmployeeAtom = atom(null, (get, set, instanceId: string) => {
  const employee = get(employeesAtom).find((e) => e.instanceId === instanceId)
  if (!employee) return

  const def = getEmployeeDef(employee.defId)
  if (employee.upgradeLevel >= def.upgradePath.length) return

  const cost = upgradeCost(def, employee.upgradeLevel)
  if (get(binaryAtom) < cost) return

  set(binaryAtom, (prev) => prev - cost)
  set(employeesAtom, (prev) =>
    prev.map((e) => (e.instanceId === instanceId ? { ...e, upgradeLevel: e.upgradeLevel + 1 } : e)),
  )
})

export const assignEmployeeAtom = atom(
  null,
  (_get, set, instanceId: string, syntax: SyntaxId | null) => {
    set(employeesAtom, (prev) =>
      // Reset progress so switching tasks does not carry over half a line.
      prev.map((e) => (e.instanceId === instanceId ? { ...e, assignment: syntax, progress: 0 } : e)),
    )
  },
)

// --- Notifications -------------------------------------------------------

export interface Toast {
  id: number
  employeeName: string
  syntax: SyntaxId
  language: LanguageId
  count: number
}

/** Newest first. Trimmed so a long idle stretch cannot flood the screen. */
export const toastsAtom = atom<Toast[]>([])

const MAX_TOASTS = 4
let nextToastId = 0

export const dismissToastAtom = atom(null, (_get, set, id: number) => {
  set(toastsAtom, (prev) => prev.filter((t) => t.id !== id))
})

// --- Tick ----------------------------------------------------------------

/**
 * Advances every assigned employee by `deltaSeconds`. Deliberately takes the
 * delta rather than assuming a fixed interval, so the same call handles both a
 * 100ms frame and "you were offline for three hours".
 */
export const tickAtom = atom(null, (get, set, deltaSeconds: number) => {
  const employees = get(employeesAtom)
  if (employees.length === 0) return

  const produced: {
    employeeName: string
    language: LanguageId
    syntax: SyntaxId
    count: number
  }[] = []

  const advanced = employees.map((employee) => {
    if (!employee.assignment) return employee

    const def = getEmployeeDef(employee.defId)
    const progress = employee.progress + def.speed * deltaSeconds
    const finished = Math.floor(progress)

    if (finished > 0) {
      produced.push({
        employeeName: def.name,
        language: def.language,
        syntax: employee.assignment,
        count: finished,
      })
    }

    return { ...employee, progress: progress - finished }
  })

  set(employeesAtom, advanced)

  if (produced.length === 0) return

  set(inventoryAtom, (prev) =>
    produced.reduce((acc, p) => addItem(acc, p.language, p.syntax, p.count), prev),
  )

  set(toastsAtom, (prev) =>
    [
      ...produced.map((p) => ({ id: nextToastId++, ...p })),
      ...prev,
    ].slice(0, MAX_TOASTS),
  )
})
