import { useAtomValue, useSetAtom } from 'jotai'
import { activeProjectsAtom, deliverProjectAtom } from '../game/state'
import { LANGUAGE_LABEL } from '../game/snippets'

export function ProjectsScreen() {
  const board = useAtomValue(activeProjectsAtom)
  const deliver = useSetAtom(deliverProjectAtom)

  if (board.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Every project delivered — no new clients yet.
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-3">
      {board.map(({ project, requirements, canDeliver }) => (
        <section
          key={project.id}
          className="flex flex-col rounded-lg border border-slate-200 bg-white"
        >
          <header className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold">{project.name}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{project.client}</p>
          </header>

          <ul className="flex-1 space-y-3 px-4 py-4">
            {requirements.map((r) => (
              <li key={r.key}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-mono">{r.syntax}</span>
                  <span className="text-xs text-slate-400">{LANGUAGE_LABEL[r.language]}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={r.met ? 'h-full bg-emerald-500' : 'h-full bg-slate-400'}
                      style={{ width: `${Math.min(100, (r.have / r.need) * 100)}%` }}
                    />
                  </div>
                  <span
                    className={
                      r.met
                        ? 'w-14 text-right font-mono text-xs text-emerald-600'
                        : 'w-14 text-right font-mono text-xs text-slate-500'
                    }
                  >
                    {r.have}/{r.need}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <footer className="border-t border-slate-200 px-4 py-3">
            <p className="text-xs text-slate-500">
              Reward: <span className="font-mono text-slate-900">{project.reward} ₿</span>
            </p>
            <button
              type="button"
              onClick={() => deliver(project.id)}
              disabled={!canDeliver}
              className="mt-2.5 w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white enabled:hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400"
            >
              Deliver
            </button>
          </footer>
        </section>
      ))}
    </div>
  )
}
