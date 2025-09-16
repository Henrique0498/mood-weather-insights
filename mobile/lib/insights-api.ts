import { apiFetch } from "@/lib/api-client";

export type InsightResponse = {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
};

export type GetInsightsParams = {
  userId: string;
  topic?: string;
};

export function getInsights(params: GetInsightsParams) {
  return apiFetch
    .get<InsightResponse[]>("/insights", { params })
    .then((r) => r.data);
}
