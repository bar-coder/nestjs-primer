import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), // It loads .env files via 'dotenv' library,
    AuthModule,
    PrismaModule, // Declared as 'global' in class definition
    UserModule
  ],
})
export class AppModule {}
