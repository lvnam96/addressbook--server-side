import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const InputFeedback = (props) => {
  return (
    <small
      className={classNames(props.className, {
        'text-danger': !props.color,
      })}
      style={{ color: props.color }}>
      {props.children || props.msg}
    </small>
  );
};

InputFeedback.propTypes = {
  className: PropTypes.string,
  msg: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.element,
};

// InputFeedback.defaultProps = {};

export default memo(InputFeedback);
