import { CapabilityPage } from '@/components/capability/CapabilityPage'
import { QuestionAnsweringDemo } from '@/components/demo/QuestionAnsweringDemo'

export function QuestionAnsweringPage() {
  return <CapabilityPage taskId="question-answering" demo={<QuestionAnsweringDemo />} />
}
