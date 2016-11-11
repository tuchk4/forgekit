import React, { PropTypes } from 'react';
import { ThemeProp } from '../../../lib';
// import { base, style } from './button.css';
//
const Button = ({
  children,
  ...props
}) => <button {...props}>{children}</button>;

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  theme: ThemeProp({
    base: PropTypes.string,
    style: PropTypes.string,
  }),
};

Button.defaultProps = {
  disabled: false,
};

export default Button;
