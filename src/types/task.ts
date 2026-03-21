import type { User } from './dashboard.ts';
import type { Dispute } from './dispute';

export type TaskStatus = 'open' | 'assigned' | 'completed' | 'cancelled' | 'disputed' | 'paid';

export interface TaskImage {
  imageUrl: string;
  providerId: string;
}

export interface TaskLocation {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  latitude: string;
  longitude: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface TaskItem {
  id?: number;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  clientId?: number;
  helperId?: number | null;
  title: string;
  clientNote: string;
  category: string;
  budget: string;
  status: TaskStatus;
  dueDate: string;
  instruction: string;
  imageUrls: TaskImage[];
  completionProof?: any | null;
  completionNote?: string | null;
  deliverables?: any | null;
  client: User;
  helper: User | null;
  location?: TaskLocation;
  dispute?: Dispute | null;
}

export interface TaskListParams {
  page?: number;
  limit?: number;
  status?: TaskStatus | '';
  search?: string;
  city?: string;
}
