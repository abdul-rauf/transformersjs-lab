import { useEffect, useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { fetchHubModelsForTask, type HubModelOption } from '@/ai/hubModels'
import { getSelectedModelId, setSelectedModelId } from '@/ai/modelSelection'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import type { TaskId } from '@/types'
import { Label } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ModelSelectorProps {
  taskId: TaskId
  disabled?: boolean
  onModelChange?: (modelId: string) => void
}

export function ModelSelector({ taskId, disabled, onModelChange }: ModelSelectorProps) {
  const { capability } = useDeviceCapability()
  const [options, setOptions] = useState<HubModelOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState(() => getSelectedModelId(taskId))

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const models = await fetchHubModelsForTask(taskId, capability)
      setOptions(models)
      const current = getSelectedModelId(taskId)
      if (!models.some((m) => m.id === current) && models[0]) {
        setSelectedModelId(taskId, models[0].id)
        setSelected(models[0].id)
        onModelChange?.(models[0].id)
      } else {
        setSelected(current)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load Hub models')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, capability?.preferred, capability?.deviceMemoryGB, capability?.webgpu])

  const onChange = (modelId: string) => {
    setSelected(modelId)
    setSelectedModelId(taskId, modelId)
    onModelChange?.(modelId)
  }

  const selectedMeta = options.find((o) => o.id === selected)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={`model-${taskId}`} className="text-xs text-muted-foreground">
          Model (Transformers.js · Hub)
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => void load()}
          disabled={loading || disabled}
          title="Refresh Hub list"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <select
        id={`model-${taskId}`}
        className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 font-mono text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        value={selected}
        disabled={disabled || loading || options.length === 0}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap items-center gap-1.5">
        {selectedMeta?.isDefault && <Badge variant="secondary">Default</Badge>}
        {selectedMeta?.fit === 'recommended' && <Badge variant="success">Fits device</Badge>}
        {selectedMeta?.fit === 'heavy' && <Badge variant="warning">Heavy for device</Badge>}
        {capability && (
          <span className="text-[11px] text-muted-foreground">
            Filtered for {capability.webgpu ? 'WebGPU' : 'WASM'}
            {capability.deviceMemoryGB != null ? ` · ~${capability.deviceMemoryGB} GB RAM` : ''}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Lists Hugging Face models tagged <span className="font-mono">transformers.js</span> for this
        task. Switching clears the warm cache for the previous model — use Pre-warm after changing.
      </p>
    </div>
  )
}
