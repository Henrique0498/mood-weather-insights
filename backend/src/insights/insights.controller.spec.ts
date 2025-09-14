import { Test, TestingModule } from "@nestjs/testing";
import { InsightsController } from "./insights.controller";
import { InsightsService } from "./insights.service";

describe("InsightsController", () => {
  let controller: InsightsController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findTopics: jest.Mock;
    findOne: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findTopics: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsightsController],
      providers: [{ provide: InsightsService, useValue: service }],
    }).compile();

    controller = module.get<InsightsController>(InsightsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("POST /insights -> create", async () => {
    const dto = { userId: "u1", topic: "Tech", lat: -10, lon: -20 } as any;
    const result = {
      id: "i1",
      topic: "Tech",
      content: "...",
      createdAt: new Date(),
    } as any;
    service.create.mockResolvedValue(result);

    await expect(controller.create(dto)).resolves.toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("GET /insights -> findAll", async () => {
    const query = { userId: "u1", topic: "Tech" } as any;
    const list = [{ id: "i1" }, { id: "i2" }] as any;
    service.findAll.mockResolvedValue(list);

    await expect(controller.findAll(query)).resolves.toEqual(list);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it("GET /insights/topics -> uses default limit=2 when not provided", async () => {
    const query = { userId: "u1" } as any;
    const resp = [
      { id: "i1", topic: "Produtividade" },
      { id: "i2", topic: "Tecnologia" },
    ] as any;
    service.findTopics.mockResolvedValue(resp);

    await expect(controller.findTopics(query)).resolves.toEqual(resp);
    expect(service.findTopics).toHaveBeenCalledWith({
      userId: query.userId,
      limit: 2,
    });
  });

  it("GET /insights/topics -> forwards provided limit", async () => {
    const query = { userId: "u1", limit: 5 } as any;
    const resp = [{ id: "i1", topic: "A" }] as any;
    service.findTopics.mockResolvedValue(resp);

    await expect(controller.findTopics(query)).resolves.toEqual(resp);
    expect(service.findTopics).toHaveBeenCalledWith({
      userId: query.userId,
      limit: 5,
    });
  });

  it("GET /insights/:id -> findOne", async () => {
    const id = "i1" as any;
    const entity = { id } as any;
    service.findOne.mockResolvedValue(entity);

    await expect(controller.findOne(id)).resolves.toEqual(entity);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it("DELETE /insights/:id -> remove", async () => {
    const id = "i1" as any;
    service.remove.mockResolvedValue(undefined);

    await expect(controller.remove(id)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
