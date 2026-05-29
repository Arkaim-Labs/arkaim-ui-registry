import * as React from "react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export type SidebarBrand = {
  label: React.ReactNode
  icon?: React.ReactNode
  href?: string
}

export type SidebarNavItem = {
  key: string
  title: string
  url: string
  icon: React.ReactNode
  badge?: React.ReactNode
}

export type SidebarNavGroup = {
  label?: string
  items: SidebarNavItem[]
  className?: string
}

export type SidebarPrimaryAction = {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  visible?: boolean
  tooltip?: string
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  brand: SidebarBrand
  groups: SidebarNavGroup[]
  user?: { name: string; email: string }
  activePage?: string
  visibleKeys?: Set<string>
  primaryAction?: SidebarPrimaryAction
  onLogout?: () => void
}

function filterGroups(
  groups: SidebarNavGroup[],
  visibleKeys?: Set<string>,
): SidebarNavGroup[] {
  if (!visibleKeys) return groups
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => visibleKeys.has(item.key)),
    }))
    .filter((group) => group.items.length > 0)
}

export function AppSidebar({
  brand,
  groups,
  user,
  activePage,
  visibleKeys,
  primaryAction,
  onLogout,
  ...sidebarProps
}: AppSidebarProps) {
  const visibleGroups = filterGroups(groups, visibleKeys)
  const showPrimaryAction = primaryAction && primaryAction.visible !== false

  return (
    <Sidebar collapsible="icon" aria-label="Primary navigation" {...sidebarProps}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href={brand.href ?? "#"}>
                {brand.icon}
                <span className="text-base font-semibold">{brand.label}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {visibleGroups.map((group, index) => {
          const isFirstGroup = index === 0
          const groupClassName = cn(group.className)

          return (
            <SidebarGroup key={group.label ?? `group-${index}`} className={groupClassName}>
              {group.label ? (
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent
                className={isFirstGroup && showPrimaryAction ? "flex flex-col gap-2" : undefined}
              >
                {isFirstGroup && showPrimaryAction ? (
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip={primaryAction.tooltip ?? primaryAction.label}
                        className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                        onClick={primaryAction.onClick}
                      >
                        {primaryAction.icon}
                        <span>{primaryAction.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                ) : null}
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.key === activePage}
                        tooltip={item.title}
                      >
                        <a href={item.url}>
                          {item.icon}
                          <span>{item.title}</span>
                          {item.badge ? (
                            <span className="ml-auto font-mono text-[0.65rem] text-muted-foreground">
                              {item.badge}
                            </span>
                          ) : null}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      {user ? (
        <SidebarFooter>
          <NavUser onLogout={onLogout} user={user} />
        </SidebarFooter>
      ) : null}
      <SidebarRail />
    </Sidebar>
  )
}
