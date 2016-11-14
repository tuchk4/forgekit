import ThemeProp from '../theme/theme-prop';
import ForgekitError from '../forgekit-error';
import { isUndefined } from '../utils/types';

// could be AnonymousComopnent or AnonymousFeature
const ANONYMOUS = '<<Anonymous>>';

const iteratePropsTypes = (propParser, customPropParsers = {}) => {
  return comopnent => {
    if (comopnent.propTypes) {
      for (const propId of Object.keys(comopnent.propTypes)) {
        const defaultValue = (comopnent.defaultProps || {})[propId];
        // NOTE: not sure about line below ¯\_(ツ)_/¯
        const name = comopnent.displayName || comopnent.name || ANONYMOUS;

        if (customPropParsers[propId]) {
          customPropParsers[propId](comopnent.propTypes[propId], defaultValue, name);
        } else {
          propParser(propId, comopnent.propTypes[propId], defaultValue, name);
        }
      }
    }
  };
};

const collectProps = (Component, features) => {
  const propTypes = {};
  const defaultProps = {};

  const propsDebugInformation = {};
  const themeDebugInformation = {};

  const theme = {};
  const themeDefaults = {};

  // these flags are used to prevent !!Object.kyes(theme).length
  let isThemeExists = false;
  let isThemeDefaultsExists = false;

  const propParser = (propId, propType, defaultValue, featureName) => {

    if (propTypes[propId] && propTypes[propId] != propType) {
      throw new ForgekitError(Component, `Prop "${propId}" was defined at "${featureName}" and "${propsDebugInformation[propId]}" with different propType`);
    }

    propTypes[propId] = propType;

    if (!isUndefined(defaultValue)) {
      defaultProps[propId] = defaultValue;
    }

    propsDebugInformation[propId] = featureName;
  };

  const themeParsed = (themeType, defaultValue = {}, featureName) => {
    if (!themeType.themeKeys) {
      throw new ForgekitError(Component, `property "theme" should be the ThemeProp type`);
    }

    for (const themeKey of themeType.themeKeys) {

      if (theme[themeKey] && theme[themeKey] != themeType.types[themeKey]) {
        throw new ForgekitError(Component, `Theme key "${themeKey}" was defined at "${featureName}" and "${themeDebugInformation[themeKey]}" with different propType`);
      }

      isThemeExists = true;
      theme[themeKey] = themeType.types[themeKey];

      if (defaultValue[themeKey]) {
        isThemeDefaultsExists = true;
        themeDefaults[themeKey] = defaultValue[themeKey];
      }

      themeDebugInformation[themeKey] = featureName;
    }
  };

  const iterate = iteratePropsTypes(propParser, {
    theme: themeParsed,
  });

  iterate(Component);
  features.map(iterate);

  if (isThemeExists) {
    Object.assign(propTypes, {
      theme: ThemeProp(theme),
    });

    if (isThemeDefaultsExists) {
      Object.assign(defaultProps, { theme: themeDefaults });
    }
  }

  return { propTypes, defaultProps };
};

export default collectProps;
