import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/content/navigation'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const sections = [...new Set(NAV_ITEMS.map((i) => i.section ?? 'General'))]

  return (
    <aside className="app-sidebar fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Technology Explorer</p>
        <h1 className="mt-1 text-base font-semibold leading-snug">Browser AI</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Powered by Transformers.js</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {sections.map((section) => (
          <div key={section} className="mb-4">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section}
            </p>
            <ul className="space-y-0.5">
              {NAV_ITEMS.filter((i) => (i.section ?? 'General') === section).map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-md px-2 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'text-sidebar-foreground/80 hover:bg-muted hover:text-foreground',
                      )
                    }
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
