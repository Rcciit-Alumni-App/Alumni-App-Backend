import { Injectable } from '@nestjs/common';
import { InsertDocumentDto } from './dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ApiService {

    constructor(private readonly prisma: PrismaClient) { }
    async insertDocument(insertDto: InsertDocumentDto) {
        // TODO: Logic to be implemented
        const user = await this.prisma.collegeUser.create({
            data: {
                name: insertDto.name,
                college_mail: insertDto.college_mail,
                personal_mail: insertDto.personal_mail,
                passing_year: insertDto.passing_year,
                roll_no: insertDto.roll_no,
                stream: insertDto.stream,
                phone_number: insertDto.phone_number
            }
        });

        return {
            user
        };
    }

}
