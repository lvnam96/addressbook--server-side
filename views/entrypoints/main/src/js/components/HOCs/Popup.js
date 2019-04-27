import React from 'react';
import PropTypes from 'prop-types';

const stopPropagation = e => e.stopPropagation();

const Popup = (props) => {
    const children = React.cloneElement(props.children, {
            onClick: stopPropagation
        });
    return (
        <div className="overlay" onClick={props.onCloseHandler}>
            {children}
        </div>
    );
};

Popup.propTypes = {
    children: PropTypes.element.isRequired,
    onCloseHandler: PropTypes.func.isRequired
};

export default Popup;
