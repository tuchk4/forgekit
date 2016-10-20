import { PropTypes } from 'react';

const iconFeature = ({
  icon,
  iconPosition,
  children,
  ...props
}) => ({
  ...props,
  children: [
    iconPosition === 'left' ? icon : null,
    children,
    iconPosition === 'right' ? icon : null,
  ],
});

iconFeature.propTypes = {
  icon: PropTypes.string,
  iconPosition: PropTypes.string,
};

iconFeature.defaultProps = {
  iconPosition: 'left',
};

export default iconFeature;
