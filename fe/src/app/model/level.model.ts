export type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export const LEVELS: Level[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

export interface LogMessage {
    level: Level,
    message: string;
};

