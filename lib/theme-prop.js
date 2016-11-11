import { PropTypes } from 'react';

const ThemeProp = (theme) => {
  const keys = Object.keys(theme);
  const validator = PropTypes.shape(theme);
  validator.themeKeys = keys;
  validator.types = theme;

  return validator;
};

export default ThemeProp;
