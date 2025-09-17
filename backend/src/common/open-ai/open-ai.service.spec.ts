import { Test, TestingModule } from "@nestjs/testing";
import { OpenAiService } from "./open-ai.service";
import { BadGatewayException } from "@nestjs/common";

jest.mock("openai", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({ id: "mock", choices: [] }),
        },
      },
    })),
  };
});

describe("OpenAiService", () => {
  let service: OpenAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAiService],
    }).compile();

    service = module.get<OpenAiService>(OpenAiService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("fourOMini returns response on success", async () => {
    const client = (service as any).openai;
    client.chat.completions.create.mockResolvedValueOnce({ id: "ok" });
    await expect(
      service.fourOMini({
        messages: [{ role: "user", content: "hi" }],
        maxTokens: 10,
      })
    ).resolves.toEqual({ id: "ok" });
  });

  it("fourOMini throws BadGateway on error", async () => {
    const client = (service as any).openai;
    client.chat.completions.create.mockRejectedValueOnce({
      response: { data: { message: "X" } },
    });
    await expect(
      service.fourOMini({
        messages: [{ role: "user", content: "hi" }],
        maxTokens: 10,
      })
    ).rejects.toBeInstanceOf(BadGatewayException);
  });
});
