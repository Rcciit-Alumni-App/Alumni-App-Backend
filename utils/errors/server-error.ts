import { HttpException, HttpStatus } from "@nestjs/common";

export class InternalServerError extends HttpException {
  constructor() {
    super('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}