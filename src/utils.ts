export const isBoolean = (value: any): value is boolean => {
    return typeof value === 'boolean';
};
export const isString = (value: any): value is string => {
    return typeof value === 'string';
};
export function isObject<T extends Record<any, any>>(value: any): value is NonNullable<T> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
export const isBetween = (value: number, min: number, max: number): boolean => value > min && value <= max;
export const uuidV4 = (): string => {
    const search = /[018]/g;
    const replace = (c: any): string => {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    };

    return '10000000-1000-4000-8000-100000000000'.replace(search, replace);
};
