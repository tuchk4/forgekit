import ForgekitError from '../forgekit-error';
import { isObject } from '../utils/types';
import pickComponentTheme from '../theme/pick-component-theme';

const ANONYMOUS = '<<AnonymousFeature>>';

const reducePropsFeatures = (Component, propsFeatures, initialProps) => {
  let forgedProps = {
    ...initialProps
  };

  for (let i = 0, len = propsFeatures.length; i < len; i++) {
    const featureProps = {
      ...forgedProps,
    };

    const feature = propsFeatures[i];

    // pick theme values only from initial Props
    const featureTheme = pickComponentTheme(feature, initialProps);
    if (Object.keys(featureTheme).length) {
      featureProps.theme = featureTheme;
    }

    forgedProps = feature(featureProps);

    if (!isObject(forgedProps)) {
      throw new ForgekitError(Component,`"${feature.name || ANONYMOUS}" feature should return Object but got "${typeof (forgedProps)}"`);
    }
  }

  return forgedProps;
};

export default reducePropsFeatures;
