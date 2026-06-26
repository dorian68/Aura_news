import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AngleModal } from '@/components/modals/AngleModal'
import { CreditsModal } from '@/components/modals/CreditsModal'
import { FloatingChat } from '@/components/home/FloatingChat'
import { MatchAngleModal } from '@/components/modals/MatchAngleModal'
import { GoalAlert } from '@/components/worldcup/GoalAlert'

export const metadata: Metadata = {
  title: 'AlphaLens Daily',
  description: 'For every story, see what the markets are already pricing — and what it means for your portfolio.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AngleModal />
        <CreditsModal />
        <FloatingChat />
        <MatchAngleModal />
        <GoalAlert />
      </body>
    </html>
  )
}
