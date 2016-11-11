import React from 'react';
import collectProps from './collect-props';
import ThemeProp from './theme-prop';

const pickFeatureTheme = (feature, props) => {
  const featureTheme = {};

  if (feature.propTypes && feature.propTypes.theme && props.theme) {
    for (const themeKey of feature.propTypes.theme.themeKeys) {
      featureTheme[themeKey] = props.theme[themeKey];
    }
  }

  return featureTheme;
};

const isObject = value => typeof value === 'object' && !Array.isArray(value) && value !== null;

const enchantWithFeatures = (...features) => {
  return (component, displayName = null, withProps = {}) => {
    const { propTypes, defaultProps } = collectProps(component, features);

    const FeaturedComponent = (props) => {
      /**
       * NOTE: withProps or props should be more with pirority?
       *
       * const initialProps = {
       *   ...props,
       *   ...withProps,
       * };
       *
       * props - Forgeed component props
       * withProps - props that were passed at forge functions
       *
       * In case if "withProps" with more priority - that properties
       * never would be overriden via Component props. And lines :42-:47 could be deleted
       */
      const initialProps = {
        ...props,
        ...withProps,
      };

      if (withProps.theme || props.theme) {
        initialProps.theme = {
          ...(props.theme || {}),
          ...(withProps.theme || {}),
        };
      }

      const postForge = [];
      const forgedProps = features.reduce((forgedProps, feature) => {
        if (feature.postForge) {
          postForge.push(feature.postForge);
        }

        const featureProps = {
          ...forgedProps,
        };

        // pick theme values only from initial Props
        const featureTheme = pickFeatureTheme(feature, initialProps);
        if (Object.keys(featureTheme).length) {
          featureProps.theme = featureTheme;
        }

        const featuredProps = feature({
          ...featureProps,
        });

        if (!isObject(featuredProps)) {
          throw new Error(`Forge <${component.name}/>: "${feature.name}" feature should return Object but got "${typeof (featuredProps)}"`);
        }

        return featuredProps;
      }, initialProps);

      const postForgedProps = postForge.reduce((postForgeProps, postForge) => {
        return postForge({
          ...postForgeProps,
        });
      }, forgedProps);


      // pick theme values only from initial Props
      const componentTheme = pickFeatureTheme(component, initialProps);
      if (Object.keys(componentTheme).length) {
        postForgedProps.theme = componentTheme;
      }

      return React.createElement(component, postForgedProps);
    };

    FeaturedComponent.propTypes = propTypes;
    FeaturedComponent.defaultProps = defaultProps;

    if (displayName) {
      FeaturedComponent.displayName = displayName;
    }

    return FeaturedComponent;
  };
};

module.exports = enchantWithFeatures;
module.exports.ThemeProp = ThemeProp;
