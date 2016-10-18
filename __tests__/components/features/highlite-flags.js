const React = require('react');
const PropTypes = React.PropTypes;

const featureFlags = ({
  alert,
  warning,
  ...props
}) => {
  let style = {};

  if (alert) {
    style = {
      color: 'red'
    };
  } else if (warning) {
    style = {
      color: 'yellow'
    };
  }

  return {
    ...props,
    style: {
      ...(props.style || {}),
      ...style
    }
  }
};

featureFlags.propTypes = {
  alert: PropTypes.bool,
  warning: PropTypes.bool,
};

featureFlags.defaultProps = {
  alert: false,
  warning: false
};

module.exports = featureFlags;
