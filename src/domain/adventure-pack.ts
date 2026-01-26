// src/domain/adventure-pack.ts

export interface AdventurePackMeta {
  title: string
  createdAt: string
}

export interface AdventurePackStory {
  synopsis: string
  setting: string
}

export interface AdventurePackCharacter {
  name: string
  role: string
  description: string
}

export interface AdventurePackPuzzle {
  index: 1 | 2
  type: string
  statement: string
  solution: string
  hints: string[]
}

export interface AdventurePackPhase {
  index: 1 | 2 | 3
  title: string
  objective: string
  puzzles: AdventurePackPuzzle[]
}

export interface AdventurePackSetupGuide {
  steps: string[]
  materials: string[]
}

export interface AdventurePackPrintable {
  title: string
  content: string
}

export interface AdventurePack {
  meta: AdventurePackMeta
  story: AdventurePackStory
  characters: AdventurePackCharacter[]
  phases: AdventurePackPhase[]
  setupGuide: AdventurePackSetupGuide
  printables: AdventurePackPrintable[]
}
