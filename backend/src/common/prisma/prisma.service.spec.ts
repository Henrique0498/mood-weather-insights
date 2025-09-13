import { PrismaService } from './prisma.service';

// Mock PrismaClient to avoid any real DB interaction
jest.mock('@prisma/client', () => {
  class MockPrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient: MockPrismaClient };
});

describe('PrismaService', () => {
  it('calls $connect on onModuleInit', async () => {
    const service = new PrismaService();
    const connectSpy = jest.spyOn(service as any, '$connect');

    await service.onModuleInit();

    expect(connectSpy).toHaveBeenCalledTimes(1);
  });

  it('calls $disconnect on onModuleDestroy', async () => {
    const service = new PrismaService();
    const disconnectSpy = jest.spyOn(service as any, '$disconnect');

    await service.onModuleDestroy();

    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });
});
