import { BadGatewayException, Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { FindOpenAi } from "./types";

@Injectable()
export class OpenAiService {
  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async fourOMini(data: FindOpenAi) {
    const { messages, maxTokens } = data;

    const response = await this.openai.chat.completions
      .create({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: maxTokens,
      })
      .catch((error) => {
        throw new BadGatewayException(
          error.response?.data?.message || "Failed to fetch OpenAI data"
        );
      });

    return response;
  }
}
