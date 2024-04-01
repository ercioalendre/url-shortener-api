import { Role } from '@modules/user/constants/role.enum';
import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { CreateOneUserService } from '@modules/user/services/create-one-user.service';
import { generatePassword } from '@utilities/generate-password';
import { randomUUID } from 'crypto';
import { generateFakeUser } from '@tests/mocks/generateFakeUser';
import { AppCrypto } from '@utilities/app-crypto';

describe('CreateOneUserService test suite', () => {
  let service: CreateOneUserService;

  beforeAll(async () => {
    service = global.testingModule.get(
      CreateOneUserService,
    ) as CreateOneUserService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create one user', async () => {
    const createOneUserInputDto = {
      fullName: 'John Doe',
      email: 'john.doe@system.com',
      phone: '(555) 555-5555',
      role: Role.User,
      password: generatePassword(),
    };

    const userModelBaseOutputDto = {
      id: randomUUID(),
      ...createOneUserInputDto,
      createdAt: new Date(),
      createdBy: randomUUID(),
    };

    const userPrismaRepository = global.testingModule.get(
      UserPrismaRepository,
    ) as UserPrismaRepository;

    const appCrypto = global.testingModule.get(AppCrypto) as AppCrypto;

    jest.spyOn(userPrismaRepository, 'getOne').mockResolvedValue(null);

    jest
      .spyOn(appCrypto, 'decryptData')
      .mockReturnValue(userModelBaseOutputDto);

    jest
      .spyOn(userPrismaRepository, 'createOne')
      .mockResolvedValue(userModelBaseOutputDto);

    const sessionUser = generateFakeUser({ role: Role.Admin });

    const result = await service.execute(createOneUserInputDto, sessionUser);

    expect(userPrismaRepository.createOne).toHaveBeenCalled();

    expect(result).toEqual(userModelBaseOutputDto);
  });
});
