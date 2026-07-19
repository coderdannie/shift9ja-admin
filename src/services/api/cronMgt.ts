import * as API from "../url";
import axiosInstance from "../axiosInstance";
import type { ApiResponse } from "../../types/api";
import type { CronJob } from "../../types/cron";

export const getCronJobs = async (): Promise<ApiResponse<CronJob[]>> => {
  const res = await axiosInstance.get(API.GET_CRON_JOBS);
  return res.data;
};

export const startCronJob = async (
  name: string,
): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.post(API.START_CRON_JOB(name));
  return res.data;
};

export const stopCronJob = async (name: string): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.post(API.STOP_CRON_JOB(name));
  return res.data;
};

export const triggerCronJob = async (
  name: string,
): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.post(API.TRIGGER_CRON_JOB(name));
  return res.data;
};
