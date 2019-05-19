import React from 'react';
import PropTypes from 'prop-types';

class TextInput extends React.PureComponent {
  render () {
    return (
      <input
        type={this.props.type}
        value={this.props.value}
        id={this.props.id}
        required={!!this.props.required}
        autoFocus={!!this.props.autoFocus}
        onChange={this.props.handlerChangeInput}
        onFocus={this.props.addFilledClass}
        onBlur={this.props.checkInputFilled}
        className={this.props.className}
        placeholder={this.props.placeholder}
        pattern={this.props.pattern}
        title={this.props.title}
      />
    );
  }
}

TextInput.propTypes = {
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handlerChangeInput: PropTypes.func.isRequired,
  addFilledClass: PropTypes.func,
  checkInputFilled: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  pattern: PropTypes.string,
  title: PropTypes.string,
};

export default TextInput;
