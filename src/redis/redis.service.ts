import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
    constructor(
        private readonly config: ConfigService
    ) { }

    setupRedis() {
        const client = new Redis(this.config.get("UPSTASH_REDIS_URL"));

        return client;
    }

    setCache(key: string, value: any): void {
        const redis = this.setupRedis();
        redis.set(key, JSON.stringify(value));
        return;
    }

    async getValue(key: string): Promise<any> {
        const redis = this.setupRedis();
        const data = await redis.get(key);
        return JSON.parse(data);
    }

    deleteCache(key: string) {
        const redis = this.setupRedis();
        redis.del(key);
        return;
    }
}
