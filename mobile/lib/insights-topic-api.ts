import { apiFetch } from "@/lib/api-client";

export type TopicInsightResponse = {
  id: string;
  topic: string;
  createdAt: string;
};

export type GetInsightsParams = {
  userId: string;
};

export function getTopicsInsights(params: GetInsightsParams) {
  return apiFetch
    .get<TopicInsightResponse[]>("/insights/topics", { params })
    .then((r) => r.data);
}
