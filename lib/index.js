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
const isFunction = value => typeof value === 'function';

const enchantWithFeatures = (...features) => {
  return (component, displayName = null, withProps = {}) => {
    const { propTypes, defaultProps } = collectProps(component, features);

    const FeaturedComponent = (props) => {
      let definedProps = null;

      if (isFunction(withProps)) {
        definedProps = withProps(props);
      } else if (isObject(withProps)) {
        definedProps = {
          ...withProps,
        };
      } else {
        throw new Error(`Forge <${component.name}/>: "withProps" argument should be Object or Function but got "${typeof (withProps)}"`);
      }

      const initialProps = {
        ...props,
        ...definedProps,
      };

      if (definedProps.theme || props.theme) {
        initialProps.theme = {
          ...(props.theme || {}),
          ...(definedProps.theme || {}),
        };
      }

      const postForge = [];
      const forgedProps = features.reduce((forgedProps, feature) => {
        if (!isFunction(feature)) {
          throw new Error(`Forge <${component.name}/>: "${feature.name}" feature should be Function but got "${typeof (feature)}"`);
        }

        if (feature.postForge) {
          postForge.push({
            name: feature.name,
            postForge: feature.postForge,
          });
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

      // ---- POST FORGE
      const postForgedProps = postForge.reduce((postForgeProps, {
        name,
        postForge,
      }) => {
        if (!isFunction(postForge)) {
          throw new Error(`Forge <${component.name}/>: "${name}" postForge should be Function but got "${typeof (postForge)}"`);
        }

        return postForge({
          ...postForgeProps,
        });
      }, forgedProps);

      const componentTheme = pickFeatureTheme(component, initialProps);
      if (Object.keys(componentTheme).length) {
        postForgedProps.theme = componentTheme;
      }

      return React.createElement(component, postForgedProps);
    };

    Object.defineProperty(FeaturedComponent, 'defaultProps', {
      set: () => {
        throw new Error(`Forge <${displayName || component.name}/>: deafultProps attribute is readonly`);
      },
      get: () => defaultProps,
    });

    Object.defineProperty(FeaturedComponent, 'propTypes', {
      set: () => {
        throw new Error(`Forge <${displayName || component.name}/>: propTypes attribute is readonly`);
      },
      get: () => propTypes,
    });

    if (displayName) {
      FeaturedComponent.displayName = displayName;
    }

    return FeaturedComponent;
  };
};

module.exports = enchantWithFeatures;
module.exports.ThemeProp = ThemeProp;
