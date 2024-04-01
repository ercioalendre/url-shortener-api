import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { GetOneUserByIdService } from '@modules/user/services/get-one-user-by-id.service';
import { generateFakeUser } from '@tests/mocks/generateFakeUser';
import { AppCrypto } from '@utilities/app-crypto';

describe('GetOneUserByIdService test suite', () => {
  let service: GetOneUserByIdService;

  beforeAll(async () => {
    service = global.testingModule.get(
      GetOneUserByIdService,
    ) as GetOneUserByIdService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should get one user by id', async () => {
    const userPrismaRepository = global.testingModule.get(
      UserPrismaRepository,
    ) as UserPrismaRepository;

    const userToGet = generateFakeUser();

    const appCrypto = global.testingModule.get(AppCrypto) as AppCrypto;

    jest
      .spyOn(userPrismaRepository, 'getOneUnique')
      .mockResolvedValue(userToGet);

    jest.spyOn(appCrypto, 'decryptData').mockReturnValue(userToGet);

    const result = await service.execute(userToGet.id);

    expect(userPrismaRepository.getOneUnique).toHaveBeenCalled();

    expect(result).toEqual(userToGet);
  });
});
