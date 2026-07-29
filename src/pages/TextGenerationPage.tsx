import { CapabilityPage } from '@/components/capability/CapabilityPage'
import { TextGenerationDemo } from '@/components/demo/TextGenerationDemo'

export function TextGenerationPage() {
  return <CapabilityPage taskId="text-generation" demo={<TextGenerationDemo />} />
}
