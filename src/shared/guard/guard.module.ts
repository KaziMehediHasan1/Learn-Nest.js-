import { JwtAccessStrategy } from '@/shared/guard/jwt-access.strategy';
import { JwtRefreshStrategy } from '@/shared/guard/jwt-refresh.strategy';
import { RolesGuard } from '@/shared/guard/roles.gurad';
import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt-access' })],
  providers: [JwtAccessStrategy, JwtRefreshStrategy, RolesGuard],
  exports: [PassportModule],
})
export class GuardModule {}
