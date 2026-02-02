'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import HeroSection from '@/components/home/hero-section'
import FilterPanel from '@/components/home/filter-panel'
import DestinationGrid from '@/components/home/destination-grid'
import { getAllDestinations } from '@/lib/api'
import { Destination } from '@/lib/destinations'

export default function Home() {
  const [filters, setFilters] = useState<{
    budget: [number, number]
    duration: number
    interests: string[]
  }>({
    budget: [0, 500000],
    duration: 7,
    interests: [],
  })
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getAllDestinations()
        // Sort by rating for "Popular" and take top 3
        const popular = data.sort((a, b) => b.rating - a.rating).slice(0, 3)
        setDestinations(popular)
      } catch (error) {
        console.error('Failed to load destinations', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handleSearch = () => {
    // Validate filters
    if (filters.budget[0] > filters.budget[1]) {
      alert('Minimum budget cannot be greater than maximum budget')
      return
    }
    // Duration single value always valid if set

    if (filters.interests.length === 0) {
      alert('Please select at least one interest')
      return
    }

    // Store filters in sessionStorage for results page
    sessionStorage.setItem('travelFilters', JSON.stringify(filters))
    window.location.href = '/results'
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          <FilterPanel filters={filters} onFiltersChange={handleFilterChange} onSearch={handleSearch} />

          <div className="md:col-span-2 lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Popular Destinations</h2>
              <p className="text-muted-foreground">Explore handpicked travel recommendations</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <DestinationGrid destinations={destinations} filters={filters} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
