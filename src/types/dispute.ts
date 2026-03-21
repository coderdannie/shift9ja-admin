export type DisputeStatus = 'in-review' | 'urgent' | 'resolved' | 'rejected';

export interface DisputeStats {
  totalOpenDisputes: number;
  urgentDisputes: number;
  inReviewDisputes: number;
}

export interface Dispute {
  uuid: string;
  taskTitle: string;
  disputeType: string; // E.g., 'Client', 'Helper' (Raised by)
  reason: string;
  openedAt: string;
  evidenceCount: number;
  status: DisputeStatus;
}
