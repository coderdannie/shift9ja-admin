export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

export interface WaitlistEntry {
  uuid: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  metadata?: {
    source?: string;
  };
}
