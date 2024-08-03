import { UserType } from "@prisma/client"

export const verifyAlumniStudent = (email: string): UserType => {
    const stripped_email = email.split('@')[0];
    const isBOrL = email.split('@')[1].toLowerCase()[1];
    let year = parseInt(stripped_email.match(/(\d{4})/)[0], 10);
    console.log('Email Year:', year);
    const currentYear = new Date().getFullYear();
    console.log('Current Year:', currentYear);

    if (isBOrL === 'b' || isBOrL === 'l')
        year -= 1;

    if (year + 4 < currentYear)
        return UserType.ALUMNI;
    else
        return UserType.STUDENT;
}