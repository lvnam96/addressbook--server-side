// import React from 'react';
import PropTypes from 'prop-types';

const Input = props => {
    let type;
    switch (props.infoType) {
    case 'birth':
        type = 'date';
    break;
    case 'email':
        type = 'email';
    break;
    case 'name':
    case 'website':
        type = 'text';
    break;
    case 'phone':
    case 'note':
        type = 'number';
    break;
    }

    return (
        <div className={`form-body__input ${props.wrapClass}`}>
            <input type={type} id={props.inputFieldId}
                value={props.phone}
                onChange={props.handlerChangePhone}
                onFocus={props.onFocus}
                onBlur={props.isFilled}
                className="form__input-field" />
            <label htmlFor={props.inputFieldId}><span>Phone</span></label>
        </div>
    );
};

Input.propTypes = {

};

export default Input;
