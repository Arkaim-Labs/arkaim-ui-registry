export type AppScope = "all" | string

export const appScopeStorageKey = "arkaim-admin:app-scope"

export const appScopeOptions: { value: AppScope; label: string }[] = [
  { value: "all", label: "All apps" },
]
