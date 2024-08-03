export const verifyRollNo = (roll: string, email: string): boolean => {
    const stripped_roll = email.split('@')[0].toLowerCase();
    const lowered_roll = roll.toLowerCase();
    console.log('Stripped Roll:', stripped_roll);
    console.log('Roll:', lowered_roll);
    if (stripped_roll === lowered_roll)
        return true;
    else
        return false;
}