import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR) // Runs every hour, adjust as needed
  async handleCron() {
    const now = new Date();

    // Delete documents where expiresAt is in the past
    const deleted = await this.prisma.eventInterests.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    console.log(`Deleted ${deleted.count} expired documents`);
  }
}
