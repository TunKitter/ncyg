import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import { completeSnippetAtom, currentSnippetAtom, linesWrittenAtom, typedAtom } from '../game/state'
import { BINARY_REWARD, LANGUAGE_LABEL } from '../game/snippets'

function CodeLine({ text, typed }: { text: string; typed: string }) {
  return (
    <p className="font-mono text-lg leading-relaxed break-all whitespace-pre-wrap">
      {text.split('').map((char, i) => {
        const isTyped = i < typed.length
        const isCursor = i === typed.length
        return (
          <span
            key={i}
            className={
              isTyped
                ? 'text-slate-900'
                : isCursor
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-300'
            }
          >
            {char}
          </span>
        )
      })}
    </p>
  )
}

function TypingPanel() {
  const snippet = useAtomValue(currentSnippetAtom)
  const [typed, setTyped] = useAtom(typedAtom)
  const complete = useSetAtom(completeSnippetAtom)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrongRef = useRef<HTMLDivElement>(null)

  // Keep focus on the hidden input so typing always lands, even after a click.
  useEffect(() => {
    inputRef.current?.focus()
  }, [snippet])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    // Only accept input that matches the snippet so far; a wrong key is rejected
    // outright rather than punished, and flashes the line instead.
    if (!snippet.text.startsWith(value)) {
      wrongRef.current?.animate(
        [{ transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'none' }],
        { duration: 120 },
      )
      return
    }

    if (value === snippet.text) {
      complete()
      return
    }

    setTyped(value)
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-sm text-slate-500">
          {snippet.syntax} <span className="text-slate-300">·</span>{' '}
          {LANGUAGE_LABEL[snippet.language]}
        </span>
        <span className="font-mono text-xs text-slate-400">
          +1 item · +{BINARY_REWARD[snippet.syntax]} ₿
        </span>
      </div>

      <div
        ref={wrongRef}
        className="mt-4 cursor-text rounded-md bg-slate-50 p-4"
        onClick={() => inputRef.current?.focus()}
      >
        <CodeLine text={snippet.text} typed={typed} />
      </div>

      <input
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        onPaste={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Type the code above"
        className="sr-only"
      />

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-slate-900 transition-[width] duration-75"
          style={{ width: `${(typed.length / snippet.text.length) * 100}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Retype the line to ship it. Wrong keys are ignored — pasting is disabled.
      </p>
    </section>
  )
}

export function StudioScreen() {
  const lines = useAtomValue(linesWrittenAtom)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <TypingPanel />
      <p className="text-xs text-slate-400">Lines shipped: {lines}</p>
    </div>
  )
}
