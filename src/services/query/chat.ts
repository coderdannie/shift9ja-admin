import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getAdminChats, 
  getChatMessages, 
  getCloudinarySignature, 
  initiateDisputeChat,
  markChatAsRead,
  claimChat
} from '../api/chat';
import { QUERY_KEYS } from '../queryKeys';

import type { InfiniteData } from '@tanstack/react-query';
import type { ChatListParams, ChatMessagesResponse, ChatListResponse } from '../../types/chat';

export const useGetAdminChats = (params: ChatListParams = {}, options?: any) => {
  return useQuery<ChatListResponse, Error>({
    queryKey: [QUERY_KEYS.GET_ADMIN_CHATS, params],
    queryFn: () => getAdminChats(params),
    ...options,
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

export const useMarkChatAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => markChatAsRead(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_CHATS] });
    },
  });
};

export const useClaimChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => claimChat(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ADMIN_CHATS] });
    },
  });
};
