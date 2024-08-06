import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus, UserType } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class HigherStudiesDto {
  @ApiProperty({
    description: 'ID of the higher studies entry',
    type: Number,
    example: 1,
  })
  @IsInt()
  id: number; 

  @ApiProperty({
    description: 'Name of the institute where the higher studies were pursued',
    type: String,
    example: 'Harvard University',
  })
  @IsString()
  institute: string;

  @ApiProperty({
    description: 'Name of the course undertaken',
    type: String,
    example: 'Computer Science',
  })
  @IsString()
  course: string;

  @ApiProperty({
    description: 'Start date of the higher studies',
    type: String,
    format: 'date-time',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'End date of the higher studies',
    type: String,
    format: 'date-time',
    example: '2025-12-31T00:00:00.000Z',
  })
  @IsDateString()
  end_date: Date;
}

export class InternshipsDto {
  @ApiProperty({
    description: 'ID of the internship entry',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  id?: number; 
  
  @ApiProperty({
    description: 'Name of the company where the internship took place',
    type: String,
    example: 'Tech Corp',
  })
  @IsString()
  company: string;

  @ApiProperty({
    description: 'Role during the internship',
    type: String,
    example: 'Software Engineer Intern',
  })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'Start date of the internship',
    type: String,
    format: 'date-time',
    example: '2023-06-01T00:00:00.000Z',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'End date of the internship',
    type: String,
    format: 'date-time',
    example: '2023-08-31T00:00:00.000Z',
  })
  @IsDateString()
  end_date: Date;

  @ApiProperty({
    description: 'List of skills acquired during the internship',
    type: [String],
    example: ['JavaScript', 'React', 'Node.js'],
  })
  @IsArray()
  @IsString({ each: true })
  skills: string[];
}
export class UserDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    type: String,
    example: '60d21bb67c13c842aa5b5c7e',
  })
  @IsString()
  id: string;

  @ApiPropertyOptional({
    description: 'Full name of the user',
    type: String,
    example: 'John Doe',
  })
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    type: String,
    example: '+1234567890',
  })
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Domain',
    type: String,
    example: 'Web Development',
  })
  @IsString()
  domain?: string;

  @ApiProperty({
    description: 'Personal email of the user',
    type: String,
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  personal_mail: string;

  @ApiProperty({
    description: 'College email of the user',
    type: String,
    example: 'johndoe@college.edu',
  })
  @IsEmail()
  @IsNotEmpty()
  college_mail: string;

  @ApiProperty({
    description: 'College roll number of the user',
    type: String,
    example: 'COL123456',
  })
  @IsString()
  @IsNotEmpty()
  college_roll: string;

  @ApiPropertyOptional({
    description: 'University roll number of the user',
    type: String,
    example: 'UNIV123456',
  })
  @IsString()
  university_roll?: string;

  @ApiPropertyOptional({
    description: 'Profile picture URL of the user',
    type: String,
    example: 'https://example.com/profile.jpg',
  })
  @IsString()
  profile_pic_url?: string;

  @ApiProperty({
    description: 'Type of the user',
    enum: UserType,
    example: UserType.STUDENT,
  })
  @IsEnum(UserType)
  user_type: UserType;

  @ApiPropertyOptional({
    description: 'Stream of the user',
    type: String,
    example: 'Computer Science',
  })
  @IsString()
  stream?: string;

  @ApiProperty({
    description: 'Status of the user',
    enum: UserStatus,
    example: UserStatus.ACCOUNT_DETAILS,
  })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiPropertyOptional({
    description: 'List of user’s higher studies',
    type: [HigherStudiesDto], // Reference to HigherStudiesDto class
  })
  @IsOptional()
  @IsArray()
  higher_studies?: HigherStudiesDto[];


  @ApiPropertyOptional({
    description: 'List of user’s internships',
    type: [InternshipsDto], // Reference to InternshipsDto class
  })
  @IsOptional()
  @IsArray()
  internships?: InternshipsDto[];
}

export class HigherStudiesUpdateDto {
  @ApiProperty({
    description: 'ID of the higher studies entry',
    type: Number,
    example: 1,
  })
  @IsInt()
  id: number; 

  @ApiProperty({
    description: 'Name of the institute',
    type: String,
    example: 'University of Example',
  })
  @IsString()
  institute: string;

  @ApiProperty({
    description: 'Course pursued',
    type: String,
    example: 'Master of Science in Computer Science',
  })
  @IsString()
  course: string;

  @ApiProperty({
    description: 'Start date of the higher studies',
    type: String,
    format: 'date-time',
    example: '2021-09-01T00:00:00Z',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'End date of the higher studies',
    type: String,
    format: 'date-time',
    example: '2023-06-30T00:00:00Z',
  })
  @IsDateString()
  end_date: Date;
}

export class InternshipsUpdateDto {
  @ApiProperty({
    description: 'ID of the internship entry',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  id?: number; 

  @ApiProperty({
    description: 'Company name',
    type: String,
    example: 'Tech Corp',
  })
  @IsString()
  company: string;

  @ApiProperty({
    description: 'Role at the company',
    type: String,
    example: 'Software Engineer',
  })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'Start date of the internship',
    type: String,
    format: 'date-time',
    example: '2023-01-01T00:00:00Z',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'End date of the internship',
    type: String,
    format: 'date-time',
    example: '2023-06-30T00:00:00Z',
  })
  @IsDateString()
  end_date: Date;

  @ApiProperty({
    description: 'Skills gained during the internship',
    type: [String],
    example: ['JavaScript', 'TypeScript', 'Node.js'],
  })
  @IsArray()
  @IsString({ each: true })
  skills: string[];
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User’s full name',
    type: String,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({
    description: 'User’s phone number',
    type: String,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User’s personal email address',
    type: String,
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  personal_mail?: string;

  @ApiPropertyOptional({
    description: 'Domain',
    type: String,
    example: 'Web Development',
  })
  @IsString()
  domain?: string;

  @ApiPropertyOptional({
    description: 'User’s college email address',
    type: String,
    example: 'john.doe@college.edu',
  })
  @IsEmail()
  @IsOptional()
  college_mail?: string;

  @ApiPropertyOptional({
    description: 'User’s university roll number',
    type: String,
    example: 'UNI123456',
  })
  @IsOptional()
  @IsString()
  university_roll?: string;

  @ApiPropertyOptional({
    description: 'URL of user’s profile picture',
    type: String,
    example: 'http://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  profile_pic_url?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    description: 'List of user’s higher studies',
    type: [HigherStudiesUpdateDto],
  })
  @IsOptional()
  @IsArray()
  higher_studies?: HigherStudiesUpdateDto[];

  @ApiPropertyOptional({
    description: 'List of user’s internships',
    type: [InternshipsUpdateDto],
  })
  @IsOptional()
  @IsArray()
  internships?: InternshipsUpdateDto[];
}
