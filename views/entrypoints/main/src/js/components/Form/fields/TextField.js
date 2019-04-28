import React from 'react';
import PropTypes from 'prop-types';

import TextInput from './TextInput';

class TextField extends React.PureComponent {
    render () {
        return (
            <>
                <TextInput {...this.props} />
                {this.props.children}
            </>
        );
    }
}

TextField.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    handlerChangeInput: PropTypes.func.isRequired,
    addFilledClass: PropTypes.func.isRequired,
    checkInputFilled: PropTypes.func.isRequired,
    required: PropTypes.bool,
    autoFocus: PropTypes.bool,
    id: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    pattern: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.element,
};

export default TextField;
