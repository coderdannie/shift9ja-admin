export type DisputeStatus = 'open' | 'in_progress' | 'resolved' | 'cancelled' | 'closed';

export interface DisputeStats {
  totalOpenDisputes: number;
  urgentDisputes: number;
  inReviewDisputes: number;
}

export interface DisputeTask {
  uuid: string;
  title: string;
  status: string;
}

export interface DisputeReporter {
  uuid: string;
  firstName: string;
  lastName: string;
  activeRole: string;
}

export interface Dispute {
  uuid: string;
  createdAt: string;
  reason: string;
  category: string;
  priority: string;
  status: DisputeStatus;
  evidence: any[];
  task: DisputeTask;
  reporter: DisputeReporter;
}
