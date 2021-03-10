export const ENABLED = 'ENABLED';
export const DISABLED = 'DISABLED';
export const DELETED = 'DELETED';

export const STATUSES  = [ ENABLED, DISABLED, DELETED ] as const;

export type Status = 'ENABLED' | 'DISABLED' | 'DELETED';

