import { UserType } from "@prisma/client"

export const verifyAlumniStudent = (email: string): { user_type: UserType, stream: string } => {
    const stripped_email = email.split('@')[0];
    const isBOrL = email.split('@')[1].toLowerCase()[1];
    const departmentCode = stripped_email.match(/^[a-zA-Z]+/)[0].toUpperCase();
    let year = parseInt(stripped_email.match(/(\d{4})/)[0], 10);
    const currentYear = new Date().getFullYear();

    if (isBOrL === 'b' || isBOrL === 'l') {
        year -= 1;
    }

    const userDetails: { user_type: UserType, stream: string } = {
        user_type: UserType.STUDENT,  // Default value, will be updated
        stream: departmentCode
    };

    if (year + 4 < currentYear) {
        userDetails.user_type = UserType.ALUMNI;
    } else {
        userDetails.user_type = UserType.STUDENT;
    }

    return userDetails;
}
