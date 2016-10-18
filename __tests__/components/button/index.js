const React = require('react');
const PropTypes = React.PropTypes;

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

module.exports = Button;
