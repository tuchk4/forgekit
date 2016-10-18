import React, { PropTypes } from 'react';

const Button = ({
  children,
  ...props
}) => {
  return <button {...props}>{children}</button>;
};

Button.propTypes = {
  disabled: PropTypes.bool
};

Button.defaultProps = {
  disabled: false
};

export default Button;
