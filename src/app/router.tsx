import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { BrowserAIPage } from '@/pages/BrowserAIPage'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { ArchitecturePage } from '@/pages/ArchitecturePage'
import { BrowserStoragePage } from '@/pages/BrowserStoragePage'
import { EnterprisePage } from '@/pages/EnterprisePage'
import { DecisionMatrixPage } from '@/pages/DecisionMatrixPage'
import { PerformancePage } from '@/pages/PerformancePage'

const TextClassificationPage = lazy(() =>
  import('@/pages/TextClassificationPage').then((m) => ({ default: m.TextClassificationPage })),
)
const EmbeddingsPage = lazy(() =>
  import('@/pages/EmbeddingsPage').then((m) => ({ default: m.EmbeddingsPage })),
)
const SummarizationPage = lazy(() =>
  import('@/pages/SummarizationPage').then((m) => ({ default: m.SummarizationPage })),
)
const QuestionAnsweringPage = lazy(() =>
  import('@/pages/QuestionAnsweringPage').then((m) => ({ default: m.QuestionAnsweringPage })),
)
const TranslationPage = lazy(() =>
  import('@/pages/TranslationPage').then((m) => ({ default: m.TranslationPage })),
)
const TextGenerationPage = lazy(() =>
  import('@/pages/TextGenerationPage').then((m) => ({ default: m.TextGenerationPage })),
)
const ImageClassificationPage = lazy(() =>
  import('@/pages/ImageClassificationPage').then((m) => ({ default: m.ImageClassificationPage })),
)
const SpeechRecognitionPage = lazy(() =>
  import('@/pages/SpeechRecognitionPage').then((m) => ({ default: m.SpeechRecognitionPage })),
)

function Lazy({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading playground…
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="browser-ai" element={<BrowserAIPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route
            path="text-classification"
            element={
              <Lazy>
                <TextClassificationPage />
              </Lazy>
            }
          />
          <Route
            path="embeddings"
            element={
              <Lazy>
                <EmbeddingsPage />
              </Lazy>
            }
          />
          <Route
            path="summarization"
            element={
              <Lazy>
                <SummarizationPage />
              </Lazy>
            }
          />
          <Route
            path="question-answering"
            element={
              <Lazy>
                <QuestionAnsweringPage />
              </Lazy>
            }
          />
          <Route
            path="translation"
            element={
              <Lazy>
                <TranslationPage />
              </Lazy>
            }
          />
          <Route
            path="text-generation"
            element={
              <Lazy>
                <TextGenerationPage />
              </Lazy>
            }
          />
          <Route
            path="image-classification"
            element={
              <Lazy>
                <ImageClassificationPage />
              </Lazy>
            }
          />
          <Route
            path="speech-recognition"
            element={
              <Lazy>
                <SpeechRecognitionPage />
              </Lazy>
            }
          />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="browser-storage" element={<BrowserStoragePage />} />
          <Route path="architecture" element={<ArchitecturePage />} />
          <Route path="enterprise" element={<EnterprisePage />} />
          <Route path="decision-matrix" element={<DecisionMatrixPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
