export const isBoolean = value => typeof value === "boolean";
export const isString = value => typeof value === "string";
export const isObject = value => value === Object(value);
export const isBetween = (value, min, max) => value > min && value <= max;
