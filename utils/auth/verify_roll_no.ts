export const verifyRollNo = (roll: string, email: string): boolean => {
    const stripped_roll = email.split('@')[0].toLowerCase();
    const lowered_roll = roll.toLowerCase();
    if (stripped_roll === lowered_roll)
        return true;
    else
        return false;
}