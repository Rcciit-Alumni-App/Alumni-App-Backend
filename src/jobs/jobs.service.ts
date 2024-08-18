import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JobTypes } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { RedisService } from "src/redis/redis.service";
import { decodeToken } from "utils/auth/decodeToken";
import { CreateJobDto, UpdateJobDto } from "./dto/jobs.dto";

@Injectable()
export class JobService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) { }
  async getAllJobs(token: string, jobType?: JobTypes, category?: string) {
    const jobs = await this.prisma.jobs.findMany({
      where: {
        job_type: jobType,
        category_id: category,
      },
    });
    return jobs;
  }

  async createJob(token: string, data: CreateJobDto) {
    const userId = decodeToken(token, this.jwt, this.config);
    const user = await this.redis.getValue(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const job = await this.prisma.jobs.create({
      data: {
        ...data,
        created_by: userId,
      },
    });
    return job;
  }

  async updateJob(token: string, data: UpdateJobDto) {
    const userId = decodeToken(token, this.jwt, this.config);
    const user = await this.redis.getValue(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const job = await this.prisma.jobs.update({
      where: { id: data.id },
      data: {
        ...data,
      },
    });
    return job;
  }

  async getJobById(token: string,id: string) {
    const userId = decodeToken(token, this.jwt, this.config);
    const user = await this.redis.getValue(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const job = await this.prisma.jobs.findUnique({
      where: { id },
    });
    return job;
  }

  async deleteJob(token: string, id: string) {
    const userId = decodeToken(token, this.jwt, this.config);
    const user = await this.redis.getValue(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const job = await this.prisma.jobs.delete({
      where: { id },
    });
    return job;
  }
}
