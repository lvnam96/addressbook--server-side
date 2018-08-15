// import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NavBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    static get propTypes() {
        return {
            onClick: PropTypes.func.isRequired,
            onMouseDown: PropTypes.func,
            onMouseUp: PropTypes.func,
            onTouchStart: PropTypes.func,
            onTouchEnd: PropTypes.func,
            icon: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        };
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.label !== this.props.label) {
            return true;
        }
        return false;
    }

    render() {
        if (this.props.isDropdownBtn) {
            return (
                <label htmlFor={this.props.inputId} className={`main-nav__item${(' ' + this.props.moreClass) || ''}`} onClick={this.props.onClick}>
                    <i className={`fa ${this.props.icon}`}></i>
                    <span className="main-nav__item-label">{this.props.label}</span>
                </label>
            );
        }

        return (
            <div className={`main-nav__item${(' ' + this.props.moreClass) || ''}`} onClick={this.props.onClick}
                onMouseDown={this.props.onMouseDown}
                onMouseUp={this.props.onMouseUp}
                onTouchStart={this.props.onTouchStart}
                onTouchEnd={this.props.onTouchEnd}>
                <i className={`fa ${this.props.icon}`}></i>
                <span className="main-nav__item-label">{this.props.label}</span>
            </div>
        );
    }
}

export default NavBtn;
