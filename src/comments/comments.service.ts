import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateCommentDto } from './dto';
import { decodeToken } from 'utils/auth/decodeToken';

@Injectable()
export class CommentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        private readonly redis: RedisService
    ) { }

    async createComment(token: string, createCommentDto: CreateCommentDto) {
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const comment = await this.prisma.comment.create({
            data: {
                userId: userId,
                ...createCommentDto,
                isEdited: false,
            }
        });

        return comment;
    }

    async updateComment(token: string, commentId: string, comment: string) {
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const existsComment = await this.prisma.comment.findFirst({
            where: {
                id: commentId,
                userId: userId
            }
        });

        if (existsComment)
            throw new Error("Comment doesn't exists");

        const updatedComment = await this.prisma.comment.update({
            where: {
                id: existsComment.id,
            },
            data: {
                comment: comment,
                isEdited: true
            }
        });

        return updatedComment;
    }

    async deleteComment(token: string, commentId: string) {
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const existsComment = await this.prisma.comment.findFirst({
            where: {
                id: commentId,
                userId: userId
            }
        });

        if (existsComment)
            throw new Error("Comment doesn't exists");

        await this.prisma.comment.delete({
            where: {
                id: existsComment.id,
            },
        });
    }

    async getComments(newsId: string, skip: number, limit: number) {

        let comments = [];
        comments = await this.redis.getValue(`comment:${newsId}:${skip}:${limit}`);
        if (comments)
            return comments;
        comments = await this.prisma.comment.findMany({
            where: {
                newsId: newsId
            },
            skip: skip,
            take: limit
        });

        this.redis.setCache(`comment:${newsId}:${skip}:${limit}`, comments);

        return comments;
    }
}
