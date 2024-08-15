import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { decodeToken } from 'utils/auth/decodeToken';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}
  async getAllNews(token: string) {
    const userId = decodeToken(token, this.jwt, this.config);
    const user = await this.redis.getValue(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const news = await this.prisma.news.findMany();
    return news;
  }

  async getNewsById(token: string, id: string) {
    const userId = decodeToken(token, this.jwt, this.config);
    const user = await this.redis.getValue(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const news = await this.prisma.news.findUnique({
      where: {
        id: id,
      },
    });
    return news;
  }

  async createNews(token: string, data: CreateNewsDto) {
    const userId = decodeToken(token, this.jwt, this.config);
    const user = await this.redis.getValue(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const news = await this.prisma.news.create({
      data: {
        ...data,
      },
    });
    return news;
  }

  async updateNews(token: string, data: UpdateNewsDto) {
    const userId = decodeToken(token, this.jwt, this.config);
    const user = await this.redis.getValue(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const news = await this.prisma.news.update({
      where: { id: data.id },
      data: {
        ...data,
      },
    });
    return news;
  }

  async deleteNews(token: string, id: string) {
    const userId = decodeToken(token, this.jwt, this.config);
    const user = await this.redis.getValue(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await this.prisma.news.delete({
      where: { id },
    });
    return 'News deleted successfully';
  }
}
