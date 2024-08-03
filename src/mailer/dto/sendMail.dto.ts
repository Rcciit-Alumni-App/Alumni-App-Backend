// export interface SendMailDto {
//     from?: string;
//     recipients: string;
//     subject: string;
//     html: string;
//     text?: string;
//     placeholderReplacements?: Record<string, string>;
// }

export interface SendMailDto {
    email: string,
    mail_file: string,
    subject: string,
    data: Record<string, string>
}