import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/user/auth/guards';
import { Token } from 'utils/decorators/token.decorator';
import { CreateCommentDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService) { }

    @ApiOperation({ summary: 'Create a new comment' })
    @ApiResponse({ status: 201, description: 'Comment created successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Post("/create")
    async createComment(@Token() token: string, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.createComment(token, createCommentDto);
    }

    @ApiOperation({ summary: 'Update an existing comment' })
    @ApiResponse({ status: 200, description: 'Comment updated successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Comment not found.' })
    @Put("/update/:id")
    async updateComment(@Token() token: string, @Param('id') id: string, comment: string) {
        return this.commentService.updateComment(token, id, comment);
    }

    @ApiOperation({ summary: 'Delete a comment' })
    @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Comment not found.' })
    @Delete("/delete/:id")
    async deleteComment(@Token() token: string, @Param('id') id: string) {
        return this.commentService.deleteComment(token, id);
    }

    @ApiOperation({ summary: 'Get comments for a specific news article' })
    @ApiResponse({ status: 200, description: 'Comments retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'News article not found.' })
    @Get("/get/:newsId")
    async getComment(@Param("newsId") newsId: string, @Query("page") page: string, @Query("limit") limit: string) {
        return this.commentService.getComments(newsId, page, limit);
    }
}
