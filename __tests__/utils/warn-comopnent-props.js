import React from 'react';

const createWarnComponent = (Component) => {
  const availableProps = Object.keys(Component.propTypes);
  const hasTheme = Component.propTypes.hasOwnProperty('theme');

  const availableThemeKeys = hasTheme
    ? Component.propTypes.theme.themeKeys
    : [];

  const WarnComponent = (props) => {
    for (const propId of Object.keys(props)) {
      if (availableProps.indexOf(propId) === -1) {
        console.warn(`"${propId}" is not defiend at "${Component.name}" propsTypes`);
      }

      if (hasTheme && propId === 'theme') {
        for (const themeKey of Object.keys(props[propId])) {
          if (availableThemeKeys.indexOf(themeKey) === -1) {
            console.warn(`"${themeKey}" is not defiend at "${Component.displayName}" component's theme`);
          }
        }
      }
    }

    return <Component {...props} />;
  };

  WarnComponent.propTypes = Component.propTypes;
  WarnComponent.defaultProps = Component.defaultProps;
  WarnComponent.displayName = Component.displayName;

  return WarnComponent;
};


export default createWarnComponent;
