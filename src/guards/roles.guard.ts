import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@modules/user/constants/role.enum';
import { ROLES_KEY } from '@decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { sessionUser } = context.switchToHttp().getRequest();

    if (!requiredRoles.includes(sessionUser.role)) {
      return false;
    }

    return true;
  }
}
