import { ENTERPRISE_USE_CASES } from '@/content/enterprise'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function EnterprisePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Strategy</p>
        <h1 className="text-3xl font-semibold tracking-tight">Enterprise Use Cases</h1>
        <p className="max-w-2xl text-muted-foreground">
          Grouped by department — problem, Browser AI fit, Transformers.js rationale, benefits, and
          limits.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {ENTERPRISE_USE_CASES.map((uc) => (
              <AccordionItem key={uc.department} value={uc.department}>
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <Badge variant="secondary">{uc.department}</Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <Block title="Problem" body={uc.problem} />
                    <Block title="How Browser AI helps" body={uc.howBrowserAIHelps} />
                    <Block title="Why Transformers.js fits" body={uc.whyTransformersJs} />
                    <div>
                      <p className="font-medium text-foreground">Benefits</p>
                      <ul className="mt-1 list-disc pl-5">
                        {uc.benefits.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Limitations</p>
                      <ul className="mt-1 list-disc pl-5">
                        {uc.limitations.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1">{body}</p>
    </div>
  )
}
