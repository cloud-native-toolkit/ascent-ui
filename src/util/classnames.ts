
export const classnames = (...classNames: Array<string | undefined>) => {
    return classNames.filter(val => !!val).join(' ');
}
