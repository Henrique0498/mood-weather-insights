import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/common/prisma/prisma.service';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          create: jest.fn(),
          findMany: jest.fn().mockResolvedValue([]),
          findUnique: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /users', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect({ data: [] });
  });
});
