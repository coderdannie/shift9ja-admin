import axiosInstance from '../axiosInstance';
import * as API from '../url';
import type { ApiResponse, CursorParams } from '../../types/api';
import type { 
  ChatListResponse, 
  ChatMessagesResponse, 
  InitiateChatResponse,
  ChatListParams
} from '../../types/chat';

export const getAdminChats = async (params: ChatListParams = {}): Promise<ChatListResponse> => {
  const res = await axiosInstance.get(API.GET_ADMIN_CHATS, { params });
  return res.data;
};

export const initiateDisputeChat = async (disputeUuid: string): Promise<InitiateChatResponse> => {
  const res = await axiosInstance.post(API.INITIATE_DISPUTE_CHAT, { disputeUuid });
  return res.data;
};

export const getChatMessages = async (
  uuid: string, 
  params: CursorParams
): Promise<ChatMessagesResponse> => {
  const res = await axiosInstance.get(API.GET_CHAT_MESSAGES(uuid), { params });
  return res.data;
};

export const getCloudinarySignature = async (folder: string = 'chats'): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.get(`${API.GET_CLOUDINARY_SIGNATURE}?folder=${folder}`);
  return res.data;
};

export const markChatAsRead = async (uuid: string): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post(API.MARK_CHAT_AS_READ(uuid));
  return res.data;
};
