import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const NotiBar = props => {
    const [isShowed, toggleIsShowed] = useState(true);
    const animationDuration = props.displayTimeDuration;
    let icoClass, backgroundColor;
    switch (props.type) {
        case 'success':
            icoClass = "fas fa-check";
            backgroundColor = '#4caf50';
        break;
        case 'error':
            icoClass = "fas fa-exclamation-triangle";
            backgroundColor = '#e53935';
        break;
        default:// case 'alert':
            icoClass = "fas fa-exclamation-circle";
            backgroundColor = '#59a5e8';
        break;
    }

    const handleNotibarClose = e => {
        toggleIsShowed(false);
    };

    const notiBarStyle = {
        backgroundColor,
    };
    if (isShowed) {
        notiBarStyle.animationDuration = props.displayTimeDuration;
    }

    return (
        <div className={classnames('noti-bar', (isShowed ? 'show' : 'hide'))} style={notiBarStyle}>
            <div className="row align-items-center">
                <div className="col">
                    <span className="noti-bar__ico">
                        <i className={icoClass}></i>
                    </span>
                    <span className="noti-bar__msg">
                        <span>{props.msg}</span>
                    </span>
                </div>
                <div className="col-auto">
                    <button className="btn noti-bar__close-btn" onClick={handleNotibarClose}><i className="fas fa-times-circle"></i></button>
                </div>
            </div>
        </div>
    );
}

NotiBar.defaultProps = {
    displayTimeDuration: '3s',
};

NotiBar.propTypes = {
    displayTimeDuration: PropTypes.string,
    type: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired
};

export default NotiBar;
