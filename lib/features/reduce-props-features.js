import ForgekitError from '../forgekit-error';
import { isObject } from '../utils/types';
import pickComponentTheme from '../theme/pick-component-theme';

const ANONYMOUS = '<<AnonymousFeature>>';

const reducePropsFeatures = (Component, propsFeatures, initialProps) => {

  return propsFeatures.reduce((forgedProps, feature) => {
    const featureProps = {
      ...forgedProps,
    };

    // pick theme values only from initial Props
    const featureTheme = pickComponentTheme(feature, initialProps);
    if (Object.keys(featureTheme).length) {
      featureProps.theme = featureTheme;
    }

    const featuredProps = feature(featureProps);

    if (!isObject(featuredProps)) {
      throw new ForgekitError(Component,`"${feature.name || ANONYMOUS}" feature should return Object but got "${typeof (featuredProps)}"`);
    }

    return featuredProps;
  }, initialProps);
};

export default reducePropsFeatures;
