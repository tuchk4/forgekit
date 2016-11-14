import ForgekitError from '../forgekit-error';

const readonlyComponentPropsDefinition = (Component, propTypes, defaultProps) => {
  Object.defineProperty(Component, 'defaultProps', {
    set: () => {
      throw new ForgekitError(Component, 'defaultProps attribute is readonly');
    },
    get: () => defaultProps,
  });

  Object.defineProperty(Component, 'propTypes', {
    set: () => {
      throw new ForgekitError(Component, 'propTypes attribute is readonly');
    },
    get: () => propTypes,
  });
}

export default readonlyComponentPropsDefinition;
