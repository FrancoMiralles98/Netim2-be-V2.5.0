import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AppConfigType } from 'src/config/types/app-config.type';

@Injectable()
export class RedisService implements OnModuleDestroy {
    readonly client: Redis

    constructor(private configService: ConfigService<AppConfigType>) {
        this.client = new Redis(this.configService.getOrThrow('redis', { infer: true }).url!)
    }

    onModuleDestroy() {
        this.client.quit()
    }
}
