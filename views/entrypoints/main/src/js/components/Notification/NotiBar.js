import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const NotiBar = (props) => {
  const [isShowed, toggleIsShowed] = useState(true);
  let icoClass, backgroundColor, bgColorClass;
  switch (props.type) {
    case 'success':
      icoClass = 'fas fa-check';
      // backgroundColor = '#4caf50';
      bgColorClass = 'bg-green';
      break;
    case 'error':
      icoClass = 'fas fa-exclamation-triangle';
      // backgroundColor = '#e53935';
      bgColorClass = 'bg-red';
      break;
    case 'chat':
      icoClass = 'far fa-grin-tongue';
      // backgroundColor = '#4caf50';
      bgColorClass = 'bg-cyan';
      break;
    default:
      // case 'alert':
      icoClass = 'fas fa-exclamation-circle';
      // backgroundColor = '#59a5e8';
      bgColorClass = 'bg-primary';
      break;
  }
  let animationDuration;
  if (typeof props.displayTimeDuration === 'number') {
    animationDuration = props.displayTimeDuration / 1000 + 's';
  }

  const handleNotibarClose = (e) => {
    toggleIsShowed(false);
  };

  const notiBarStyle = {
    backgroundColor,
  };
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
