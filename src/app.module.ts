import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { authConfig } from './config/auth.config';
import { databaseConfig } from './config/database.config';
import { envValidationSchema } from './config/env-validation';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigType } from './config/types/app-config.type';
import { BonusModule } from './modules/bonus/bonus.module';
import { ItemModule } from './modules/item/item.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SkillModule } from './modules/skill/skill.module';
import { CharacterModule } from './modules/character/character.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      validationSchema: envValidationSchema,
      load: [appConfig,authConfig,databaseConfig]
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config:ConfigService<AppConfigType>) => ({
        uri: config.getOrThrow('db',{infer:true}).uri
      })
    }),
    BonusModule,
    ItemModule,
    InventoryModule,
    SkillModule,
    CharacterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
