'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import DestinationGrid from '@/components/home/destination-grid'
import { getRecommendations, getAllDestinations } from '@/lib/api'
import { type Destination } from '@/lib/destinations'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ResultsPage() {
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  const [sortBy, setSortBy] = useState<'rating' | 'budget' | 'match'>('match')
  const [limit, setLimit] = useState<string>('10')
  const [loading, setLoading] = useState(true)
  const [currentFilters, setCurrentFilters] = useState<{
    budget: [number, number]
    duration: number
  } | undefined>(undefined)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      const storedFilters = sessionStorage.getItem('travelFilters')
      const currentLimit = parseInt(limit)

      if (storedFilters) {
        try {
          const filters = JSON.parse(storedFilters)
          setCurrentFilters(filters)
          // Add limit to filters
          const filtersWithLimit = { ...filters, limit: currentLimit }
          const results = await getRecommendations(filtersWithLimit)
          setFilteredDestinations(results)
        } catch (error) {
          console.error('Failed to fetch recommendations', error)
        }
      } else {
        // No filters? Maybe fetch popular or all?
        try {
          // If getAllDestinations doesn't support limit yet, we might need to slice locally or update it too.
          // For now, let's just slice locally for the "getAll" case if API doesn't support it, 
          // or ideally assume getAllDestinations handles it?
          // The current getAllDestinations implementation in API doesn't take args. 
          // So we should slice locally for fallback.
          const all = await getAllDestinations()
          setFilteredDestinations(all.slice(0, currentLimit))
        } catch (e) { console.error(e) }
      }
      setLoading(false)
    }
    fetchResults()
  }, [limit]) // Refetch when limit changes

  // ... (rest of the component)

  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating
    } else if (sortBy === 'budget') {
      return a.budgetMin - b.budgetMin
    } else {
      // 'match' - keep original order from API (which is sorted by score)
      return 0
    }
  })

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors mb-2 inline-block">
                ← Back to Search
              </Link>
              <h1 className="text-3xl font-bold text-foreground">
                {filteredDestinations.length} Destinations Found
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredDestinations.length === 0
                  ? 'Try adjusting your filters'
                  : 'Select a destination to learn more'}
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2 mr-4">
                <span className="text-sm font-medium">Limit:</span>
                <Select value={limit} onValueChange={setLimit}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant={sortBy === 'match' ? 'default' : 'outline'}
                onClick={() => setSortBy('match')}
                className="whitespace-nowrap"
              >
                Best Match
              </Button>
              <Button
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                onClick={() => setSortBy('rating')}
                className="whitespace-nowrap"
              >
                Top Rated
              </Button>
              <Button
                variant={sortBy === 'budget' ? 'default' : 'outline'}
                onClick={() => setSortBy('budget')}
                className="whitespace-nowrap"
              >
                Best Budget
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : sortedDestinations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Destinations Found</h2>
            <p className="text-muted-foreground mb-8">
              Try adjusting your filters to find more options
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Adjust Filters
              </Button>
            </Link>
          </div>
        ) : (
          <DestinationGrid destinations={sortedDestinations} filters={currentFilters} />
        )}
      </div>
    </main>
  )
}
