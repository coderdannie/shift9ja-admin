import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { 
  getAdminChats, 
  getChatMessages, 
  getCloudinarySignature, 
  initiateDisputeChat 
} from '../api/chat';
import { QUERY_KEYS } from '../queryKeys';

import type { InfiniteData } from '@tanstack/react-query';
import type { ChatListParams, ChatMessagesResponse } from '../../types/chat';

export const useGetAdminChats = (params: ChatListParams = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ADMIN_CHATS, params],
    queryFn: () => getAdminChats(params),
  });
};

export const useInitiateDisputeChat = () => {
  return useMutation({
    mutationFn: initiateDisputeChat,
  });
};

export const useGetChatMessages = (uuid: string, params: { before?: string | number | null; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHAT_MESSAGES, uuid, params],
    queryFn: () => getChatMessages(uuid, params),
    enabled: !!uuid,
  });
};

export const useGetInfiniteChatMessages = (uuid: string, limit: number = 20) => {
  return useInfiniteQuery<ChatMessagesResponse, Error, InfiniteData<ChatMessagesResponse>, (string | undefined)[], string | number | null>({
    queryKey: [QUERY_KEYS.GET_CHAT_MESSAGES, 'infinite', uuid],
    queryFn: ({ pageParam }) => getChatMessages(uuid, { before: pageParam, limit }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    enabled: !!uuid,
  });
};


export const useGetCloudinarySignature = (folder: string = 'chats') => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CLOUDINARY_SIGNATURE, folder],
    queryFn: () => getCloudinarySignature(folder),
    staleTime: 1000 * 60 * 5, // 5 mins signature validity usually
  });
};
