export const isBoolean = value => typeof value === "boolean";
export const isString = value => typeof value === "string";
export const isObject = value => typeof value === "object";
export const between = (min, max, value) => value > min && value <= max;
