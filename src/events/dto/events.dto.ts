import { IsString, IsArray, IsObject, IsDate, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class Attraction {
    @ApiProperty({
        description: 'Label for the attraction',
        example: 'Main Speaker',
    })
    @IsString()
    label: string;

    @ApiProperty({
        description: 'Value or identifier for the attraction',
        example: 'speaker1',
    })
    @IsString()
    value: string;
}

class Announcement {
    @ApiProperty({
        description: 'Title of the announcement',
        example: 'Event Postponed',
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Description of the announcement',
        example: 'The event has been postponed due to unforeseen circumstances.',
    })
    @IsString()
    description: string;
}

export class CreateEventDto {
    @ApiProperty({
        description: 'URL of the event image',
        example: 'https://example.com/event-image.jpg',
    })
    @IsString()
    event_image: string;

    @ApiProperty({
        description: 'URL of the banner image',
        example: 'https://example.com/banner-image.jpg',
    })
    @IsString()
    banner_image: string;

    @ApiProperty({
        description: 'Venue of the event',
        example: 'Convention Center, New York',
    })
    @IsString()
    venue: string;

    @ApiProperty({
        description: 'Description of the event',
        type: [String],
        example: ['Introduction to the event', 'Main attractions', 'Conclusion'],
    })
    @IsArray()
    @IsString({ each: true })
    description: string[];

    @ApiProperty({
        description: 'List of image URLs related to the event',
        type: [String],
        example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    })
    @IsArray()
    @IsString({ each: true })
    images: string[];

    @ApiProperty({
        description: 'Event schedule as a string',
        example: '09:00 AM - Opening Ceremony',
    })
    @IsString()
    schedule: string;

    @ApiProperty({
        description: 'List of main attractions of the event',
        type: Attraction,
    })
    @IsObject()
    @ValidateNested()
    @Type(() => Attraction)
    attractions: Attraction;

    @ApiProperty({
        description: 'List of rules for the event',
        type: [String],
        example: ['No outside food', 'No smoking'],
    })
    @IsArray()
    @IsString({ each: true })
    rules: string[];

    @ApiProperty({
        description: 'Announcements related to the event',
        type: Announcement,
    })
    @IsObject()
    @ValidateNested()
    @Type(() => Announcement)
    announcements: Announcement;

    @ApiProperty({
        description: 'Expiration date and time of the event',
        example: '2024-12-31T23:59:59Z',
    })
    @IsDate()
    @Type(() => Date)
    expires_at: Date;
}

export class UpdateEventDto {
    @ApiPropertyOptional({
        description: 'URL of the event image',
        example: 'https://example.com/event-image.jpg',
    })
    @IsOptional()
    @IsString()
    event_image?: string;

    @ApiPropertyOptional({
        description: 'URL of the banner image',
        example: 'https://example.com/banner-image.jpg',
    })
    @IsOptional()
    @IsString()
    banner_image?: string;

    @ApiPropertyOptional({
        description: 'Venue of the event',
        example: 'Convention Center, New York',
    })
    @IsOptional()
    @IsString()
    venue?: string;

    @ApiPropertyOptional({
        description: 'Description of the event',
        type: [String],
        example: ['Introduction to the event', 'Main attractions', 'Conclusion'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    description?: string[];

    @ApiPropertyOptional({
        description: 'List of image URLs related to the event',
        type: [String],
        example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiPropertyOptional({
        description: 'Event schedule as a string',
        example: '09:00 AM - Opening Ceremony',
    })
    @IsOptional()
    @IsString()
    schedule?: string;

    @ApiPropertyOptional({
        description: 'List of main attractions of the event',
        type: Attraction,
    })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Attraction)
    attractions?: Attraction;

    @ApiPropertyOptional({
        description: 'List of rules for the event',
        type: [String],
        example: ['No outside food', 'No smoking'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    rules?: string[];

    @ApiPropertyOptional({
        description: 'Announcements related to the event',
        type: Announcement,
    })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Announcement)
    announcements?: Announcement;
}
