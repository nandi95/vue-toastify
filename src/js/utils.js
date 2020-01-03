export const isBoolean = value => typeof value === "boolean";
export const isString = value => typeof value === "string";
export const isObject = value => typeof value === "object";
export const isFunction = value => typeof value === "function";
export const isEmpty = value => {
  return (
    typeof value === "undefined" ||
    value.length === 0 ||
    Object.keys(value).length === 0
  );
};
