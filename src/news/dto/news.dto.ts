import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNewsDto {
    @ApiProperty({
        description: 'The title of the news post',
        example: 'New Feature Released',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'The detailed description of the news post',
        example: 'We have just released a new feature that allows...',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'The URL of the banner image for the news post',
        example: 'https://example.com/banner.jpg',
    })
    @IsString()
    @IsNotEmpty()
    banner: string;

    @ApiProperty({
        description: 'An array of tags related to the news post',
        example: ['release', 'feature', 'update'],
        isArray: true,
    })
    @IsArray()
    @IsString({ each: true })
    tags: string[];
}

export class UpdateNewsDto {
    @ApiPropertyOptional({
        description: 'The updated title of the news post',
        example: 'Updated Feature Announcement',
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        description: 'The updated description of the news post',
        example: 'We have updated the feature to include...',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'The updated URL of the banner image for the news post',
        example: 'https://example.com/updated-banner.jpg',
    })
    @IsOptional()
    @IsString()
    banner?: string;

    @ApiPropertyOptional({
        description: 'An updated array of tags related to the news post',
        example: ['update', 'feature', 'news'],
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}
