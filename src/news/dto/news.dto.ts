import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsInt } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  banner?: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsInt()
  likes: number;

  @IsInt()
  views: number;

  @IsArray()
  @IsString({ each: true })
  reports: string[];

  @IsBoolean()
  admin_approval: boolean;

  @IsString()
  @IsNotEmpty()
  author_id: string; 
}

export class UpdateNewsDto {
    @IsOptional()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsOptional()
    @IsString()
    @IsOptional()
    banner?: string;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags: string[];
  
    @IsOptional()
    @IsInt()
    likes: number;
  
    @IsOptional()
    @IsInt()
    views: number;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    reports: string[];
  
    @IsOptional()
    @IsBoolean()
    admin_approval: boolean;
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    author_id: string; 
  }

export class CreateCommentDto  {
    @IsString()
    @IsNotEmpty()
    news_id: string;
  
    @IsString()
    @IsNotEmpty()
    user_id: string;
  
    @IsString()
    @IsNotEmpty()
    comment: string;
  
    @IsBoolean()
    @IsOptional()
    isEdited?: boolean;
  }

  export class UpdateCommentDto {
    @IsOptional()
    @IsString()
    id: string;

    @IsString()
    @IsNotEmpty()
    news_id: string;
  
    @IsString()
    @IsNotEmpty()
    user_id: string;
  
    @IsString()
    @IsNotEmpty()
    comment: string;
  
    @IsBoolean()
    @IsOptional()
    isEdited?: boolean;
  }
