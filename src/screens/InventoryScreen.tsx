import { useAtomValue } from 'jotai'
import { inventoryAtom } from '../game/state'
import { LANGUAGE_LABEL } from '../game/snippets'
import type { LanguageId, SyntaxId } from '../game/types'

export function InventoryScreen() {
  const inventory = useAtomValue(inventoryAtom)
  const languages = Object.keys(inventory) as LanguageId[]

  if (languages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Nothing written yet — head to Studio.
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {languages.map((language) => {
        const items = inventory[language] ?? {}
        const syntaxes = Object.keys(items) as SyntaxId[]
        const total = syntaxes.reduce((sum, syntax) => sum + (items[syntax] ?? 0), 0)

        return (
          <section key={language} className="rounded-lg border border-slate-200 bg-white">
            <h2 className="flex items-baseline justify-between border-b border-slate-200 px-4 py-2.5">
              <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                {LANGUAGE_LABEL[language]}
              </span>
              <span className="font-mono text-xs text-slate-400">{total}</span>
            </h2>

            <ul className="p-4">
              {syntaxes.map((syntax) => (
                <li
                  key={syntax}
                  className="flex items-baseline justify-between border-b border-slate-50 py-1.5 text-sm last:border-0"
                >
                  <span className="font-mono">{syntax}</span>
                  <span className="font-mono font-medium">{items[syntax]}</span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
