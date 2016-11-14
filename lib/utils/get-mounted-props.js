import ForgekitError from '../forgekit-error';
import { isFunction, isObject } from '../utils/types';

const getMountedProps = (Component, mountedProps, props) => {
  if (!mountedProps) {
    return {};
  }

  let normalized = {};

  if (isFunction(mountedProps)) {
    normalized = mountedProps(props);

    if (!isObject(normalized)) {
      throw new ForgekitError(Component, `"mountedProps" as fucntions should return Object but got "${typeof (normalized)}"`);
    }
  } else if (isObject(mountedProps)) {
    normalized = {
      ...mountedProps,
    };
  } else {
    throw new ForgekitError(Component, `"mountedProps" argument should be Object or Function but got "${typeof (mountedProps)}"`);
  }

  return normalized;
};

export default getMountedProps;
