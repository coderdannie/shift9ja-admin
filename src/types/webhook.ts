export interface Webhook {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  provider: string;
  event: string;
  payload: any;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  errorMessage: string | null;
  retryCount: number;
}
