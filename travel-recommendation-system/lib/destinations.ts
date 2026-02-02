export interface Destination {
  id: string
  name: string
  country: string
  rating: number
  reviews: number
  budgetMin: number
  budgetMax: number
  durationMin: number
  durationMax: number
  interests: string[]
  description: string
  image: string
  highlights: string[]
  bestTime: string
  matchReason?: string
}

export interface DestinationFilter {
  budget: [number, number]
  duration: number
  interests: string[]
}
