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

export type CreateInsightParams = {
  userId: string;
  lat: number;
  lon: number;
  topic: string;
};

export function getInsights(params: GetInsightsParams) {
  return apiFetch
    .get<InsightResponse[]>("/insights", { params })
    .then((r) => r.data);
}

export function createInsights(data: CreateInsightParams) {
  return apiFetch.post<InsightResponse>("/insights", data).then((r) => r.data);
}
