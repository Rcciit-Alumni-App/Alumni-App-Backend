import { BadRequestException } from "@nestjs/common"

export const imageFileFilter = (req: Request, file: any, callback: (error: any, valid: boolean) => void) => {
    if (!file.originalname || !file.originalname.match(/\.(csv)$/)) {
        return callback(new BadRequestException("File must be of type .csv"), false);
    }

    callback(null, true);
}