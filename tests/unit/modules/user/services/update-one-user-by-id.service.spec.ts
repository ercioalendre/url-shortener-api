import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { UpdateOneUserByIdService } from '@modules/user/services/update-one-user-by-id.service';
import { randomUUID } from 'crypto';
import {
  generateFakeUser,
  generateFakeUserWithoutPassword,
} from '@tests/mocks/generateFakeUser';
import { AppCrypto } from '@utilities/app-crypto';

describe('UpdateOneUserByIdService test suite', () => {
  let service: UpdateOneUserByIdService;

  beforeAll(async () => {
    service = global.testingModule.get(
      UpdateOneUserByIdService,
    ) as UpdateOneUserByIdService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should update one user by id', async () => {
    const userToUpdate = generateFakeUserWithoutPassword();

    const updateOneUserByIdInputDto = {
      phone: '(555) 555-5555',
    };

    const updateOneUserByIdOutputDto = {
      id: randomUUID(),
      ...userToUpdate,
      updatedAt: new Date(),
      updatedBy: randomUUID(),
    };

    const userPrismaRepository = global.testingModule.get(
      UserPrismaRepository,
    ) as UserPrismaRepository;

    const appCrypto = global.testingModule.get(AppCrypto) as AppCrypto;

    jest
      .spyOn(userPrismaRepository, 'getOneUnique')
      .mockResolvedValue(userToUpdate);

    jest
      .spyOn(appCrypto, 'decryptData')
      .mockReturnValue(updateOneUserByIdOutputDto);

    jest
      .spyOn(userPrismaRepository, 'updateOneById')
      .mockResolvedValue(updateOneUserByIdOutputDto);

    const sessionUser = generateFakeUser();

    const result = await service.execute(
      userToUpdate.id,
      updateOneUserByIdInputDto,
      sessionUser,
    );

    expect(userPrismaRepository.updateOneById).toHaveBeenCalled();

    expect(result).toEqual(updateOneUserByIdOutputDto);
  });
});
