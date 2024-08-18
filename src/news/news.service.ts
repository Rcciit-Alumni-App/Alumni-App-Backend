import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { decodeToken } from 'utils/auth/decodeToken';

@Injectable()
export class NewsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        private readonly redis: RedisService
    ) { }

    async createNews(token: string, createNewsDto: CreateNewsDto) {
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const post = await this.prisma.news.create({
            data: {
                ...createNewsDto,
                author_id: userId,
                activities: {
                    total_likes: 0,
                    total_comments: 0
                }
            }
        });
        return post;
    }

    async updateNews(token: string, postId: string, updateNewsDto: UpdateNewsDto) {
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const existsPost = await this.prisma.news.findFirst({
            where: {
                id: postId,
                author_id: userId,
            },
        });

        if (!existsPost) {
            throw new Error("Post not found!!");
        }

        const updatedPost = await this.prisma.news.update({
            where: {
                id: existsPost.id
            },
            data: {
                ...updateNewsDto
            }
        });

        return updatedPost;
    }

    async deleteNews(token: string, postId: string) {
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const existsPost = await this.prisma.news.findFirst({
            where: {
                id: postId,
                author_id: userId,
            },
        });

        if (!existsPost) {
            throw new Error("Post not found!!");
        }
        await this.prisma.news.delete({
            where: {
                id: postId,
                author_id: userId,
            }
        });
    }

    async getAllNews(skip: number, limit: number) {
        const news = await this.prisma.news.findMany({
            skip: skip,
            take: limit,
        });

        return news;
    }

    async getNews(id: string) {
        let news: any;
        news = await this.redis.getValue(`news:${id}`);
        if (news)
            return news;
        news = await this.prisma.news.findFirst({
            where: {
                id: id,
            },
            select: {
                id: true,
                author: {
                    select: {
                        id: true,
                        full_name: true,
                        profile_pic_url: true
                    }
                },
                title: true,
                description: true,
                banner: true,
                tags: true,
                created_at: true,
                updated_at: true,
                activities: true,
                comment: {
                    take: 10,
                    select: {
                        id: true,
                        comment: true,
                        isEdited: true,
                        created_at: true,
                        updated_at: true,
                        user: {
                            select: {
                                id: true,
                                full_name: true, // Include any other user fields you want
                            },
                        }
                    }
                }
            }
        });

        console.log(news);

        this.redis.setCache(`news:${news.id}`, news);

        return news;
    }
}
