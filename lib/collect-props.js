import warning from 'warning';
import ThemeProp from './theme-prop';

const iteratePropsTypes = (rules, defaultRule) => {
  return (feature) => {
    if (feature.propTypes) {
      for (const propId of Object.keys(feature.propTypes)) {
        const defaultValue = (feature.defaultProps || {})[propId];
        // NOTE: not sure about line below ¯\_(ツ)_/¯
        const name = feature.displayName || feature.name;

        if (rules[propId]) {
          rules[propId](feature.propTypes[propId], defaultValue, name);
        } else {
          defaultRule(propId, feature.propTypes[propId], defaultValue, name);
        }
      }
    }
  };
};

const collectProps = (component, features) => {
  const propTypes = {};
  const defaultProps = {};

  const propsDebugInformation = {};
  const themeDebugInformation = {};

  const theme = {};
  const themeDefaults = {};
  // these flags are used to prevent !!Object.kyes(theme).length
  let isThemeExists = false;
  let isThemeDefaultsExists = false;

  const defaultPropRule = (propId, propType, defaultValue, featureName) => {
    warning(
      // {}[propId] equals false -> dont show warning
      // {propId}[propId] equals true -> show warning
      !propTypes[propId],
      `Forge <${component.name}/>: Prop "${propId}" was already defined at "${propsDebugInformation[propId]}" and duplicated at "${featureName}"`
    );

    propTypes[propId] = propType;
    defaultProps[propId] = defaultValue;

    propsDebugInformation[propId] = featureName;
  };

  const themePropRule = (propType, defaultValue = {}, featureName) => {
    if (!propType.themeKeys) {
      throw new Error(`Forge <${component.name}/>: property "theme" should be the ThemeProp type`);
    }

    for (const themeKey of propType.themeKeys) {
      warning(
        !theme[themeKey],
        `Forge <${component.name}/>: Theme key "${themeKey}" was already defined at "${themeDebugInformation[themeKey]}" and duplicated at "${featureName}"`
      );

      isThemeExists = true;
      theme[themeKey] = propType.types[themeKey];

      if (defaultValue[themeKey]) {
        isThemeDefaultsExists = true;
        themeDefaults[themeKey] = defaultValue[themeKey];
      }

      themeDebugInformation[themeKey] = featureName;
    }
  };

  const iterate = iteratePropsTypes({
    theme: themePropRule,
  }, defaultPropRule);

  iterate(component);
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
