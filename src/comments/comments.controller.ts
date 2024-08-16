import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/user/auth/guards';
import { Token } from 'utils/decorators/token.decorator';
import { CreateCommentDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService) { }

    @Post("/create")
    async createComment(@Token() token: string, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.createComment(token, createCommentDto);
    }

    @Put("/update")
    async updateComment(@Token() token: string, @Param('id') id: string, comment: string) {
        return this.commentService.updateComment(token, id, comment);
    }

    @Delete("/delete")
    async deleteComment(@Token() token: string, @Param('id') id: string) {
        return this.commentService.deleteComment(token, id);
    }

    @Get("/get")
    async getComment(@Param("newsId") newsId: string, @Query("skip") skip: number, @Query("limit") limit: number) {
        return this.commentService.getComments(newsId, skip, limit);
    }
}
