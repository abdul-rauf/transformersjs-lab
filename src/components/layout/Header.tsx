import { Moon, Sun, Maximize2, Minimize2, Cpu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExplainPageButton } from '@/components/education/ExplainPageButton'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import { usePresentationMode } from '@/hooks/useDeviceCapability'
import { cn } from '@/lib/utils'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { capability } = useDeviceCapability()
  const { enabled, toggle } = usePresentationMode()

  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Browser AI Technology Explorer</p>
          <p className="truncate text-xs text-muted-foreground">
            Educational playground for architects & senior engineers
          </p>
        </div>
        <div className="app-header-actions flex flex-shrink-0 items-center gap-2">
          {capability && (
            <Badge variant="outline" className="hide-in-present hidden gap-1 sm:inline-flex">
              <Cpu className="h-3 w-3" />
              {capability.webgpu ? 'WebGPU' : capability.wasm ? 'WASM' : 'Limited'}
            </Badge>
          )}
          <div className="hide-in-present">
            <ExplainPageButton />
          </div>
          <Button
            variant={enabled ? 'default' : 'outline'}
            size="sm"
            onClick={toggle}
            title={enabled ? 'Exit presentation mode' : 'Enter presentation mode'}
          >
            {enabled ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="hidden md:inline">{enabled ? 'Exit present' : 'Present'}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative hide-in-present"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </header>

      {enabled && (
        <Button
          className={cn('presentation-exit shadow-lg')}
          size="sm"
          onClick={toggle}
          title="Exit presentation mode"
        >
          <Minimize2 className="h-4 w-4" />
          Exit presentation
        </Button>
      )}
    </>
  )
}
