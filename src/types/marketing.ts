// ── Referral & Campaign Management (Admin Marketing) ──────────────────────

export type ReferralStatus =
  | 'PENDING_KYC'
  | 'PENDING_TASK'
  | 'COMPLETED'
  | 'FRAUD_FLAGGED'
  | 'EXPIRED';

export type CampaignType = 'CLIENT_ACQUISITION' | 'SEASONAL' | 'AMBASSADOR';

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'EXHAUSTED' | 'EXPIRED';

export const CAMPAIGN_TYPES: CampaignType[] = ['CLIENT_ACQUISITION', 'SEASONAL', 'AMBASSADOR'];
export const CAMPAIGN_STATUSES: CampaignStatus[] = ['ACTIVE', 'PAUSED', 'EXHAUSTED', 'EXPIRED'];

/** Platform service fee percentage used for unit-economics validation */
export const PLATFORM_FEE_PERCENT = 10;

export interface AdminCampaign {
  id: number;
  uuid: string;
  name: string;
  code: string | null;
  type: CampaignType;
  status: CampaignStatus;
  totalBudget: number;
  spentBudget: number;
  referrerReward: number;
  minQualifyingTaskAmount: number;
  qualificationWindowDays: number;
  holdPeriodHours: number;
  maxClaimsTotal: number | null;
  claimsCount: number;
  startDate: string | null;
  endDate: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignPayload {
  name: string;
  code?: string;
  type?: CampaignType;
  status?: CampaignStatus;
  totalBudget: number;
  referrerReward: number;
  minQualifyingTaskAmount: number;
  qualificationWindowDays?: number;
  holdPeriodHours?: number;
  maxClaimsTotal?: number;
  startDate?: string;
  endDate?: string;
  metadata?: Record<string, any>;
}

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>;

export interface AdminReferralAnalytics {
  funnel: {
    totalReferrals: number;
    pendingKycCount: number;
    pendingTaskCount: number;
    completedCount: number;
    fraudCount: number;
    expiredCount: number;
    conversionRate: string;
  };
  financials: {
    totalGMVGenerated: number;
    totalPlatformRevenue: number;
    totalBonusesPaid: number;
    netPlatformProfit: number;
    grossProfitMargin: string;
  };
}

export interface ReferralParty {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface QuarantinedReferralItem {
  id: number;
  uuid: string;
  referrerId: number;
  refereeId: number;
  codeUsed: string;
  status: ReferralStatus;
  fraudReason: string | null;
  deviceFingerprint: string | null;
  ipAddress: string | null;
  referrerRewardAmount: number;
  referrer: ReferralParty;
  referee: ReferralParty;
  qualifyingTask: {
    id: number;
    uuid: string;
    title: string;
    budget: number;
    status: string;
  } | null;
  campaign: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuarantineFilters {
  campaignUuid?: string;
  referrerUuid?: string;
  refereeUuid?: string;
}

export interface ResolveQuarantinePayload {
  action: 'APPROVE' | 'REJECT';
  notes?: string;
}
