import type { ApiResponse } from './api';

// ── Session lifecycle ──────────────────────────────────────────────────────────
export type SessionStatus = 'BOT_ACTIVE' | 'ESCALATED' | 'ADMIN_ACTIVE' | 'RESOLVED' | 'CLOSED';
export type MessageSenderType = 'USER' | 'BOT' | 'ADMIN' | 'SYSTEM';

// ── Participant snapshot ───────────────────────────────────────────────────────
export interface SupportParticipant {
  uuid: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  email?: string;
  activeRole?: string;
}

// ── Individual message in a support session ───────────────────────────────────
export interface SupportMessage {
  uuid: string;
  tempId?: string;
  content: string;
  type: 'text' | 'image' | 'system';
  senderType: MessageSenderType;
  sender?: SupportParticipant;
  adminSender?: SupportParticipant;
  createdAt: string;
  status?: 'pending' | 'sent' | 'error';
  /** Metadata from AI tool calls — shown in system messages */
  toolResult?: Record<string, any>;
}

// ── Support session entity ─────────────────────────────────────────────────────
export interface SupportSession {
  uuid: string;
  sessionId: string;          // e.g. SUP-1082
  status: SessionStatus;
  // Flattened user fields from API
  userId: number;
  userUuid: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  
  assignedAdminId?: number | null;
  assignedAdminUuid?: string | null;
  assignedAdminName?: string | null;
  
  category?: string;
  summary?: string | null;
  sentimentScore?: number;
  provider?: string | null;

  user?: SupportParticipant;
  admin?: SupportParticipant; // Set when ADMIN_ACTIVE
  lastMessage?: SupportMessage;
  lastMessageAt?: string;
  unreadCount?: number;
  aiSummary?: string;         // Populated on escalation/close
  createdAt: string;
  updatedAt?: string;
  closedAt?: string | null;
  escalatedAt?: string | null;
}

// ── FAQ entity ─────────────────────────────────────────────────────────────────
export type FAQCategory =
  | 'general'
  | 'tasks'
  | 'escrow'
  | 'payments'
  | 'payouts'
  | 'kyc'
  | 'disputes'
  | 'other';

export interface FAQ {
  uuid: string;
  question: string;
  answer: string;
  category: FAQCategory;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Unanswered / low-confidence query ─────────────────────────────────────────
export interface UnansweredQuery {
  uuid: string;
  question: string;
  askedCount: number;
  lastAskedAt: string;
  sessionUuid?: string;
}

// ── API response shapes ────────────────────────────────────────────────────────
export interface SupportSessionsResponse {
  data: SupportSession[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface SupportMessagesResponse {
  data: SupportMessage[];
  meta: {
    nextCursor?: string | number | null;
    previousCursor?: string | number | null;
  };
}

export interface SupportSessionListParams {
  page?: number;
  limit?: number;
  status?: SessionStatus;
  assignment?: 'unassigned' | 'mine' | 'all';
  search?: string;
}

export interface FAQListParams {
  page?: number;
  limit?: number;
  category?: FAQCategory;
  search?: string;
}

export interface CreateFAQPayload {
  question: string;
  answer: string;
  category: FAQCategory;
  isPublished?: boolean;
}

export interface UpdateFAQPayload extends Partial<CreateFAQPayload> {}

export type SuggestReplyResponse = ApiResponse<{ draft: string }>;
export type SessionDetailResponse = ApiResponse<SupportSession>;
export type FAQResponse = ApiResponse<FAQ>;
export type FAQListResponse = ApiResponse<FAQ[]> & { meta?: any };
export type UnansweredQueueResponse = ApiResponse<UnansweredQuery[]>;
