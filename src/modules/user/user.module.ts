import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, userSchema } from './schema/user-schema';
import { SharedModule } from '../shared/shared.module';
import { UserRepository } from './repository/user-repository';
import { UserMapper } from './mapper/user-mapper';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      {name: UserModel.name, schema: userSchema}
    ])
  ],
  controllers: [UserController],
  providers: [UserService,UserRepository,UserMapper],
  exports: [
    UserService
  ]
})
export class UserModule {}
