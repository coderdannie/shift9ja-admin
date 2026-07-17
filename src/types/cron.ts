export interface CronJob {
  name: string;
  isActive: boolean;
  lastDate: string | null;
  nextDate: string | null;
}
