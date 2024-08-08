import { IsNotEmpty, IsString } from "class-validator";

export class InsertDocumentDto {
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
    passing_year: string;
    @IsString()
    @IsNotEmpty()
    phone_number: string;
    @IsString()
    @IsNotEmpty()
    personal_mail: string;
    @IsString()
    @IsNotEmpty()
    college_mail: string;
}