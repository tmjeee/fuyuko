

export type JobStatus = 'scheduled' | 'in-progress' | 'completed' | 'failed';

export type Level = 'debug' | 'info' | 'warn' | 'error';

export interface Log {
    id: number;
    timestamp: Date;
    level: Level;
    message: string;
}

export interface Job {
    id: number;
    name: string;
    creationDate: Date;
    lastUpdate: Date;
    status: JobStatus;
}

export interface JobAndLogs {
    job: Job;
    logs: Log[];
}
