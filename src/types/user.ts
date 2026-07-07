import type { User } from './dashboard';

export interface UserListItem extends User {
  email: string;
  phoneNumber: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export type UserListResponse = UserListItem[];

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  verifiedHelpers?: number;
  verifiedClients?: number;
  totalVerifiedUsers?: number;
  flaggedAccounts?: number;
  [key: string]: any;
}
