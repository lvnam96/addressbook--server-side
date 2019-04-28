import React from 'react';
import PropTypes from 'prop-types';

const NotiBar = props => {
    let icoClass, bgColor;
    switch (props.type) {
        case 'success':
            icoClass = "fas fa-check";
            bgColor = '#4caf50';
        break;
        case 'error':
            icoClass = "fas fa-exclamation-triangle";
            bgColor = '#e53935';
        break;
        default:
            icoClass = "fas fa-exclamation-circle";
            bgColor = '#59a5e8';
        break;
    }

    return (
        <div className='noti-bar' style={{backgroundColor: bgColor}}>
            <div className='noti-bar__ico'>
                <i className={icoClass}></i>
            </div>
            <div className='noti-bar__msg'>
                <span>{props.msg}</span>
            </div>
            <div className='noti-bar__placeholder'>
            </div>
        </div>
    );
}

NotiBar.propTypes = {
    type: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired
};

export default NotiBar;
