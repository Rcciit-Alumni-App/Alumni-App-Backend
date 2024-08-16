import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CollegeUser {

    @ApiProperty({
        description: 'The college email address of the user',
        example: 'student@college.edu'
    })
    @IsEmail()
    @IsNotEmpty()
    college_mail: string;

    @ApiProperty({
        description: 'The personal email address of the user',
        example: 'student@example.com'
    })
    @IsEmail()
    @IsNotEmpty()
    personal_mail: string;

    @ApiProperty({
        description: 'The full name of the user',
        example: 'John Doe'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The roll number of the user',
        example: '123456'
    })
    @IsString()
    @IsNotEmpty()
    roll_no: string;

    @ApiProperty({
        description: 'The stream of study of the user',
        example: 'Computer Science'
    })
    @IsString()
    @IsNotEmpty()
    stream: string;

    @ApiProperty({
        description: 'The year of passing out for the user',
        example: '2025'
    })
    @IsString()
    @IsNotEmpty()
    year_of_passing: string;

    @ApiProperty({
        description: 'The phone number of the user',
        example: '+1234567890'
    })
    @IsString()
    @IsNotEmpty()
    phone_number: string;
}
