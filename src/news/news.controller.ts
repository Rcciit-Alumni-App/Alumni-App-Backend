import { Body, Controller, Get, Query, UseGuards } from "@nestjs/common";
import { NewsService } from "./news.service";
import { JwtAuthGuard } from "src/user/auth/guards/jwt.guard";
import { Token } from "utils/decorators/token.decorator";


@Controller('/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllNews(
    @Token() token: string,
  ) {
    return this.newsService.getAllNews(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getNewsById(
    @Token() token: string,
    @Query('id') id: string,
  ) {
    return this.newsService.getNewsById(token,id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/create')
  async createNews(
    @Token() token: string,
    @Body() data: any,
  ) {
    return this.newsService.createNews(token,data);
  }
}
