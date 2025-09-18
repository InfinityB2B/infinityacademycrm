export const DEAL_STATUSES = {
  OPEN: 'OPEN',
  WON: 'WON',
  LOST: 'LOST'
} as const;

export type DealStatus = keyof typeof DEAL_STATUSES;