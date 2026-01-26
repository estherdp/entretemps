import type { AdventureType, Difficulty, Occasion, Place, Tone } from '@/domain/wizard-data'

export const OCCASION_LABELS: Record<Occasion, string> = {
  birthday: 'Cumpleaños',
  'family-afternoon': 'Tarde en familia',
  party: 'Fiesta',
  excursion: 'Excursión',
}

export const PLACE_LABELS: Record<Place, string> = {
  home: 'Casa',
  garden: 'Jardín',
  park: 'Parque',
  indoor: 'Interior (ludoteca/local)',
  outdoor: 'Exterior (excursión)',
}

export const ADVENTURE_TYPE_LABELS: Record<AdventureType, string> = {
  mystery: 'Misterio',
  adventure: 'Aventura',
  fantasy: 'Fantasía',
  action: 'Acción / Superhéroes',
  humor: 'Humor',
}

export const TONE_LABELS: Record<Tone, string> = {
  funny: 'Divertida',
  enigmatic: 'Enigmática',
  exciting: 'Emocionante',
  calm: 'Tranquila',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Fácil',
  medium: 'Media',
  hard: 'Desafiante',
}
