import {
    IsString,
    IsArray,
    IsOptional,
} from 'class-validator';

export class CreateNewsDto {
    @IsString()
    author_id: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    banner: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}

export class UpdateNewsDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    banner?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}
