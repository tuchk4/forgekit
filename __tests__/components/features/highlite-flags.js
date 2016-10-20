import { PropTypes } from 'react';

const flagsFeature = ({
  alert,
  warning,
  ...props
}) => {
  let style = {};

  if (alert) {
    style = {
      color: 'red',
    };
  } else if (warning) {
    style = {
      color: 'yellow',
    };
  }

  return {
    ...props,
    style: {
      ...(props.style || {}),
      ...style,
    },
  };
};

flagsFeature.propTypes = {
  alert: PropTypes.bool,
  warning: PropTypes.bool,
};

flagsFeature.defaultProps = {
  alert: false,
  warning: false,
};

export default flagsFeature;
