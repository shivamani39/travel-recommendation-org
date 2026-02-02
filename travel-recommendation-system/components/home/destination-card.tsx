import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Destination } from '@/lib/destinations'

interface DestinationCardProps {
  destination: Destination
  filters?: {
    budget: [number, number]
    duration: number
  }
}

const interestEmojis: Record<string, string> = {
  beach: '🏖️',
  mountain: '⛰️',
  culture: '🏛️',
  adventure: '🧗',
  food: '🍜',
  nature: '🌿',
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  // Use backend values directly
  const displayBudgetMin = destination.budgetMin
  const displayBudgetMax = destination.budgetMax

  return (
    <Link href={`/destination/${destination.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer group">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={destination.image || "/placeholder.svg"}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Original rating div removed, new structure for title/rating/matchReason is in the content section */}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title, Match Reason & Rating */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-xl mb-1">{destination.name}</h3>
              {destination.matchReason && (
                <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-1 border border-green-200">
                  ✨ {destination.matchReason}
                </div>
              )}
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                <span>{destination.country}</span>
              </p>
            </div>
            <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded">
              <span>⭐</span>
              <span className="font-bold">{destination.rating}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground line-clamp-2">{destination.description}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50 mb-4">
            <div className="text-center p-2 rounded-lg bg-secondary/5">
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Budget</p>
              <p className="font-bold text-foreground">
                ₹{destination.budgetMin.toLocaleString('en-IN')}
                {destination.budgetMin !== destination.budgetMax && `–${destination.budgetMax.toLocaleString('en-IN')}`}
              </p>
            </div>
            <div className="text-center p-2 rounded-lg bg-secondary/5">
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Duration</p>
              <p className="font-bold text-foreground">
                {destination.durationMin}
                {destination.durationMin !== destination.durationMax && `–${destination.durationMax}`} days
              </p>
            </div>
          </div>

          {/* Interests */}
          <div className="flex flex-wrap gap-2 pt-2">
            {destination.interests.slice(0, 3).map((interest) => (
              <span key={interest} className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                <span>{interestEmojis[interest] || '✨'}</span>
                <span className="capitalize">{interest}</span>
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}
