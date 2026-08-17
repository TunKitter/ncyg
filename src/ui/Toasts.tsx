import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { dismissToastAtom, toastsAtom, type Toast } from '../game/state'
import { LANGUAGE_LABEL } from '../game/snippets'

const LIFETIME_MS = 2200

function ToastRow({ toast }: { toast: Toast }) {
  const dismiss = useSetAtom(dismissToastAtom)

  useEffect(() => {
    const id = setTimeout(() => dismiss(toast.id), LIFETIME_MS)
    return () => clearTimeout(id)
  }, [toast.id, dismiss])

  return (
    <li className="animate-[toast-in_150ms_ease-out] rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-slate-900">{toast.employeeName}</p>
      <p className="mt-0.5 font-mono text-xs text-slate-500">
        +{toast.count} {toast.syntax}
        <span className="text-slate-300"> · {LANGUAGE_LABEL[toast.language]}</span>
      </p>
    </li>
  )
}

export function Toasts() {
  const toasts = useAtomValue(toastsAtom)

  return (
    <ul
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-20 z-50 flex w-52 flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastRow key={toast.id} toast={toast} />
      ))}
    </ul>
  )
}
