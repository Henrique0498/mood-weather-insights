import { BadGatewayException, Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import axios from "axios";
import OpenAI from "openai";
import { CreateInsightsDto } from "./dto/create-insights.dto";
import { PrismaService } from "@/common/prisma/prisma.service";
import { UserService } from "@/user/user.service";
import { FindWeatherDto } from "./dto/find-weather.dto";
import { FindInsightsDto } from "./dto/find-insights.dto";
import { UUID } from "crypto";
import { OpenAiService } from "@/common/open-ai/open-ai.service";
import { OpenWeatherService } from "@/common/open-weather/open-weather.service";
import { OpenWeatherMapResponse } from "@/common/open-weather/types";
import { DeleteTopicDto } from "./dto/delete-topic.dto";

@Injectable()
export class InsightsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly openAiService: OpenAiService,
    private readonly openWeatherService: OpenWeatherService
  ) {}

  async findTopics({ userId, limit = 2 }: { userId: UUID; limit?: number }) {
    await this.userService.verifyExists(userId);

    const grouped = await this.prisma.insight.groupBy({
      by: ["topic"],
      where: { userId },
      _max: { createdAt: true },
      orderBy: { _max: { createdAt: "desc" } },
      take: limit,
    });

    const latestPerTopic = await Promise.all(
      grouped.map(({ topic }) =>
        this.prisma.insight.findFirst({
          where: { userId, topic },
          orderBy: { createdAt: "desc" },
          select: { id: true, topic: true, createdAt: true },
        })
      )
    );

    return latestPerTopic.filter(Boolean);
  }

  async findAll(query: FindInsightsDto) {
    const { userId, topic } = query;

    await this.userService.verifyExists(userId);

    return this.prisma.insight.findMany({
      where: { userId, topic },
      orderBy: { createdAt: "desc" },
      select: { id: true, topic: true, content: true, createdAt: true },
    });
  }

  private async findWeather({ lat, lon }: FindWeatherDto) {
    const latKey = Number(lat).toFixed(2);
    const lonKey = Number(lon).toFixed(2);
    const key = `weather:${latKey}:${lonKey}`;
    const cached = await this.cache.get<OpenWeatherMapResponse>(key);

    if (cached) {
      return cached;
    }

    const data = await this.openWeatherService.findByLocation(lat, lon);

    await this.cache.set(key, data, 60 * 60 * 1000);

    return data;
  }

  async create(dto: CreateInsightsDto) {
    const { lat, lon, topic, userId } = dto;

    await this.userService.verifyExists(userId);
    const weather = await this.findWeather({ lat, lon });

    const weatherDescription = weather.weather[0].description;
    const weatherTemp = weather.main.temp;
    const key = `topic:${topic}:weather:${weatherDescription}:user:${userId}`;

    const cached = await this.cache.get<OpenWeatherMapResponse>(key);

    if (cached) {
      return cached;
    }

    const prompt = this.createPromptWeather(
      topic,
      weatherDescription,
      weatherTemp
    );

    const response = await this.openAiService.fourOMini({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 300,
    });

    const content = response.choices[0].message.content as string;

    const insight = await this.prisma.insight.create({
      data: {
        userId,
        topic,
        content,
        weather,
      },
    });

    await this.cache.set(key, insight, 60 * 60 * 1000);

    return {
      id: insight.id,
      topic: insight.topic,
      content: insight.content,
      createdAt: insight.createdAt,
    };
  }

  findOne(id: UUID) {
    return this.verifyExists(id);
  }

  async remove(id: UUID) {
    await this.verifyExists(id);

    await this.prisma.insight.delete({ where: { id } });

    return;
  }

  async removeTopic({ topic, userId }: DeleteTopicDto) {
    await this.userService.verifyExists(userId);

    await this.prisma.insight.deleteMany({ where: { userId, topic } });
  }

  async verifyExists(id: UUID) {
    const insight = await this.prisma.insight.findUnique({ where: { id } });

    if (!insight) {
      throw new BadGatewayException("Insight not found");
    }

    return insight;
  }

  private createPromptWeather(
    topic: string,
    weatherDescription: string,
    weatherTemp: number
  ) {
    return `
      O tema escolhido foi: "${topic}".
      O clima no local é: ${weatherDescription}, temperatura ${weatherTemp}°C.

      Gere um insight em português claro, no estilo de reflexão curta (3-6 frases),
      relacionando humor, clima e tema.
    `;
  }
}
