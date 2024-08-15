import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JobService } from './jobs.service';
import { Token } from 'utils/decorators/token.decorator';
import { JwtAuthGuard } from 'src/user/auth/guards/jwt.guard';
import { JobTypes } from '@prisma/client';

@Controller('/opportunities')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllJobs(
    @Token() token: string,
    @Query('jobType') jobType?: JobTypes,
    @Query('category') category?: string,
  ) {
    return this.jobService.getAllJobs(token, jobType, category);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createJob(@Token() token: string, @Body() data: any) {
    return this.jobService.createJob(token, data);
  }

    @UseGuards(JwtAuthGuard)
    @Put('/update')
    async updateJob(@Token() token: string, @Body() data: any) {
      return this.jobService.updateJob(token, data);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getJobById(@Token() token: string,@Query('id') id: string) {
      return this.jobService.getJobById(token,id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deleteJob(@Token() token: string, @Query('id') id: string) {
      return this.jobService.deleteJob(token,id);
    }
}
