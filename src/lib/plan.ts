/**
 * The skills a study plan can rotate through (review is always part of a study day).
 * Shared by the settings store and the planner.
 */
export const PLAN_AREAS = ['grammar', 'reading', 'listening', 'speaking', 'writing', 'it'] as const
export type PlanArea = (typeof PLAN_AREAS)[number]

/** Minutes a day the learner can give. */
export const PLAN_MINUTES = [15, 20, 30, 45, 60] as const

/** JS weekday numbers: 0 = Sunday … 6 = Saturday. Shown Monday first in the UI. */
export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0] as const
export type Weekday = (typeof WEEKDAYS)[number]
