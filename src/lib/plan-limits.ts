export const PLAN_LIMITS = {
  FREE: {
    links: 3,
    socialLinks: 3,
    services: 1,
    payButtons: 1,
  },
  PRO: {
    links: Infinity,
    socialLinks: Infinity,
    services: Infinity,
    payButtons: Infinity,
  },
  BUSINESS: {
    links: Infinity,
    socialLinks: Infinity,
    services: Infinity,
    payButtons: Infinity,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as PlanType] || PLAN_LIMITS.FREE;
}
