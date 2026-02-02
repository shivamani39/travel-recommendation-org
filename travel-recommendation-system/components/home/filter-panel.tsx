'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

interface FilterPanelProps {
  filters: {
    budget: [number, number]
    duration: number
    interests: string[]
  }
  onFiltersChange: (filters: {
    budget: [number, number]
    duration: number
    interests: string[]
  }) => void
  onSearch: () => void
}

const interestOptions = [
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'mountain', label: 'Mountain', emoji: '⛰️' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
  { id: 'adventure', label: 'Adventure', emoji: '🧗' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
]

export default function FilterPanel({ filters, onFiltersChange, onSearch }: FilterPanelProps) {
  const handleBudgetChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      budget: [value[0], value[1]],
    })
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = Number(e.target.value)
    onFiltersChange({
      ...filters,
      duration: newDuration,
    })
  }

  const handleInterestToggle = (id: string) => {
    const newInterests = filters.interests.includes(id)
      ? filters.interests.filter((i) => i !== id)
      : [...filters.interests, id]
    onFiltersChange({
      ...filters,
      interests: newInterests,
    })
  }

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="text-xl">Filter Trips</CardTitle>
        <CardDescription>Customize your search</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Filter */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Budget</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Min: ₹{filters.budget[0].toLocaleString('en-IN')}</span>
              <span className="text-sm text-muted-foreground">Max: ₹{filters.budget[1].toLocaleString('en-IN')}</span>
            </div>
            <Slider
              min={0}
              max={1000000}
              step={10000}
              value={filters.budget}
              onValueChange={handleBudgetChange}
            />
          </div>
        </div>

        {/* Duration Filter */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Duration (Days)</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Length: {filters.duration} days</span>
            </div>
            <input
              type="range"
              min="1"
              max="21"
              step="1"
              value={filters.duration}
              onChange={handleDurationChange}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        {/* Interests Filter */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Interests</label>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleInterestToggle(option.id)}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${filters.interests.includes(option.id)
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
              >
                <span>{option.emoji}</span>
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <Button onClick={onSearch} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold">
          Find My Trip
        </Button>
      </CardContent>
    </Card>
  )
}
