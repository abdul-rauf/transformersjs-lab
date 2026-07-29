import { CapabilityPage } from '@/components/capability/CapabilityPage'
import { SpeechRecognitionDemo } from '@/components/demo/SpeechRecognitionDemo'

export function SpeechRecognitionPage() {
  return <CapabilityPage taskId="speech-recognition" demo={<SpeechRecognitionDemo />} />
}
