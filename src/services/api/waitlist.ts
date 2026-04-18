import * as API from '../url';
import axiosInstance from '../axiosInstance';

export const getWaitlistEntries = async (params = {}) => {
  const res = await axiosInstance.get(API.GET_WAITLIST, { params });
  return res.data;
};
