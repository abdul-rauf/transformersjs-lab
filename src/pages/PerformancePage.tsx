import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ALL_MODELS } from '@/ai/registry'
import { usePerformanceMetrics } from '@/hooks/usePerformance'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatMs } from '@/lib/format'

export function PerformancePage() {
  const live = usePerformanceMetrics()
  const { capability } = useDeviceCapability()

  const sizeData = ALL_MODELS.map((m) => ({
    name: m.displayName.replace(/ .*/, ''),
    downloadMB: m.downloadSizeMB,
    memoryMB: m.memoryMB,
  }))

  const timingData = ALL_MODELS.map((m) => {
    const metric = live.find((x) => x.taskId === m.id)
    return {
      name: m.displayName.replace(/ .*/, ''),
      cold: metric?.coldLoadMs ?? 0,
      warm: metric?.warmLoadMs ?? 0,
      infer: metric?.inferenceMs ?? 0,
    }
  })

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Systems</p>
        <h1 className="text-3xl font-semibold tracking-tight">Performance Explorer</h1>
        <p className="max-w-2xl text-muted-foreground">
          Model download sizes, memory estimates, and live cold/warm/inference timings from this
          session.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">
          Preferred backend: {capability?.preferred?.toUpperCase() ?? '…'}
        </Badge>
        <Badge variant={capability?.webgpu ? 'success' : 'warning'}>
          WebGPU {capability?.webgpu ? 'available' : 'unavailable'}
        </Badge>
        <Badge variant={capability?.wasm ? 'success' : 'warning'}>
          WASM {capability?.wasm ? 'available' : 'unavailable'}
        </Badge>
        {capability?.hardwareConcurrency != null && (
          <Badge variant="secondary">{capability.hardwareConcurrency} cores</Badge>
        )}
        {capability?.deviceMemoryGB != null && (
          <Badge variant="secondary">{capability.deviceMemoryGB} GB deviceMemory</Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Download size vs memory estimate</CardTitle>
          <CardDescription>Static estimates from the model registry (MB).</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sizeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="downloadMB" name="Download MB" fill="#0d9488" radius={4} />
              <Bar dataKey="memoryMB" name="Memory MB" fill="#64748b" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cold start vs warm vs inference</CardTitle>
          <CardDescription>
            Populated after you run demos in this tab (sessionStorage). Values in ms.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timingData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cold" name="Cold load" fill="#0f766e" radius={4} />
              <Bar dataKey="warm" name="Warm load" fill="#14b8a6" radius={4} />
              <Bar dataKey="infer" name="Inference" fill="#94a3b8" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session measurements</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border">
                <th className="pb-2 pr-3">Task</th>
                <th className="pb-2 pr-3">Cold</th>
                <th className="pb-2 pr-3">Warm</th>
                <th className="pb-2 pr-3">Inference</th>
                <th className="pb-2">Device</th>
              </tr>
            </thead>
            <tbody>
              {ALL_MODELS.map((m) => {
                const metric = live.find((x) => x.taskId === m.id)
                return (
                  <tr key={m.id} className="border-b border-border/60">
                    <td className="py-2 pr-3 font-medium">{m.displayName}</td>
                    <td className="py-2 pr-3 font-mono text-xs">
                      {formatMs(metric?.coldLoadMs)}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">
                      {formatMs(metric?.warmLoadMs)}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">
                      {formatMs(metric?.inferenceMs)}
                    </td>
                    <td className="py-2 font-mono text-xs">
                      {metric?.device?.toUpperCase() ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
