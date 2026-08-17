import { useAtomValue, useSetAtom } from 'jotai'
import {
  assignEmployeeAtom,
  binaryAtom,
  employeesAtom,
  upgradeEmployeeAtom,
} from '../game/state'
import { getEmployeeDef, knownSyntaxes, nextSyntax, upgradeCost } from '../game/employees'
import { LANGUAGE_LABEL } from '../game/snippets'
import { activeTabAtom } from '../ui/tabs'
import { CircularProgress } from '../ui/CircularProgress'
import type { HiredEmployee, SyntaxId } from '../game/types'

function EmployeeRow({ employee }: { employee: HiredEmployee }) {
  const binary = useAtomValue(binaryAtom)
  const assign = useSetAtom(assignEmployeeAtom)
  const upgrade = useSetAtom(upgradeEmployeeAtom)

  const def = getEmployeeDef(employee.defId)
  const known = knownSyntaxes(employee)
  const learning = nextSyntax(employee)
  const cost = learning ? upgradeCost(def, employee.upgradeLevel) : null

  return (
    <li className="flex gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
      <CircularProgress
        value={employee.assignment ? employee.progress : 0}
        label={
          employee.assignment
            ? `Writing ${employee.assignment}, ${Math.round(employee.progress * 100)}%`
            : 'Idle'
        }
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-sm font-medium">{def.name}</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
            {LANGUAGE_LABEL[def.language]}
          </span>
          <span className="text-xs text-slate-400">Lv.{employee.upgradeLevel + 1}</span>
          <span className="font-mono text-xs text-slate-400">{def.speed}/s</span>

          <div className="ml-auto flex items-center gap-2">
            {cost === null ? (
              <span className="text-xs text-slate-400">Maxed</span>
            ) : (
              <button
                type="button"
                onClick={() => upgrade(employee.instanceId)}
                disabled={binary < cost}
                className="rounded border border-slate-200 px-2.5 py-1 text-xs enabled:hover:border-slate-400 disabled:text-slate-300"
              >
                Learn <span className="font-mono">{learning}</span> · {cost}₿
              </button>
            )}
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-slate-500">Writing:</span>
          {known.map((syntax: SyntaxId) => {
            const active = employee.assignment === syntax
            return (
              <button
                key={syntax}
                type="button"
                onClick={() => assign(employee.instanceId, syntax)}
                className={
                  active
                    ? 'rounded border border-slate-900 bg-slate-900 px-2 py-0.5 font-mono text-xs text-white'
                    : 'rounded border border-slate-200 px-2 py-0.5 font-mono text-xs hover:border-slate-400'
                }
              >
                {syntax}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => assign(employee.instanceId, null)}
            className={
              employee.assignment === null
                ? 'rounded border border-slate-400 bg-slate-100 px-2 py-0.5 text-xs text-slate-600'
                : 'rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-400 hover:border-slate-400'
            }
          >
            idle
          </button>
        </div>
      </div>
    </li>
  )
}

export function TeamScreen() {
  const employees = useAtomValue(employeesAtom)
  const setTab = useSetAtom(activeTabAtom)

  return (
    <div className="mx-auto max-w-3xl">
      <section className="rounded-lg border border-slate-200 bg-white">
        <h2 className="flex items-baseline justify-between border-b border-slate-200 px-4 py-2.5">
          <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Team</span>
          <span className="font-mono text-xs text-slate-400">{employees.length}</span>
        </h2>

        {employees.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-slate-400">No employees yet.</p>
            <button
              type="button"
              onClick={() => setTab('store')}
              className="mt-3 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Go to Store
            </button>
          </div>
        ) : (
          <ul>
            {employees.map((employee) => (
              <EmployeeRow key={employee.instanceId} employee={employee} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
