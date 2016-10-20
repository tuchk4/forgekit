import { PropTypes } from 'react';

const clickValueFeature = ({
  clickValue,
  onClick = () => {},
  ...props
}) => ({
  ...props,
  onClick: e => onClick(clickValue, e),
});

clickValueFeature.propTypes = {
  clickValue: PropTypes.any,
  onClick: PropTypes.func,
};

export default clickValueFeature;
