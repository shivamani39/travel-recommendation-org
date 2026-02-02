'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDestinationById } from '@/lib/api'
import { Destination } from '@/lib/destinations'

const interestEmojis: Record<string, string> = {
  beach: '🏖️',
  mountain: '⛰️',
  culture: '🏛️',
  adventure: '🧗',
  food: '🍜',
  nature: '🌿',
}

export default function DestinationDetailPage() {
  const params = useParams()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)
  const [calculatedDuration, setCalculatedDuration] = useState<number | null>(null)

  useEffect(() => {
    const fetchDestination = async () => {
      if (!params.id) return
      setLoading(true)
      try {
        const data = await getDestinationById(params.id as string)
        setDestination(data)

        // Calculate dynamic pricing if filters exist
        const storedFilters = sessionStorage.getItem('travelFilters')
        if (storedFilters && data) {
          try {
            const filters = JSON.parse(storedFilters)
            const userMinDuration = filters.duration // Single value now

            // Calculate daily rate based on base price and min duration
            // Avoid division by zero
            const baseDuration = data.durationMin > 0 ? data.durationMin : 1
            const dailyRate = data.budgetMin / baseDuration

            // Determine effective duration:
            // Must be at least the trip's min duration
            // But also at least the user's requested min duration
            // And clamped to the trip's max duration
            let effectiveDuration = Math.max(userMinDuration, data.durationMin)
            effectiveDuration = Math.min(effectiveDuration, data.durationMax)

            let price = Math.round(dailyRate * effectiveDuration)

            // Upsell Logic: If price is below user's min budget, try to extend duration
            const userMinBudget = filters.budget[0]
            if (price < userMinBudget) {
              const daysNeeded = Math.ceil(userMinBudget / dailyRate)
              if (daysNeeded <= data.durationMax) {
                effectiveDuration = daysNeeded
                price = Math.round(dailyRate * effectiveDuration)
              }
            }

            setCalculatedPrice(price)
            setCalculatedDuration(effectiveDuration)
          } catch (e) {
            console.error('Error calculating dynamic price', e)
          }
        }
      } catch (error) {
        console.error('Failed to load destination', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDestination()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    )
  }

  if (!destination) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Destination Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The destination you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Image */}
        <div className="rounded-xl overflow-hidden mb-8 h-80 bg-muted">
          <img
            src={destination.image || "/placeholder.svg"}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{destination.name}</h1>
              <p className="text-xl text-muted-foreground">{destination.country}</p>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-bold text-lg">{destination.rating}</p>
                <p className="text-xs text-muted-foreground">{destination.reviews} reviews</p>
              </div>
            </div>
          </div>

          <p className="text-lg text-foreground leading-relaxed">{destination.description}</p>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {calculatedPrice ? 'Estimated Cost' : 'Budget Range'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calculatedPrice ? (
                <>
                  <p className="text-2xl font-bold text-primary">
                    ₹{calculatedPrice.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    for {calculatedDuration} days (approx.)
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-primary">
                    ₹{destination.budgetMin.toLocaleString('en-IN')}–₹{destination.budgetMax.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">per person, estimated</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {calculatedDuration ? 'Your Trip Duration' : 'Trip Duration'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calculatedDuration ? (
                <>
                  <p className="text-2xl font-bold text-secondary">
                    {calculatedDuration} days
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">based on your search</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-secondary">
                    {destination.durationMin}–{destination.durationMax} days
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">recommended</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Best Time to Visit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold text-foreground">{destination.bestTime}</p>
            </CardContent>
          </Card>
        </div>

        {/* Interests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Perfect For</CardTitle>
            <CardDescription>Activities and interests this destination is best for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {destination.interests.map((interest) => (
                <div
                  key={interest}
                  className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  <span className="text-xl">{interestEmojis[interest] || '✨'}</span>
                  <span className="font-semibold text-foreground capitalize">{interest}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Must-See Highlights</CardTitle>
            <CardDescription>Top attractions and experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {destination.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex gap-4 flex-wrap justify-center mb-8">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground py-6 px-8 text-lg font-semibold">
            Plan Trip Now
          </Button>
          <Link href="/">
            <Button variant="outline" className="py-6 px-8 text-lg font-semibold bg-transparent">
              See More Destinations
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
