import { PartialType } from "@nestjs/swagger";
import { JobTypes } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateJobDto {
  @ApiProperty({
    description: 'The ID of the job category',
    example: 'category-123',
  })
  @IsNotEmpty()
  @IsString()
  category_id: string;

  @ApiProperty({
    description: 'The ID of the user who created the job',
    example: 'user-456',
  })
  @IsNotEmpty()
  @IsString()
  created_by: string;

  @ApiProperty({
    description: 'The title of the job opportunity',
    example: 'Software Engineer',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The name of the company offering the job',
    example: 'Tech Corp',
  })
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the job opportunity',
    example: 'Responsible for developing and maintaining software applications...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The URL where applicants can apply for the job',
    example: 'https://techcorp.com/careers',
  })
  @IsOptional()
  @IsUrl()
  apply_link?: string;

  @ApiPropertyOptional({
    description: 'The location where the job is based',
    example: 'New York, NY',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'The type of job (e.g., Full-time, Part-time, Internship)',
    enum: JobTypes,
  })
  @IsNotEmpty()
  @IsEnum(JobTypes)
  job_type: JobTypes;

  @ApiPropertyOptional({
    description: 'The date when the job was posted',
    example: '2024-08-17T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  posted_at?: Date;

  @ApiProperty({
    description: 'The deadline for applying to the job',
    example: '2024-09-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  application_deadline: Date;
}

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @ApiProperty({
    description: 'The ID of the job to update',
    example: 'job-789',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiPropertyOptional({
    description: 'The ID of the job category',
    example: 'category-123',
  })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiPropertyOptional({
    description: 'The ID of the user who created the job',
    example: 'user-456',
  })
  @IsOptional()
  @IsString()
  created_by?: string;

  @ApiPropertyOptional({
    description: 'The title of the job opportunity',
    example: 'Senior Software Engineer',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'The name of the company offering the job',
    example: 'Tech Innovations',
  })
  @IsOptional()
  @IsString()
  company_name?: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the job opportunity',
    example: 'Lead a team of developers in building cutting-edge software...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The URL where applicants can apply for the job',
    example: 'https://techinnovations.com/careers',
  })
  @IsOptional()
  @IsUrl()
  apply_link?: string;

  @ApiPropertyOptional({
    description: 'The location where the job is based',
    example: 'San Francisco, CA',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'The type of job (e.g., Full-time, Part-time, Internship)',
    enum: JobTypes,
  })
  @IsOptional()
  @IsEnum(JobTypes)
  job_type?: JobTypes;

  @ApiPropertyOptional({
    description: 'The date when the job was posted',
    example: '2024-08-17T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  posted_at?: Date;

  @ApiPropertyOptional({
    description: 'The deadline for applying to the job',
    example: '2024-09-15T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  application_deadline?: Date;
}
