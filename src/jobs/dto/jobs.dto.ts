import { PartialType } from "@nestjs/swagger";
import { JobTypes } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";


export class CreateJobDto {
    @IsNotEmpty()
    @IsString()
    category_id: string;
  
    @IsNotEmpty()
    @IsString()
    created_by: string;
  
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsNotEmpty()
    @IsString()
    company_name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsUrl()
    apply_link?: string;
  
    @IsString()
    location?: string;
  
    @IsNotEmpty()
    @IsEnum(JobTypes)
    job_type: JobTypes;
  
    @IsOptional()
    @IsDateString()
    posted_at?: Date;
  
    @IsNotEmpty()
    @IsDateString()
    application_deadline: Date;
  }

  export class UpdateJobDto extends PartialType(CreateJobDto) {
    @IsString()
    id: string;
  
    @IsOptional()
    @IsString()
    category_id?: string;
  
    @IsOptional()
    @IsString()
    created_by?: string;
  
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    company_name?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsUrl()
    apply_link?: string;
  
    @IsOptional()
    @IsString()
    location?: string;
  
    @IsOptional()
    @IsEnum(JobTypes)
    job_type?: JobTypes;
  
    @IsOptional()
    @IsDateString()
    posted_at?: Date;
  
    @IsOptional()
    @IsDateString()
    application_deadline?: Date;
  }