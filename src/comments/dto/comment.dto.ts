import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({
        description: 'The content of the comment',
        example: 'This is a great article!',
    })
    @IsString()
    @IsNotEmpty()
    comment: string;

    @ApiProperty({
        description: 'The ID of the news article to which the comment belongs',
        example: 'abc123',
    })
    @IsString()
    @IsNotEmpty()
    newsId: string;
}
