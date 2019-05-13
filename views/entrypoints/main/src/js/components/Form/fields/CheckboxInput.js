import React from 'react';
import PropTypes from 'prop-types';

class CheckboxInput extends React.PureComponent {
    render () {
        return (
            <>
                <input
                    style={{ display: 'none' }}
                    type="checkbox"
                    checked={this.props.checked}
                    defaultChecked={this.props.defaultChecked}
                    id={this.props.id}
                    required={this.props.required}
                    autoFocus={this.props.autoFocus}
                    onChange={this.props.handlerChangeInput}
                    onFocus={this.props.addFilledClass}
                    onBlur={this.props.checkInputFilled}
                    className={this.props.className}
                    ref={this.props.inputRef}
                />
                <label className="form__cb-box" htmlFor={this.props.id}></label>
            </>
        );
    }
}

CheckboxInput.propTypes = {
    required: PropTypes.bool,
    autoFocus: PropTypes.bool,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    id: PropTypes.string,
    handlerChangeInput: PropTypes.func,
    addFilledClass: PropTypes.func,
    checkInputFilled: PropTypes.func,
    inputRef: PropTypes.object,
    className: PropTypes.string,
};

export default CheckboxInput;
