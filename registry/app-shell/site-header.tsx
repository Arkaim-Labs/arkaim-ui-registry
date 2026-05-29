import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { appScopeOptions, type AppScope } from "@/lib/app-scope"

export function SiteHeader({
  pageTitle = "Overview",
  breadcrumbRoot,
  breadcrumbRootHref = "#overview",
  appScope = "all",
  scopeOptions = appScopeOptions,
  onAppScopeChange,
}: {
  pageTitle?: string
  breadcrumbRoot: string
  breadcrumbRootHref?: string
  appScope?: AppScope
  scopeOptions?: { value: AppScope; label: string }[]
  onAppScopeChange?: (scope: AppScope) => void
}) {
  return (
    <header className="flex h-12 shrink-0 items-center border-b border-border/80 bg-[var(--topbar)] transition-[width,height] ease-linear">
      <div className="flex w-full min-w-0 items-center justify-between gap-2 px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb className="min-w-0 overflow-hidden">
            <BreadcrumbList className="min-w-0 flex-nowrap overflow-hidden">
              <BreadcrumbItem className="hidden sm:inline-flex">
                <BreadcrumbLink href={breadcrumbRootHref}>{breadcrumbRoot}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:inline-flex" />
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="block truncate">
                  {pageTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <NativeSelect
            aria-label="Select app"
            value={appScope}
            onChange={(event) =>
              onAppScopeChange?.(event.target.value as AppScope)
            }
            size="sm"
            className="w-24 sm:w-44"
          >
            {scopeOptions.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
    </header>
  )
}
