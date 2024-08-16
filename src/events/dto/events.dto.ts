import { IsString, IsArray, IsObject, IsDate, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class Attraction {
    @IsString()
    label: string;

    @IsString()
    value: string;
}

class Announcement {
    @IsString()
    title: string;

    @IsString()
    description: string;
}

export class CreateEventDto {
    @IsString()
    event_image: string;

    @IsString()
    banner_image: string;

    @IsString()
    venue: string;

    @IsArray()
    @IsString({ each: true })
    description: string[];

    @IsArray()
    @IsString({ each: true })
    images: string[];

    @IsString()
    schedule: string;

    @IsObject()
    @ValidateNested()
    @Type(() => Attraction)
    attractions: Attraction;

    @IsArray()
    @IsString({ each: true })
    rules: string[];

    @IsObject()
    @ValidateNested()
    @Type(() => Announcement)
    announcements: Announcement;

    @IsDate()
    @Type(() => Date)
    expires_at: Date;
}

export class UpdateEventDto {
    @IsOptional()
    @IsString()
    event_image?: string;

    @IsOptional()
    @IsString()
    banner_image?: string;

    @IsOptional()
    @IsString()
    venue?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    description?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsString()
    schedule?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Attraction)
    attractions?: Attraction;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    rules?: string[];

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Announcement)
    announcements?: Announcement;
}