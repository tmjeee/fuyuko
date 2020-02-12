import {Level} from './level.model';
import {Status} from './status.model';
import {Progress} from './progress.model';

export interface JobLog {
    id: number;
    creationDate: Date;
    lastUpdate: Date;
    level: Level;
    message: string;
}

export interface Job {
    id: number;
    name: string;
    description: string;
    creationDate: Date;
    lastUpdate: Date;
    progress: Progress;
    status: Status;
}

export interface JobAndLogs {
    job: Job;
    logs: JobLog[];
}
