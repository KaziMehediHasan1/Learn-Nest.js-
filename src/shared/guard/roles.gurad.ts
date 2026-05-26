import { ROLES_KEY } from '@/shared/guard/roles.decorator';
import { AuthenticatedRequest } from '@/shared/types/authRequest';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflectore: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflectore.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException("Can't get any users token!");
    }

    const hasPermission = requiredRoles.includes(user.role);

    if (!hasPermission) {
      throw new ForbiddenException(
        'আপনার এই কাজটি করার পারমিশন নেই! শুধুমাত্র এডমিনরা পারবে।',
      );
    }

    return true;
  }
}
