import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { GetManyUserService } from '@modules/user/services/get-many-user.service';
import { generateFakeUser } from '@tests/mocks/generateFakeUser';
import { AppCrypto } from '@utilities/app-crypto';

describe('GetManyUserService test suite', () => {
  let service: GetManyUserService;

  beforeAll(async () => {
    service = global.testingModule.get(
      GetManyUserService,
    ) as GetManyUserService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should get many user', async () => {
    const userPrismaRepository = global.testingModule.get(
      UserPrismaRepository,
    ) as UserPrismaRepository;

    const firstUserToGet = generateFakeUser();

    const secondUserToGet = generateFakeUser();

    const userToGetList = [firstUserToGet, secondUserToGet];

    const getManyResponse = {
      data: userToGetList,
      currentPage: 1,
      perPage: 1,
      lastPage: Math.ceil(2 / 1) || 1,
      totalRecords: 2,
    };

    const appCrypto = global.testingModule.get(AppCrypto) as AppCrypto;

    jest
      .spyOn(userPrismaRepository, 'getMany')
      .mockResolvedValue(getManyResponse);

    jest.spyOn(appCrypto, 'decryptData').mockReturnValueOnce(firstUserToGet);

    jest.spyOn(appCrypto, 'decryptData').mockReturnValueOnce(secondUserToGet);

    const result = await service.execute();

    expect(userPrismaRepository.getMany).toHaveBeenCalled();

    expect(result).toEqual(getManyResponse);
  });
});
