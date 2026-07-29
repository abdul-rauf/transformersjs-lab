import { useState } from 'react'
import { MessageSquareQuote, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PAGE_EXPLAINS } from '@/content/navigation'
import { useLocation } from 'react-router-dom'

export function ExplainPageButton() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const summary = PAGE_EXPLAINS[pathname] ?? 'Explore this section to learn how Browser AI applies in practice.'

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
        <MessageSquareQuote className="h-4 w-4" />
        Explain this page
      </Button>
      {open && (
        <Card className="absolute right-0 top-11 z-40 w-[min(24rem,calc(100vw-2rem))] animate-fade-in-up shadow-lg">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Presenter notes</CardTitle>
            <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
