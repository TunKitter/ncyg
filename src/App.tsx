import { useAtomValue } from 'jotai'
import { TabBar } from './ui/TabBar'
import { Toasts } from './ui/Toasts'
import { activeTabAtom } from './ui/tabs'
import { binaryAtom, employeesAtom } from './game/state'
import { useGameLoop } from './game/useGameLoop'
import { StudioScreen } from './screens/StudioScreen'
import { InventoryScreen } from './screens/InventoryScreen'
import { ProjectsScreen } from './screens/ProjectsScreen'
import { TeamScreen } from './screens/TeamScreen'
import { StoreScreen } from './screens/StoreScreen'

function App() {
  const active = useAtomValue(activeTabAtom)
  const binary = useAtomValue(binaryAtom)
  const employees = useAtomValue(employeesAtom)

  useGameLoop()

  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-900">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <h1 className="font-semibold">CodeCorp Studio</h1>
        <div className="flex items-center gap-5 text-sm">
          <span className="text-slate-500">
            Employees: <span className="font-mono text-slate-900">{employees.length}</span>
          </span>
          <span className="font-mono text-base font-semibold">
            {binary.toLocaleString()} <span className="text-slate-400">₿</span>
          </span>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto p-4">
        {active === 'studio' && <StudioScreen />}
        {active === 'inventory' && <InventoryScreen />}
        {active === 'projects' && <ProjectsScreen />}
        {active === 'team' && <TeamScreen />}
        {active === 'store' && <StoreScreen />}
      </main>

      <TabBar />
      <Toasts />
    </div>
  )
}

export default App
