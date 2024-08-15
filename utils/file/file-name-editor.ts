import { Request } from "express";

export const filenameEditor = (req: Request, file: any, callback: (error: any, filename: string) => void) => {
    const filename = file.originalname.split('.csv')[0];
    const newFile = `${filename}-${Date.now()}.csv`;

    callback(null, newFile);
}