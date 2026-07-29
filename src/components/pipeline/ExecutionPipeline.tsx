import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TermTooltip } from '@/components/education/TermTooltip'

const DEFAULT_STEPS = [
  { label: 'User Input', tip: null },
  { label: 'Tokenizer', tip: 'Tokenizer' as const },
  { label: 'Tokens', tip: 'Token' as const },
  { label: 'Transformer Model', tip: 'Transformer' as const },
  { label: 'ONNX Runtime', tip: 'ONNX Runtime' as const },
  { label: 'Output', tip: null },
]

interface ExecutionPipelineProps {
  active?: boolean
  labels?: string[]
}

export function ExecutionPipeline({ active = false, labels }: ExecutionPipelineProps) {
  const steps = labels
    ? labels.map((label) => ({ label, tip: null }))
    : DEFAULT_STEPS

  return (
    <div className="flex flex-col items-stretch gap-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-col items-center">
          <div
            className={cn(
              'w-full rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-medium transition-all',
              active && 'animate-pulse-soft border-primary/40 shadow-[0_0_0_1px] shadow-primary/20',
            )}
            style={{ animationDelay: active ? `${i * 120}ms` : undefined }}
          >
            {step.tip ? <TermTooltip term={step.tip}>{step.label}</TermTooltip> : step.label}
          </div>
          {i < steps.length - 1 && (
            <ArrowDown
              className={cn('my-1 h-4 w-4 text-primary/70', active && 'animate-flow-down')}
            />
          )}
        </div>
      ))}
    </div>
  )
}
