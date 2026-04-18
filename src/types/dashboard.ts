export interface DashboardSummary {
  totalUsers: number;
  activeTasks: number;
  totalEscrowBalance: number;
  revenue: number;
  totalTasksCompleted: number;
}

export interface UserProfile {
  rating?: number;
  clientTasksPosted?: number;
  helperTasksCompleted?: number;
  [key: string]: any;
}

export interface Wallet {
  balance: number;
  currency: string;
  totalFunding: number;
  totalWithdrawal: number;
  escrowBalance: number;
}

export interface UserReview {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  comment: string;
  reviewerRole: string;
  communicationRating?: number | null;
  clarityRating?: number | null;
  cooperationRating?: number | null;
  workQualityRating?: number | null;
  professionalismRating?: number | null;
  timelinessRating?: number | null;
  reviewer: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string | null;
    isEmailVerified?: boolean;
    [key: string]: any;
  };
}

export interface User {
  id?: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  status?: string;
  statusReason?: string | null;
  activeRole?: string;
  roles?: string[];
  isEmailVerified?: boolean;
  isOnboardingComplete?: boolean;
  avatarUrl?: string | null;
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: UserProfile;
  isSuspended?: boolean;
  wallet?: Wallet;
  recentReviews?: UserReview[];
}

export interface TopUsersData {
  topRatedClients: User[];
  topRatedHelpers: User[];
}

export interface ActivityMetadata {
  taskId?: string;
  budget?: number;
  [key: string]: any;
}

export interface PlatformActivity {
  uuid: string;
  type: string;
  description: string;
  metadata: ActivityMetadata;
  actorId: number;
  actorType: 'USER' | 'ADMIN' | 'HELPER';
  subjectId: number;
  subjectType: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardAlertsData {
  openDisputes: number;
  [key: string]: any;
}
