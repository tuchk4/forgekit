import ForgekitError from '../forgekit-error';
import { isFunction, isObject } from '../utils/types';

const getProps = (Component, bindProps, props) => {
  if (!bindProps) {
    return props;
  }

  let normalized = {};

  if (isFunction(bindProps)) {
    normalized = bindProps(props);

    if (!isObject(normalized)) {
      throw new ForgekitError(Component, `"bindProps" as fucntions should return Object but got "${typeof (normalized)}"`);
    }
  } else if (isObject(bindProps)) {
    normalized = {
      ...props,
      ...bindProps
    };

    normalized.theme = {
      ...(props.theme || {}),
      ...(bindProps.theme || {})
    }
  } else {
    throw new ForgekitError(Component, `"bindProps" argument should be Object or Function but got "${typeof (bindProps)}"`);
  }

  return normalized;
};

export default getProps;
