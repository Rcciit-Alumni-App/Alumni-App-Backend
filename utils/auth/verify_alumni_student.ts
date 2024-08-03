import { UserType } from "@prisma/client"

export const verifyAlumniStudent = (email: string): UserType => {
    const stripped_email = email.split('@')[0];
    const year = parseInt(stripped_email.match(/(\d{4})/)[0], 10);
    console.log('Email Year:', year);
    const currentYear = new Date().getFullYear();
    console.log('Current Year:', currentYear);

    if (year + 4 < currentYear)
        return UserType.ALUMNI;
    else
        return UserType.STUDENT;
}