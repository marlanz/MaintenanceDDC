/**
 * Centralized application route constants.
 * Never hardcode URL paths across components or services.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FIRST_LOGIN: "/first-login",
  DASHBOARD: "/dashboard",
  TICKETS: {
    LIST: "/tickets",
    NEW: "/tickets/new",
    DETAIL: (id: string) => `/tickets/${id}`,
  },
  MACHINES: {
    LIST: "/machines",
    NEW: "/machines/new",
    DETAIL: (id: string) => `/machines/${id}`,
  },
  SCHEDULES: {
    LIST: "/schedules",
    NEW: "/schedules/new",
    DETAIL: (id: string) => `/schedules/${id}`,
  },
  TOOLS: {
    LIST: "/tools",
    NEW: "/tools/new",
    DETAIL: (id: string) => `/tools/${id}`,
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`,
  },
  PROFILE: "/profile",
} as const;
