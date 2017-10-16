import React from 'react';
import PropTypes from 'prop-types';

const NavBtn = props => {
    if (props.isDropdownBtn) {
        return (
            <label htmlFor={props.inputId} className={`main-nav__item${(' ' + props.moreClass) || ''}`} onClick={props.onClick}>
                <i className={`fa ${props.icon}`}></i>
                <span className="main-nav__item-label">{props.label}</span>
            </label>
        );
    }
    
    return (
        <div className={`main-nav__item${(' ' + props.moreClass) || ''}`} onClick={props.onClick}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onTouchStart={props.onTouchStart}
            onTouchEnd={props.onTouchEnd}>
            <i className={`fa ${props.icon}`}></i>
            <span className="main-nav__item-label">{props.label}</span>
        </div>
    );
};

NavBtn.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};

export default NavBtn;