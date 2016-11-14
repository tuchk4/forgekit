import ForgekitError from '../forgekit-error';
import { isObject, isFunction } from '../utils/types';

const AVAILABLE_ATTRIBUTES = [
  'props',
  'hoc'
];

const isValidFeatureType = feature => isObject(feature) || isFunction(feature);

const isValidFeatureValue = feature => {
  let isValid = true;
  let atLeastOneExists = false;

  const featureAttribtues = Object.keys(feature);

  for (const availableAttribtue of AVAILABLE_ATTRIBUTES) {
    if (featureAttribtues.indexOf(availableAttribtue) != -1) {
      if (isFunction(feature[availableAttribtue])) {
        atLeastOneExists = true;
      } else {
        isValid = false;
      }
    }
  };

  return isValid && atLeastOneExists;
};

const ANONYMOUS = '<<AnonymousFeature>>';

class InvalidFetureValue extends ForgekitError {
  constructor(component, feature) {
    super(component, `Invalid "${feature.name || ANONYMOUS}" feature value. Expect at least one function of "${AVAILABLE_ATTRIBUTES.join(' / ')}"`);
  }
};

class InvalidFeatureType extends ForgekitError {
  constructor(component, feature) {
    super(component, `Invalid "${feature.name || ANONYMOUS}" feature type. Expect Function or Object but got "${typeof feature}"`);
  }
};

const normalizeFeature = feature => {
 if (!isObject(feature)) {
   return {
     props: feature
   };
 } else {
   return feature;
 }
};

const normalizeFeatures = (Component, features) => {
  const normalized = [];

  for (const feature of features) {
    if (isValidFeatureType(feature)) {
      const normalizedFeature = normalizeFeature(feature);

      if (!isValidFeatureValue(normalizedFeature)) {
        throw new InvalidFetureValue(Component, feature);
      }

      normalized.push(normalizedFeature);
    } else {
      throw new InvalidFeatureType(Component, feature);
    }
  }

  return normalized;
};

export default normalizeFeatures;
