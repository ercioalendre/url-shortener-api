import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';
import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { HardDeleteOneUserByIdService } from '@modules/user/services/hard-delete-one-user-by-id.service';
import { generateFakeUser } from '@tests/mocks/generateFakeUser';
import { AppCrypto } from '@utilities/app-crypto';
import { randomUUID } from 'crypto';

describe('HardDeleteOneUserByIdService test suite', () => {
  let service: HardDeleteOneUserByIdService;

  beforeAll(async () => {
    service = global.testingModule.get(
      HardDeleteOneUserByIdService,
    ) as HardDeleteOneUserByIdService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should hard delete one user by id', async () => {
    const urlPrismaRepository = global.testingModule.get(
      UrlPrismaRepository,
    ) as UrlPrismaRepository;

    const userPrismaRepository = global.testingModule.get(
      UserPrismaRepository,
    ) as UserPrismaRepository;

    const appCrypto = global.testingModule.get(AppCrypto) as AppCrypto;

    const userToDelete = generateFakeUser({
      softDeletedAt: new Date(),
      softDeletedBy: randomUUID(),
    });

    jest
      .spyOn(userPrismaRepository, 'getOneUnique')
      .mockResolvedValue(userToDelete);

    jest.spyOn(urlPrismaRepository, 'getOne').mockResolvedValueOnce(null);

    jest.spyOn(userPrismaRepository, 'getOne').mockResolvedValueOnce(null);

    jest
      .spyOn(userPrismaRepository, 'hardDeleteOneById')
      .mockResolvedValue(userToDelete);

    jest.spyOn(appCrypto, 'decryptData').mockReturnValue(userToDelete);

    const result = await service.execute(userToDelete.id);

    expect(userPrismaRepository.hardDeleteOneById).toHaveBeenCalled();

    expect(result).toEqual(userToDelete);
  });
});
