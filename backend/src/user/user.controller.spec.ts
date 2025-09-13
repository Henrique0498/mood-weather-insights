import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { randomUUID } from 'crypto';

describe('UserController', () => {
  let controller: UserController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: service }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /users -> create', async () => {
    const dto = { email: 'a@a.com', name: 'Alice', password: 'secret' } as any;
    const created = { id: randomUUID(), email: dto.email, name: dto.name } as any;
    service.create.mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('GET /users -> findAll', async () => {
    const list = [{ id: randomUUID(), email: 'x@x.com', name: 'X' }] as any;
    service.findAll.mockResolvedValue(list);

    await expect(controller.findAll()).resolves.toEqual({ data: list });
    expect(service.findAll).toHaveBeenCalled();
  });

  it('GET /users/:id -> findOne', async () => {
    const id = randomUUID() as any;
    const entity = { id, email: 'b@b.com', name: 'B' } as any;
    service.findOne.mockResolvedValue(entity);

    await expect(controller.findOne(id)).resolves.toEqual(entity);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('PATCH /users/:id -> update', async () => {
    const id = randomUUID() as any;
    const dto = { name: 'Bob' } as any;
    const updated = { id, email: 'b@b.com', name: 'Bob' } as any;
    service.update.mockResolvedValue(updated);

    await expect(controller.update(id, dto)).resolves.toEqual(updated);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('DELETE /users/:id -> remove', async () => {
    const id = randomUUID() as any;
    service.remove.mockResolvedValue(undefined);

    await expect(controller.remove(id)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
