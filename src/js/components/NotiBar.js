// import React from 'react';
import PropTypes from 'prop-types';

const NotiBar = props => {
    let icoClass, bgColor;
    switch (props.type) {
    case 'success':
        icoClass = "fa fa-check";
        bgColor = '#4caf50';
    break;
    case 'error':
        icoClass = "fa fa-exclamation-triangle";
        bgColor = '#e53935';
    break;
    default:
        icoClass = "fa fa-exclamation";
        bgColor = '#1E88E5';
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
