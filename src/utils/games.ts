import { pickRoundItems, shuffle } from './random'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

export function makeWordRounds(words: string[], rounds = words.length, seed: string): string[] {
  return pickRoundItems(words, rounds, seed)
}

export function makeLetterChoices(word: string, seed: string): { display: string; answer: string; choices: string[] } {
  const letters = word.toLowerCase().split('')
  const hiddenIndex = Math.max(0, letters.length - 1)
  const answer = letters[hiddenIndex]
  const distractors = alphabet.filter((letter) => letter !== answer && !letters.includes(letter))
  const choices = shuffle([answer, ...shuffle(distractors, `${seed}-d`).slice(0, 3)], seed)
  const display = letters.map((letter, index) => (index === hiddenIndex ? '_' : letter.toUpperCase())).join(' ')
  return { display, answer, choices }
}

export function makeWordChoices(answer: string, allWords: string[], seed: string, count = 4): string[] {
  const pool = allWords.filter((word) => word !== answer)
  return shuffle([answer, ...shuffle(pool, `${seed}-pool`).slice(0, count - 1)], seed)
}

export function makeNumberSequence(min: number, max: number, steps: number[], seed: string) {
  const step = steps[Math.abs(hashString(seed)) % steps.length]
  const startMin = step < 0 ? min - step * 3 : min
  const startMax = step > 0 ? max - step * 3 : max
  const start = startMin + (Math.abs(hashString(seed)) % Math.max(1, startMax - startMin + 1))
  const sequence = [start, start + step, start + step * 2, start + step * 3]
  const missingIndex = 2
  const answer = sequence[missingIndex]
  const rawChoices = [answer, answer + step, answer - step, answer + step * 2]
  const choices = shuffle(
    rawChoices.filter((value, index, self) => value >= min && value <= max && self.indexOf(value) === index),
    seed,
  )
  return { sequence, missingIndex, answer, choices, step }
}

export function makeNumberNeighbor(min: number, max: number, roundIndex: number, seed: string) {
  const direction: 'avant' | 'après' = roundIndex % 2 === 0 ? 'avant' : 'après'
  const available = Math.max(1, max - min - 1)
  const target = min + 1 + (Math.abs(hashString(`${seed}-${roundIndex}`)) % available)
  const answer = direction === 'avant' ? target - 1 : target + 1
  const nearby = [answer - 2, answer - 1, answer + 1, answer + 2]
    .filter((value, index, values) => value >= min && value <= max && value !== answer && values.indexOf(value) === index)
  const choices = shuffle([answer, ...shuffle(nearby, `${seed}-${roundIndex}-nearby`).slice(0, 3)], `${seed}-${roundIndex}-choices`)
  return { direction, target, answer, choices }
}

export function makeNumberParity(min: number, max: number, roundIndex: number, seed: string) {
  const available = Math.max(1, max - min + 1)
  const value = min + (Math.abs(hashString(`${seed}-${roundIndex}`)) % available)
  return { value, answer: value % 2 === 0 ? 'pair' as const : 'impair' as const }
}

export function makeNumberChoices(answer: number, min: number, max: number, seed: string): number[] {
  const offsets = [-10, -5, -2, 2, 5, 10]
  const pool = offsets.map((offset) => answer + offset).filter((value) => value >= min && value <= max && value !== answer)
  return shuffle([answer, ...shuffle(pool, `${seed}-n`).slice(0, 3)], seed)
}

export function numberToFrench(value: number): string {
  return new Intl.NumberFormat('fr-CA').format(value)
}

function hashString(value: string): number {
  return value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
}
