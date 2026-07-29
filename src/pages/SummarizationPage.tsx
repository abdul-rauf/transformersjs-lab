import { CapabilityPage } from '@/components/capability/CapabilityPage'
import { SummarizationDemo } from '@/components/demo/SummarizationDemo'

export function SummarizationPage() {
  return <CapabilityPage taskId="summarization" demo={<SummarizationDemo />} />
}
