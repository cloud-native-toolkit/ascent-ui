
export const unique = <T>(name: keyof T) => {
    return (previous: T[], current: T) => {
        if (previous.filter(val => val[name] === current[name]).length === 0) {
            previous.push(current);
        }

        return previous;
    }
}
