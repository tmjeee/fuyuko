import {Level} from './level.model';
import {Status} from './status.model';

export type JobProgress = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export type Level = Level;

export type Status = Status;

export interface Log {
    id: number;
    timestamp: Date;
    level: Level;
    message: string;
}

export interface Job {
    id: number;
    name: string;
    description: string;
    creationDate: Date;
    lastUpdate: Date;
    progress: JobProgress;
    status: Status;
}

export interface JobAndLogs {
    job: Job;
    logs: Log[];
}
