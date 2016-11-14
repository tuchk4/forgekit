const pickComponentTheme = (component, props) => {
  const theme = {};

  if (component.propTypes && component.propTypes.theme && props.theme) {
    for (const themeKey of component.propTypes.theme.themeKeys) {
      if (props.theme[themeKey]) {
        theme[themeKey] = props.theme[themeKey];
      }
    }
  }

  return theme;
};

export default pickComponentTheme;
