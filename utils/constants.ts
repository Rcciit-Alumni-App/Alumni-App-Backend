import { join } from "path";

export const AUTH_SECRETS = {
    JWT_AUTHENTICATION_SECRET: 'JWT_AUTHENTICATION_SECRET',
    JWT_VERIFICATION_SECRET: 'JWT_VERIFICATION_SECRET'
};

export const MAIL_OPTIONS = {
    MAIL_HOST: 'MAIL_HOST',
    MAIL_PORT: 'MAIL_PORT',
    MAIL_USER: 'MAIL_USER',
    MAIL_PASSWORD: 'MAIL_PASSWORD',
    APP_NAME: 'APP_NAME',
    DEFAULT_MAIL_FROM: 'DEFAULT_MAIL_FROM'
};

export const FILE_UPLOAD_DIR = join(process.cwd(), 'uploads');