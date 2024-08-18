import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JobService } from './jobs.service';
import { Token } from 'utils/decorators/token.decorator';
import { JwtAuthGuard } from 'src/user/auth/guards/jwt.guard';
import { JobTypes } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/opportunities')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @ApiOperation({ summary: 'Retrieve all job opportunities' })
  @ApiQuery({ name: 'jobType', required: false, enum: JobTypes, description: 'Filter by job type' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by job category' })
  @ApiResponse({ status: 200, description: 'List of job opportunities retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async getAllJobs(
    @Token() token: string,
    @Query('jobType') jobType?: JobTypes,
    @Query('category') category?: string,
  ) {
    return this.jobService.getAllJobs(token, jobType, category);
  }

  @ApiOperation({ summary: 'Create a new job opportunity' })
  @ApiBody({
    description: 'Data for creating a new job opportunity',
    type: Object, // Replace with a specific DTO class if available
  })
  @ApiResponse({ status: 201, description: 'Job opportunity created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/create')
  async createJob(@Token() token: string, @Body() data: any) {
    return this.jobService.createJob(token, data);
  }

  @ApiOperation({ summary: 'Update an existing job opportunity' })
  @ApiBody({
    description: 'Data for updating a job opportunity',
    type: Object, // Replace with a specific DTO class if available
  })
  @ApiResponse({ status: 200, description: 'Job opportunity updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Put('/update')
  async updateJob(@Token() token: string, @Body() data: any) {
    return this.jobService.updateJob(token, data);
  }

  @ApiOperation({ summary: 'Retrieve a job opportunity by ID' })
  @ApiQuery({ name: 'id', description: 'The ID of the job opportunity to retrieve' })
  @ApiResponse({ status: 200, description: 'Job opportunity retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Job opportunity not found' })
  @Get('/:id')
  async getJobById(@Token() token: string, @Query('id') id: string) {
    return this.jobService.getJobById(token, id);
  }

  @ApiOperation({ summary: 'Delete a job opportunity by ID' })
  @ApiQuery({ name: 'id', description: 'The ID of the job opportunity to delete' })
  @ApiResponse({ status: 200, description: 'Job opportunity deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Job opportunity not found' })
  @Delete('/:id')
  async deleteJob(@Token() token: string, @Query('id') id: string) {
    return this.jobService.deleteJob(token, id);
  }
}
