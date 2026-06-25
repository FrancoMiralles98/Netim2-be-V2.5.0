import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, userSchema } from './schema/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: UserModel.name, schema: userSchema}
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
