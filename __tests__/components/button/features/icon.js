import React, { PropTypes } from 'react';

const featureIcon = ({
  icon,
  iconPosition,
  children,
  ...props
}) => {
  return {
    ...props,
    children: (
      <div>
        {iconPosition === 'left' ? icon : null}
        {children}
        {iconPosition === 'right' ? icon : null}
      </div>
    )
  }
};

featureIcon.propTypes = {
  icon: PropTypes.string,
  iconPosition: PropTypes.string,
};

featureIcon.defaultProps = {
  iconPosition: 'left'
};

export default featureIcon;
