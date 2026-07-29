import { CapabilityPage } from '@/components/capability/CapabilityPage'
import { TranslationDemo } from '@/components/demo/TranslationDemo'

export function TranslationPage() {
  return <CapabilityPage taskId="translation" demo={<TranslationDemo />} />
}
