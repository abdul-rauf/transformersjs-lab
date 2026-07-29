import type { ReactNode } from 'react'
import { GLOSSARY } from '@/content/glossary'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface TermTooltipProps {
  term: keyof typeof GLOSSARY
  children?: ReactNode
}

export function TermTooltip({ term, children }: TermTooltipProps) {
  const text = GLOSSARY[term]
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline border-b border-dotted border-primary/60 text-foreground decoration-primary/60 hover:text-primary"
        >
          {children ?? term}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-semibold text-foreground">{term}</p>
        <p className="mt-1 leading-relaxed text-muted-foreground">{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}
