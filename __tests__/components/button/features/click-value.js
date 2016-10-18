const React = require('react');
const PropTypes = React.PropTypes;

const clickValue = ({
  clickValue,
  onClick = () => {},
  ...props
}) => {
  return {
    ...props,
    onClick: e => onClick(clickValue, e)
  }
};

clickValue.propTypes = {
  clickValue: PropTypes.any,
  onClick: PropTypes.func,
};

module.exports = clickValue;
