import React from 'react';

const collectPropsConfig = ({ originalComponent, withProps, features }) => {
  const propTypes = {
    ...(originalComponent.propTypes || {}),
  };

  const defaultProps = {
    ...(originalComponent.defaultProps || {}),
  };

  for (const feature of features) {
    if (feature.propTypes) {
      Object.assign(propTypes, feature.propTypes);
    }

    if (feature.defaultProps) {
      Object.assign(defaultProps, feature.defaultProps);
    }
  }

  if (originalComponent.defaultProps) {
    Object.assign(defaultProps, {
      ...withProps,
    });
  }

  return { propTypes, defaultProps };
};

const enchantWithFeatures = (...features) => {
  return (originalComponent, displayName = null, withProps = {}) => {
    const { propTypes, defaultProps } = collectPropsConfig({
      originalComponent,
      withProps,
      features,
    });

    const FeaturedComponent = (props) => {
      let featuredProps = {
        ...props,
      };

      for (const feature of features) {
        featuredProps = feature(featuredProps);
      }

      return React.createElement(originalComponent, featuredProps);
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
