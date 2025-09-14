export type Message = { role: "user"; content: string };
export class FindOpenAi {
  messages: Message[];

  maxTokens?: number;
}
