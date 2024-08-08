import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { InsertDocumentDto } from './dto';
import { ApiJwtAuthGuard } from '../../src/user/auth/guards';

@Controller('api')
export class ApiController {
    constructor(private readonly apiService: ApiService) { }

    @UseGuards(ApiJwtAuthGuard)
    @Post("/insert")
    async insertDoc(@Body() insertDoc: InsertDocumentDto) {
        return this.apiService.insertDocument(insertDoc);
    }
}
