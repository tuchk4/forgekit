import { PropTypes } from 'react';

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

export default clickValue;
