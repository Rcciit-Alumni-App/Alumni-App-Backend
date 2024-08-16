import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { JwtAuthGuard } from 'src/user/auth/guards';
import { Token } from 'utils/decorators/token.decorator';

@UseGuards(JwtAuthGuard)
@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    @Post("/create-post")
    async createPost(@Token() token: string, @Body() createNewsDto: CreateNewsDto) {
        return this.newsService.createNews(token, createNewsDto);
    }

    @Put("/update-post")
    async updatePost(@Token() token: string, @Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
        return this.newsService.updateNews(token, id, updateNewsDto);
    }

    @Delete("/delete-post")
    async deletePost(@Token() token: string, @Param("id") id: string) {
        return this.newsService.deleteNews(token, id);
    }

    @Get("/get-all")
    async getAllNews(@Token() token: string, @Query('skip') skip: number, @Query('limit') limit: number) {
        return this.newsService.getAllNews(skip, limit);
    }

    @Get("/get")
    async getNews(@Token() token: string, @Param("id") id: string) {
        return this.newsService.getNews(id);
    }
}
