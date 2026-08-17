import type { LanguageId, Snippet, SyntaxId } from './types'

/** Binary earned per snippet, by syntax. Longer/harder syntax pays more. */
export const BINARY_REWARD: Record<SyntaxId, number> = {
  'console.log': 1,
  variable: 2,
  if: 4,
  while: 6,
  function: 8,
  print: 1,
  lambda: 6,
}

export const LANGUAGE_LABEL: Record<LanguageId, string> = {
  javascript: 'JavaScript',
  python: 'Python',
}

const SNIPPETS: Snippet[] = [
  { syntax: 'console.log', language: 'javascript', text: 'console.log("hello")' },
  { syntax: 'console.log', language: 'javascript', text: 'console.log(user.name)' },
  { syntax: 'console.log', language: 'javascript', text: 'console.log(items.length)' },

  { syntax: 'variable', language: 'javascript', text: 'const total = 0' },
  { syntax: 'variable', language: 'javascript', text: 'let index = items.length' },
  { syntax: 'variable', language: 'javascript', text: 'const name = user.name' },

  { syntax: 'if', language: 'javascript', text: 'if (count > 0) { return true }' },
  { syntax: 'if', language: 'javascript', text: 'if (!user) { return null }' },
  { syntax: 'if', language: 'javascript', text: 'if (a === b) { done = true }' },

  { syntax: 'while', language: 'javascript', text: 'while (i < len) { i++ }' },
  { syntax: 'function', language: 'javascript', text: 'function sum(a, b) { return a + b }' },

  { syntax: 'print', language: 'python', text: 'print("hello")' },
  { syntax: 'lambda', language: 'python', text: 'total = lambda a, b: a + b' },
]

/** Syntaxes the player can type by hand right now. Grows as the game unlocks more. */
export const UNLOCKED_SYNTAXES: SyntaxId[] = ['console.log', 'variable', 'if']

export function randomSnippet(unlocked: SyntaxId[], avoid?: string): Snippet {
  const pool = SNIPPETS.filter((s) => unlocked.includes(s.syntax))
  if (pool.length === 0) throw new Error('No snippets available for unlocked syntaxes')

  // Avoid repeating the snippet just finished, unless it is the only option.
  const candidates = pool.length > 1 && avoid ? pool.filter((s) => s.text !== avoid) : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}
