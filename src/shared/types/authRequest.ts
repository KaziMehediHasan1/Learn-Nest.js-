import { Role } from '@prisma/client';

interface RequestUser {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: RequestUser;
}
