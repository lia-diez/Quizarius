import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles/roles.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret, // Use a strong secret key
      signOptions: { expiresIn: '15d' } // Token expiration time
    }),
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard],

  exports: [AuthGuard, RolesGuard]
})
export class AuthModule { }
