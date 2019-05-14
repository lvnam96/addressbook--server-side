import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const stopPropagation = e => {
    e.stopPropagation();
};

// This comp receives only single comp as child
const Popup = (props) => {
    let children;
    if (props.children) {
        children = React.Children.only(props.children);
        children = React.cloneElement(children, {
            onClick: stopPropagation,// pointer-events: none; on .popup-dialog doesn't work
        });
    } else {
        throw new Error('<Popup/> requires a single component as its only child');
    }
    if (props.isOpen === undefined || (props.isOpen !== undefined && !!props.isOpen)) {
        return (
            <>
                <div className="popup-backdrop" style={props.backdropStyle}></div>
                <div className="popup" onClick={props.onCloseHandler}>
                    <div className={classNames('popup-dialog', {
                        'popup-dialog--centered': props.isCentered !== undefined ? props.isCentered : true,
                    })}>
                        <div className="popup-content" style={props.contentBoxStyle}>
                            {children}
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return null;
    }
};

Popup.propTypes = {
    contentBoxStyle: PropTypes.object,
    backdropStyle: PropTypes.object,
    children: PropTypes.any.isRequired,
    isOpen: PropTypes.bool,
    onCloseHandler: PropTypes.func.isRequired,
};

export default Popup;
