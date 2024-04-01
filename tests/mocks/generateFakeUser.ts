import { Role } from '@modules/user/constants/role.enum';
import { UserModelBaseOutputDto } from '@modules/user/dtos/output/user-model-base-output.dto';
import { generatePassword } from '@utilities/generate-password';
import { randomUUID } from 'node:crypto';

interface UserModelBaseOutputDtoWithPassword extends UserModelBaseOutputDto {
  password: string;
}

export function generateFakeUser(
  user?: Partial<UserModelBaseOutputDtoWithPassword> | null,
): UserModelBaseOutputDtoWithPassword {
  return {
    id: randomUUID(),
    fullName: 'John Doe',
    email: 'john.doe@system.com',
    phone: '(555) 555-5555',
    role: Role.User,
    password: generatePassword(),
    createdAt: new Date(),
    createdBy: randomUUID(),
    ...user,
  };
}

export function generateFakeUserWithoutPassword(): UserModelBaseOutputDto {
  return {
    id: randomUUID(),
    fullName: 'John Doe',
    email: 'john.doe@system.com',
    phone: '(555) 555-5555',
    role: Role.User,
    createdAt: new Date(),
    createdBy: randomUUID(),
  };
}
