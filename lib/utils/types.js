export const isObject = value => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
};

export const isFunction = value => typeof value === 'function';
export const isUndefined = value => typeof value === 'undefined';
