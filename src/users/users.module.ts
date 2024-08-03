import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //자동으로 리포지토리 생성
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
