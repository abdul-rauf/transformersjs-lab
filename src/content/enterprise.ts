export interface EnterpriseUseCase {
  department: string
  problem: string
  howBrowserAIHelps: string
  whyTransformersJs: string
  benefits: string[]
  limitations: string[]
}

export const ENTERPRISE_USE_CASES: EnterpriseUseCase[] = [
  {
    department: 'CRM',
    problem: 'Inbound emails and chats need sentiment/intent tagging before routing, but sending PII to cloud AI raises compliance risk.',
    howBrowserAIHelps: 'Run classification and embeddings locally on the agent desktop or CRM web app.',
    whyTransformersJs: 'Pipeline API + Hub models make it trivial to embed DistilBERT / MiniLM into a React CRM.',
    benefits: ['PII stays in-browser', 'Lower API spend', 'Works in restricted networks'],
    limitations: ['Coarse labels without fine-tuning', 'Large account histories need indexing'],
  },
  {
    department: 'Analytics',
    problem: 'Open-ended survey text is expensive to code manually; cloud APIs may violate data retention policies.',
    howBrowserAIHelps: 'Embed responses and cluster or score them client-side before aggregation.',
    whyTransformersJs: 'Feature-extraction pipelines produce vectors suitable for lightweight analytics UIs.',
    benefits: ['Faster qualitative coding', 'Privacy by default'],
    limitations: ['Browser memory limits batch size', 'Not a full analytics platform'],
  },
  {
    department: 'QA',
    problem: 'Content and UX copy need toxicity / tone checks before release.',
    howBrowserAIHelps: 'Classify strings in CI preview environments or review tools without leaving the browser.',
    whyTransformersJs: 'Same models used in demos can ship inside internal review extensions.',
    benefits: ['Shift-left quality gates', 'No shared staging LLM'],
    limitations: ['Domain taxonomies need fine-tuning'],
  },
  {
    department: 'Support',
    problem: 'Agents need summaries and FAQ answers without leaking ticket text to third parties.',
    howBrowserAIHelps: 'Summarize threads and run extractive QA over trusted macros locally.',
    whyTransformersJs: 'Summarization + QA pipelines cover the two highest-frequency agent assists.',
    benefits: ['Faster handle time', 'Customer data residency'],
    limitations: ['Complex multi-doc tickets need retrieval'],
  },
  {
    department: 'Sales',
    problem: 'Reps want draft follow-ups and similarity search over past wins.',
    howBrowserAIHelps: 'Local generation for short drafts; embeddings for similar opportunity search.',
    whyTransformersJs: 'Small instruct models + MiniLM cover drafting and retrieval without heavy infra.',
    benefits: ['Offline conference mode', 'Lower SaaS AI cost'],
    limitations: ['Draft quality below large cloud LLMs'],
  },
  {
    department: 'HR',
    problem: 'Interview notes and policy Q&A contain sensitive employee data.',
    howBrowserAIHelps: 'Summarize notes and answer policy questions from approved text on-device.',
    whyTransformersJs: 'No server retention — models run where the notes already live.',
    benefits: ['Stronger privacy posture', 'Simpler DPIA story'],
    limitations: ['Not legal advice; human review required'],
  },
  {
    department: 'Legal',
    problem: 'Contracts must not leave the corporate trust boundary casually.',
    howBrowserAIHelps: 'Local embeddings for near-duplicate clauses; extractive QA over playbooks.',
    whyTransformersJs: 'ONNX models run fully client-side inside secured legal workstations/browsers.',
    benefits: ['Reduced exfiltration risk'],
    limitations: ['Not a substitute for counsel or specialized legal AI'],
  },
  {
    department: 'Engineering',
    problem: 'Internal tools need light AI without standing up GPU services.',
    howBrowserAIHelps: 'Ship classification, embeddings, or tiny generation inside SPA admin tools.',
    whyTransformersJs: 'npm package + Vite bundling fits modern frontend stacks.',
    benefits: ['Faster prototyping', 'No MLOps for small models'],
    limitations: ['Bundle size and cold starts need UX care'],
  },
  {
    department: 'Browser Extensions',
    problem: 'Users want rewrite / translate / classify on any page without uploading DOM content.',
    howBrowserAIHelps: 'Extension MV3 pages run Transformers.js against selected text locally.',
    whyTransformersJs: 'Designed for browsers; caches models for repeat use.',
    benefits: ['True client-side privacy', 'Works offline after cache'],
    limitations: ['Extension storage quotas', 'Model size constraints'],
  },
  {
    department: 'Internal Knowledge Base',
    problem: 'Employees need semantic search over wikis without a managed vector database for small corpora.',
    howBrowserAIHelps: 'Embed pages into IndexedDB and rank by cosine similarity in the browser.',
    whyTransformersJs: 'Feature extraction is mature and fast enough for thousands of short chunks.',
    benefits: ['Zero infra for pilots', 'Air-gapped friendly'],
    limitations: ['Scale ceiling — large KBs need a real vector store'],
  },
]
