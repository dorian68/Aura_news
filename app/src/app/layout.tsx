import type { Metadata } from 'next'
import './globals.css'
import { AngleModal } from '@/components/modals/AngleModal'
import { CreditsModal } from '@/components/modals/CreditsModal'
import { FloatingChat } from '@/components/home/FloatingChat'
import { MatchAngleModal } from '@/components/modals/MatchAngleModal'
import { GoalAlert } from '@/components/worldcup/GoalAlert'

export const metadata: Metadata = {
  title: 'AlphaLens Daily',
  description: 'Turn headlines into implied probabilities, scenarios and market impact.',
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
