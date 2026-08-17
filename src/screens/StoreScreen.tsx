import { useAtomValue, useSetAtom } from 'jotai'
import { hireEmployeeAtom, hireOptionsAtom } from '../game/state'
import { knownSyntaxesForDef } from '../game/employees'
import { LANGUAGE_LABEL } from '../game/snippets'

export function StoreScreen() {
  const options = useAtomValue(hireOptionsAtom)
  const hire = useSetAtom(hireEmployeeAtom)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white">
        <h2 className="border-b border-slate-200 px-4 py-2.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Developers
        </h2>

        <ul className="p-4">
          {options.map(({ def, owned, cost, affordable }) => (
            <li
              key={def.defId}
              className="flex items-center gap-4 border-b border-slate-100 py-3.5 last:border-0"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{def.name}</p>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                    {LANGUAGE_LABEL[def.language]}
                  </span>
                  {owned > 0 && <span className="text-xs text-slate-400">owned {owned}</span>}
                </div>

                <p className="mt-1 font-mono text-xs text-slate-400">
                  {def.speed}/s · writes {knownSyntaxesForDef(def).join(', ')}
                </p>
                {def.upgradePath.length > 0 && (
                  <p className="mt-0.5 font-mono text-xs text-slate-300">
                    can learn {def.upgradePath.join(', ')}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => hire(def.defId)}
                disabled={!affordable}
                className="shrink-0 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white enabled:hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400"
              >
                Hire <span className="font-mono">{cost.toLocaleString()}₿</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-slate-400">
        Each hire of the same role costs more than the last.
      </p>
    </div>
  )
}
