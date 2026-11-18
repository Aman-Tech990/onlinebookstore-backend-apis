export function isAllowed(user, ...role) {
    if (!user) {
        return false;
    }
    return role.includes(user.role);
}