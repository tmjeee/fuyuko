

export type JobStatus = 'scheduled' | 'in-progress' | 'completed' | 'failed';

export interface Job {
    id: number;
    name: string;
    status: JobStatus;
}
