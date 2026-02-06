import { Destination } from './destinations'

const API_BASE_URL = 'http://localhost:8080/api/recommendations'
const EXCHANGE_RATE = 84 // 1 USD = 84 INR

export async function getAllDestinations(): Promise<Destination[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/destinations`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch destinations')
        const data = await res.json()
        return data.map((d: any) => mapBackendToFrontend(d))
    } catch (error) {
        console.error('Error fetching destinations:', error)
        return []
    }
}

export async function getRecommendations(filters: {
    budget: [number, number]
    duration: number
    interests: string[]
    country?: string // Add country
    limit?: number
}): Promise<Destination[]> {
    try {
        // Convert INR filters to USD for backend
        const minBudgetUSD = Math.round(filters.budget[0] / EXCHANGE_RATE)
        const maxBudgetUSD = Math.round(filters.budget[1] / EXCHANGE_RATE)

        const res = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify({
                budget: maxBudgetUSD, // Keep for scoring
                duration: filters.duration, // Keep for scoring
                minBudget: minBudgetUSD,
                maxBudget: maxBudgetUSD,
                minDuration: filters.duration,
                maxDuration: filters.duration,
                interests: filters.interests,
                country: filters.country, // Add country
                limit: filters.limit,
            }),
        })

        if (!res.ok) throw new Error('Failed to fetch recommendations')
        const data = await res.json()
        console.log('API Response:', data)
        // API returns RecommendationResponse { recommendations: [ { destination: ..., reason: ... } ] }
        return data.recommendations.map((item: any) => {
            console.log('Mapping Item:', item.destination.name, item.destination.minBudget, item.destination.maxBudget)
            return mapBackendToFrontend(item.destination, item.reason)
        })
    } catch (error) {
        console.error('Error fetching recommendations:', error)
        return []
    }
}

export async function getDestinationById(id: string): Promise<Destination | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/destinations/${id}`)
        if (!res.ok) return null
        const data = await res.json()
        return mapBackendToFrontend(data)
    } catch (error) {
        console.error('Error fetching destination:', error)
        return null
    }
}

function mapBackendToFrontend(data: any, reason?: string): Destination {
    return {
        id: String(data.id),
        name: data.name,
        country: data.country,
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        // Convert USD to INR
        budgetMin: Math.round(data.minBudget * EXCHANGE_RATE),
        budgetMax: Math.round(data.maxBudget * EXCHANGE_RATE),
        durationMin: data.minDuration,
        durationMax: data.maxDuration,
        interests: data.interests ? data.interests.split(',') : [],
        description: data.description,
        image: data.image || '',
        highlights: data.highlights ? data.highlights.split(',') : [],
        bestTime: data.bestTime || '',
        matchReason: reason,
    }
}
