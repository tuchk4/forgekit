import React from 'react';

import { isObject, isFunction } from './utils/types';
import ForgekitError from './forgekit-error';
import collectProps from './utils/collect-props';
import getProps from './utils/get-props';

// Feature validation
import normalizeFeatures from './features/normalize-features';
import splitFeatures from './features/split-features';

// Feature processors
import reducePropsFeatures from './features/reduce-props-features';
import reduceHocFeatures from './features/reduce-hoc-features';

// Theme helpers
import pickComponentTheme from './theme/pick-component-theme';

const FORGED_COMPONENT_DATA_ATTRIBUTRE = 'data-forged-component';

const forge = (...features) => {
  return (Component, displayName, bindProps) => {
    const normalizedFeatures = normalizeFeatures(Component, features);
    const { hocFeatures, propsFeatures } = splitFeatures(normalizedFeatures);

    const ForgedComponent = (props) => {
      const initialProps = getProps(Component, bindProps, props);

      // NOTE: invalid Component.displayName here
      const forgedProps = reducePropsFeatures(Component, propsFeatures, initialProps);

      const componentTheme = pickComponentTheme(Component, initialProps);
      if (Object.keys(componentTheme).length) {
        forgedProps.theme = componentTheme;
      }

      const forgekitDataAttribtue = {
        [FORGED_COMPONENT_DATA_ATTRIBUTRE]: true
      };

      if (hocFeatures.length) {
        const ForgedHocComponent = reduceHocFeatures(Component, hocFeatures, forgedProps);
        return <ForgedHocComponent {...forgedProps} {...forgekitDataAttribtue}/>;
      } else {
        return <Component {...forgedProps} {...forgekitDataAttribtue}/>;
      }
    };

    ForgedComponent.displayName = displayName || Component.name;

    const { propTypes, defaultProps } = collectProps(Component, features);

    ForgedComponent.propTypes = propTypes;
    ForgedComponent.defaultProps = defaultProps;

    return ForgedComponent;
  };
};


export default forge;
export ThemeProp from './theme/theme-prop';
