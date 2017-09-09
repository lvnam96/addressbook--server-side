import React from 'react';
import PropTypes from 'prop-types';

const NotiBar = function (props) {
    let ico, bgColor;
    switch (props.type) {
        case 'success':
            ico = (<i className="fa fa-check"></i>);
            bgColor = '#4caf50';
        break;
        case 'error':
            ico = (<i className="fa fa-exclamation-triangle"></i>);
            bgColor = '#e53935';
        break;
        default:
            ico = (<i className="fa fa-exclamation"></i>);
            bgColor = '#1E88E5';
        break;
    }
    return (
        <div className='noti-bar' style={{backgroundColor: bgColor}}>
            <div className='noti-bar__ico'>
                {ico}
            </div>
            <div className='noti-bar__msg'>
                <span>{props.msg}</span>
            </div>
            <div className='noti-bar__placeholder'>
            </div>
        </div>
    );
}

export default NotiBar;
