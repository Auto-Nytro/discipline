import { DateTime, Duration, Instant } from "@internal/prelude";

export type AndroidMonitoringServiceState = {
  previousAppUsageStatsQueryInstant: Instant,
  previousAppUsageStatsQueryDateTime: DateTime,
  previousAppUsageStatsQueryTime: Date,
  appUsageStatsQueryInterval: Duration,
};

export const AndroidMonitoringServiceState = {

};