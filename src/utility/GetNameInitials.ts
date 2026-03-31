/**
 * Get initials of name from first and last name
 * @param name: string
 * @returns string
 */
const getNameInitials = (name: string) =>
{
    return name
        .split(' ')
        .filter(Boolean)
        .map(part => part[0].toLocaleUpperCase())
        .join('');
};

export default getNameInitials;
