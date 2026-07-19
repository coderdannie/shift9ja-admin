import type { ApiResponse, PaginatedData } from './api';

export interface ChatParticipant {
  uuid: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  activeRole?: string;
}

export interface Chat {
  uuid: string;
  type: 'task' | 'dispute' | 'support';
  lastMessageAt: string;
  unreadCount: number;
  client?: ChatParticipant;
  helper?: ChatParticipant;
  admin?: ChatParticipant;
  task?: { title: string; budget: number; uuid: string };
  dispute?: { reason: string; uuid: string };
  lastMessage?: ChatMessage;
}

export interface ChatListParams {
  page?: number;
  limit?: number;
  type?: 'task' | 'dispute' | 'support';
  assignment?: 'unassigned' | 'my_chats' | 'all';
}

export interface ChatMessage {
  uuid: string;
  tempId?: string;
  content: string;
  type: 'text' | 'image' | 'offer';
  createdAt: string;
  senderType: 'USER' | 'ADMIN' | 'SYSTEM';
  sender?: ChatParticipant & { lastSeen?: string };
  senderAdmin?: ChatParticipant; // Keeping for compatibility if needed
  adminSender?: ChatParticipant; // New field from API
  status?: 'pending' | 'sent' | 'error';
}

export interface PaginationMeta {
  limit: number;
  nextCursor?: number | string | null;
  previousCursor?: number | string | null;
  page?: number;
  totalItems?: number;
  totalPages?: number;
  itemCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface ChatListResponse extends ApiResponse<Chat[]> {
  meta?: PaginationMeta;
}

export interface ChatMessagesResponse extends ApiResponse<ChatMessage[]> {
  meta: PaginationMeta;
}

export type InitiateChatResponse = ApiResponse<Chat>;
