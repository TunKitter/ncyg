import type { LanguageId, ProjectDef, SyntaxId } from './types'

/** Requirement key, so requirements stay a flat map but keep both dimensions. */
export function reqKey(language: LanguageId, syntax: SyntaxId): string {
  return `${language}:${syntax}`
}

export function parseReqKey(key: string): { language: LanguageId; syntax: SyntaxId } {
  const [language, syntax] = key.split(':')
  return { language: language as LanguageId, syntax: syntax as SyntaxId }
}

/**
 * Projects arrive one at a time, in this order. Early ones only ask for syntax
 * the player already has unlocked, so the queue can never hard-block.
 */
export const PROJECTS: ProjectDef[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    client: 'Corner Bakery',
    requirements: {
      [reqKey('javascript', 'console.log')]: 5,
    },
    reward: 40,
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    client: 'Corner Bakery',
    requirements: {
      [reqKey('javascript', 'console.log')]: 8,
      [reqKey('javascript', 'variable')]: 5,
    },
    reward: 90,
  },
  {
    id: 'todo-app',
    name: 'Todo App',
    client: 'Nimbus Labs',
    requirements: {
      [reqKey('javascript', 'variable')]: 12,
      [reqKey('javascript', 'if')]: 8,
    },
    reward: 180,
  },
  {
    id: 'admin-dashboard',
    name: 'Admin Dashboard',
    client: 'Nimbus Labs',
    requirements: {
      [reqKey('javascript', 'console.log')]: 20,
      [reqKey('javascript', 'variable')]: 20,
      [reqKey('javascript', 'if')]: 15,
    },
    reward: 400,
  },
  {
    id: 'inventory-tool',
    name: 'Inventory Tool',
    client: 'Corner Bakery',
    requirements: {
      [reqKey('javascript', 'console.log')]: 30,
      [reqKey('javascript', 'if')]: 25,
    },
    reward: 500,
  },
  {
    id: 'booking-system',
    name: 'Booking System',
    client: 'Vela Travel',
    requirements: {
      [reqKey('javascript', 'variable')]: 45,
      [reqKey('javascript', 'if')]: 35,
    },
    reward: 750,
  },
  {
    id: 'video-streaming',
    name: 'Video Streaming Platform',
    client: 'Acme Inc.',
    requirements: {
      [reqKey('javascript', 'variable')]: 40,
      [reqKey('javascript', 'if')]: 30,
      [reqKey('javascript', 'while')]: 15,
    },
    reward: 900,
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipeline',
    client: 'Acme Inc.',
    requirements: {
      [reqKey('python', 'print')]: 30,
      [reqKey('python', 'lambda')]: 20,
    },
    reward: 1200,
  },
]
