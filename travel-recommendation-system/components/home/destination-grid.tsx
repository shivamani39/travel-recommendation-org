import { Destination } from '@/lib/destinations'
import DestinationCard from './destination-card'

interface DestinationGridProps {
  destinations: Destination[]
  filters?: {
    budget: [number, number]
    duration: number
  }
}

export default function DestinationGrid({ destinations, filters }: DestinationGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  )
}
