import React, { useState, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const NotiBar = (props) => {
  const [isShowed, toggleIsShowed] = useState(true);
  let icoClass, bgColorClass;
  switch (props.type) {
    case 'success':
      icoClass = 'fas fa-check';
      bgColorClass = 'bg-green';
      break;
    case 'error':
      icoClass = 'fas fa-exclamation-triangle';
      bgColorClass = 'bg-red';
      break;
    case 'chat':
      icoClass = 'far fa-grin-tongue';
      bgColorClass = 'bg-cyan';
      break;
    case 'alert':
    default:
      icoClass = 'fas fa-exclamation-circle';
      bgColorClass = 'bg-primary';
      break;
  }
  let animationDuration;
  if (typeof props.displayTimeDuration === 'number') {
    animationDuration = props.displayTimeDuration / 1000 + 's';
  }

  const handleNotibarClose = useCallback(
    (e) => {
      toggleIsShowed(false);
    },
    [toggleIsShowed]
  );

  const notiBarStyle = {};
  if (isShowed) {
    notiBarStyle.animationDuration = animationDuration;
  }

  return (
    <div className={classNames('noti-bar', isShowed ? 'show' : 'hide', bgColorClass)} style={notiBarStyle}>
      <div className="row align-items-center">
        <div className="col d-md-flex align-items-center">
          <span className="noti-bar__ico">
            <i className={icoClass} />
          </span>
          <span className="noti-bar__msg">
            <span>{props.msg}</span>
          </span>
        </div>
        <div className="col-auto">
          <button className="btn noti-bar__close-btn" onClick={handleNotibarClose}>
            <i className="fas fa-times-circle" />
          </button>
        </div>
      </div>
    </div>
  );
};

NotiBar.defaultProps = {
  displayTimeDuration: '5s',
  type: 'chat',
};

NotiBar.propTypes = {
  displayTimeDuration: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  type: PropTypes.string,
  msg: PropTypes.string.isRequired,
};

export default memo(NotiBar);
