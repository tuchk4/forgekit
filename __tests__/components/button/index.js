import React, { PropTypes } from 'react';

const Button = ({
  children,
  ...props
}) => <button {...props}>{children}</button>;

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  disabled: false,
};

export default Button;
