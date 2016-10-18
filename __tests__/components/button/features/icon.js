const React = require('react');
const PropTypes = React.PropTypes;

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

module.exports = featureIcon;
