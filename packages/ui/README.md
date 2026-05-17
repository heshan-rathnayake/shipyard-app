# @shipyard/ui

Shared component library for Shipyard. All components are [shadcn/ui](https://ui.shadcn.com) components — built on Radix UI primitives, styled with Tailwind CSS, and owned directly in this package.

## Components

Import path: `@shipyard/ui/components/<name>`

| Component | Import |
|-----------|--------|
| Avatar | `@shipyard/ui/components/avatar` |
| Badge | `@shipyard/ui/components/badge` |
| Breadcrumb | `@shipyard/ui/components/breadcrumb` |
| Button | `@shipyard/ui/components/button` |
| Card | `@shipyard/ui/components/card` |
| Collapsible | `@shipyard/ui/components/collapsible` |
| Dialog | `@shipyard/ui/components/dialog` |
| Dropdown Menu | `@shipyard/ui/components/dropdown-menu` |
| Input | `@shipyard/ui/components/input` |
| Label | `@shipyard/ui/components/label` |
| Progress | `@shipyard/ui/components/progress` |
| Select | `@shipyard/ui/components/select` |
| Separator | `@shipyard/ui/components/separator` |
| Sheet | `@shipyard/ui/components/sheet` |
| Sidebar | `@shipyard/ui/components/sidebar` |
| Skeleton | `@shipyard/ui/components/skeleton` |
| Spinner | `@shipyard/ui/components/spinner` |
| Table | `@shipyard/ui/components/table` |
| Tabs | `@shipyard/ui/components/tabs` |
| Textarea | `@shipyard/ui/components/textarea` |
| Tooltip | `@shipyard/ui/components/tooltip` |

## Hooks

```ts
import { useIsMobile } from "@shipyard/ui/hooks/use-mobile";

const isMobile = useIsMobile(); // true when viewport < 768px
```

## Utilities

```ts
import { cn } from "@shipyard/ui/lib/utils";

// Merges Tailwind classes, resolving conflicts correctly
cn("px-4 py-2", isActive && "bg-primary", className);
```

## Adding a new component

Use the shadcn CLI, targeting the web app (it reads `components.json` and writes into `packages/ui`):

```sh
yarn workspace @shipyard/web dlx shadcn@latest add button
```

The CLI adds the component to `packages/ui/src/components/` and it is immediately importable — the wildcard export `./*` in `package.json` picks it up automatically.
