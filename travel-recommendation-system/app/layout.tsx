import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'TripFactory | Find Your Perfect Destination',
  description: 'Discover amazing travel destinations tailored to your budget, timeline, and interests. Plan your next adventure with personalized recommendations.',
  icons: {
    icon: '/favicon.ico',
  },
}

import { SiteHeader } from '@/components/site-header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <SiteHeader />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
