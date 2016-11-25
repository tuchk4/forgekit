import React from 'react';

import { isObject, isFunction } from './utils/types';
import ForgekitError from './forgekit-error';
import readonlyComponentPropsDefinition from './utils/readonly-component-props-definition';
import collectProps from './utils/collect-props';
import getMountedProps from './utils/get-mounted-props';

// Feature validation
import normalizeFeatures from './features/normalize-features';
import splitFeatures from './features/split-features';

// Feature processors
import reducePropsFeatures from './features/reduce-props-features';
import reduceHocFeatures from './features/reduce-hoc-features';

// Theme helpers
import pickComponentTheme from './theme/pick-component-theme';

const forge = (...features) => {
  return (Component, displayName, mountedProps) => {
    const normalizedFeatures = normalizeFeatures(Component, features);
    const { hocFeatures, propsFeatures } = splitFeatures(normalizedFeatures);

    const ForgedComponent = (props) => {
      const definedProps = getMountedProps(Component, mountedProps, props);

      const initialProps = {
        ...props,
        ...definedProps,
      };

      if (definedProps.theme || props.theme) {
        initialProps.theme = {
          ...(props.theme || {}),
          ...(definedProps.theme || {})
        }
      }

      // NOTE: invalid Component.displayName here
      const forgedProps = reducePropsFeatures(Component, propsFeatures, initialProps);

      const componentTheme = pickComponentTheme(Component, initialProps);
      if (Object.keys(componentTheme).length) {
        forgedProps.theme = componentTheme;
      }

      if (hocFeatures.length) {
        const ForgedHocComponent = reduceHocFeatures(Component, hocFeatures, forgedProps);
        return React.createElement(ForgedHocComponent, forgedProps);
      } else {
        return React.createElement(Component, forgedProps);
      }
    };

    ForgedComponent.displayName = displayName || Component.name;

    const { propTypes, defaultProps } = collectProps(Component, features);
    readonlyComponentPropsDefinition(ForgedComponent, propTypes, defaultProps);

    return ForgedComponent;
  };
};


export default forge;
export ThemeProp from './theme/theme-prop';
