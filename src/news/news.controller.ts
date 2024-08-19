import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { JwtAuthGuard } from 'src/user/auth/guards';
import { Token } from 'utils/decorators/token.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('News') // Tagging the controller in Swagger UI
@ApiBearerAuth() // Indicating that bearer token is used for authorization
@UseGuards(JwtAuthGuard)
@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    @ApiOperation({ summary: 'Create a new news post' })
    @ApiResponse({ status: 201, description: 'The news post has been successfully created.' })
    @Post("/create-post")
    async createPost(@Token() token: string, @Body() createNewsDto: CreateNewsDto) {
        return this.newsService.createNews(token, createNewsDto);
    }

    @ApiOperation({ summary: 'Update an existing news post' })
    @ApiResponse({ status: 200, description: 'The news post has been successfully updated.' })
    @ApiParam({ name: 'id', description: 'ID of the news post to update' })
    @Put("/update-post/:id")
    async updatePost(@Token() token: string, @Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
        return this.newsService.updateNews(token, id, updateNewsDto);
    }

    @ApiOperation({ summary: 'Delete a news post' })
    @ApiResponse({ status: 200, description: 'The news post has been successfully deleted.' })
    @ApiParam({ name: 'id', description: 'ID of the news post to delete' })
    @Delete("/delete-post/:id")
    async deletePost(@Token() token: string, @Param("id") id: string) {
        return this.newsService.deleteNews(token, id);
    }

    @ApiOperation({ summary: 'Get all news posts' })
    @ApiResponse({ status: 200, description: 'List of news posts' })
    @ApiQuery({ name: 'skip', description: 'Number of posts to skip', required: false, type: Number })
    @ApiQuery({ name: 'limit', description: 'Number of posts to limit', required: false, type: Number })
    @Get("/get-all")
    async getAllNews(@Token() token: string, @Query('page') page: string, @Query('limit') limit: string) {
        return this.newsService.getAllNews(page, limit);
    }

    @ApiOperation({ summary: 'Get a single news post by ID' })
    @ApiResponse({ status: 200, description: 'The news post details' })
    @ApiParam({ name: 'id', description: 'ID of the news post to retrieve' })
    @Get("/get/:id")
    async getNews(@Token() token: string, @Param("id") id: string) {
        return this.newsService.getNews(id);
    }
}
