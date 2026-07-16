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
  verificationStatus?: string;
  [key: string]: any;
}

export interface KycVerification {
  uuid: string;
  status: string;
  type?: string | null;
  idNumber?: string | null;
  failureReason?: string | null;
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
  location?: {
    city?: string;
    state?: string;
    country?: string;
    [key: string]: any;
  };
  wallet?: Wallet;
  financialSummary?: {
    totalFunding: number;
    totalWithdrawal: number;
  };
  recentReviews?: UserReview[];
  kycVerification?: KycVerification;
  tasksPostedCount?: number;
  tasksCompletedCount?: number;
  taskStats?: {
    asClient?: {
      open: number;
      assigned: number;
      completed: number;
      cancelled: number;
      disputed: number;
      paid: number;
      offered: number;
      rejected: number;
    };
    asHelper?: {
      open: number;
      assigned: number;
      completed: number;
      cancelled: number;
      disputed: number;
      paid: number;
      offered: number;
      rejected: number;
    };
  };
  metricAverages?: {
    asHelper?: any;
    asClient?: {
      communication: number;
      cooperation: number;
      clarity: number;
    };
  };
  beneficiaries?: Beneficiary[];
}

export interface Beneficiary {
  uuid: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  createdAt: string;
  currency: string;
  deletedAt?: string | null;
  updatedAt: string;
  userId: number;
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

export interface UserGeography {
  state: string;
  city: string;
  userCount: string;
}

export interface UserHeatmap {
  lat: number;
  lng: number;
  userId: number;
}

export interface MarketHealth {
  state: string;
  city: string;
  helperCount: string;
  clientCount: string;
  helperToClientRatio: string;
}

export interface RevenueAnalytics {
  state: string;
  city: string;
  totalRevenue: string;
  averageOrderValue: string;
}

export interface RetentionCohort {
  state: string;
  city: string;
  totalUsers: string;
  active30Days: string;
  active60Days: string;
  active90Days: string;
}

export interface FulfillmentMetrics {
  state: string;
  city: string;
  avgFulfillmentHours: string;
}

export type AnalyticsFilter = "THIS_WEEK" | "THIS_MONTH" | "THIS_YEAR";

export interface AnalyticsQueryParams {
  startDate?: string;
  endDate?: string;
  filter?: AnalyticsFilter;
}

export interface UserCategoryDistribution {
  categoryName: string;
  state: string;
  city: string;
  userCount: number;
}
