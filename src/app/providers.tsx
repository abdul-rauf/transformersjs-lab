import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppRouter } from '@/app/router'

export function AppProviders({ children }: { children?: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider delayDuration={200}>
        {children ?? <AppRouter />}
      </TooltipProvider>
    </ThemeProvider>
  )
}
