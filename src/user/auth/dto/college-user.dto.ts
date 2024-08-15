import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CollegeUser {

    @IsEmail()
    @IsNotEmpty()
    college_mail: string;

    @IsEmail()
    @IsNotEmpty()
    personal_mail: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    roll_no: string;

    @IsString()
    @IsNotEmpty()
    stream: string;

    @IsString()
    @IsNotEmpty()
    year_of_passing: string;

    @IsString()
    @IsNotEmpty()
    phone_number: string;
}