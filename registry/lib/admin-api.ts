export const adminSessionChangedEvent = "arkaim-admin-session-changed"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api"

export class AdminApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "AdminApiError"
    this.status = status
  }
}

export type AdminApiFetcher = <T>(path: string, init?: RequestInit) => Promise<T>

export function notifyAdminSessionChanged() {
  window.dispatchEvent(new Event(adminSessionChangedEvent))
}

export function clearAdminSessionToken() {
  notifyAdminSessionChanged()
}

export async function adminApiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(init?.headers)
  if (init?.body !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers,
  })

  if (!response.ok) {
    if (
      response.status === 401 &&
      path !== "/internal/admin/me" &&
      !path.endsWith("/auth/login")
    ) {
      notifyAdminSessionChanged()
    }

    let message = `Admin API request failed with ${response.status}`
    try {
      const body = await response.json() as Record<string, unknown>
      if (typeof body.error === "string") message = body.error
      else if (typeof body.message === "string") message = body.message
    } catch {
      // non-JSON body — keep the default message
    }

    throw new AdminApiError(message, response.status)
  }

  return response.json() as Promise<T>
}

/**
 * Creates a resource-scoped API client for a hook. All requests are
 * prefixed with `basePath`, eliminating the local `requestX<T>(path, init)`
 * wrapper that every hook used to need. The `fetcher` defaults to the
 * built-in `adminApiRequest`, but accepts any injectable client so the
 * same hooks can be reused outside the Arkaim admin.
 *
 * @example
 * const api = createResourceApi("/internal/admin/applications")
 * await api.get<ApplicationRecord[]>()
 * await api.post<ApplicationRecord>("", draft)
 * await api.patch<ApplicationRecord>(`/${id}/status`, { status })
 * await api.del<ApplicationRecord>(`/${id}/allowed-origins/${originId}`)
 */
export function createResourceApi(
  basePath: string,
  fetcher: AdminApiFetcher = adminApiRequest
) {
  function request<T>(subpath = "", init?: RequestInit): Promise<T> {
    return fetcher<T>(`${basePath}${subpath}`, init)
  }
  function get<T>(subpath = ""): Promise<T> {
    return request<T>(subpath)
  }
  function post<T>(subpath: string, body?: unknown): Promise<T> {
    const init: RequestInit = { method: "POST" }
    if (body !== undefined) init.body = JSON.stringify(body)
    return request<T>(subpath, init)
  }
  function patch<T>(subpath: string, body?: unknown): Promise<T> {
    const init: RequestInit = { method: "PATCH" }
    if (body !== undefined) init.body = JSON.stringify(body)
    return request<T>(subpath, init)
  }
  function del<T>(subpath: string): Promise<T> {
    return request<T>(subpath, { method: "DELETE" })
  }
  return { del, get, patch, post, request }
}
