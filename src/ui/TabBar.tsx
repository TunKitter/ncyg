import { useAtom } from 'jotai'
import { TABS, activeTabAtom } from './tabs'

export function TabBar() {
  const [active, setActive] = useAtom(activeTabAtom)

  return (
    <nav className="flex shrink-0 justify-center border-t border-slate-200 bg-white">
      <div className="flex gap-1 p-2">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={
                isActive
                  ? 'min-w-24 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white'
                  : 'min-w-24 rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
