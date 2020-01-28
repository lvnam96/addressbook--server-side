import React from 'react';
import PropTypes from 'prop-types';

class TextInput extends React.PureComponent {
  static get propTypes() {
    return {
      disabled: PropTypes.bool,
      required: PropTypes.bool,
      autoFocus: PropTypes.bool,
      type: PropTypes.string,
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      id: PropTypes.string,
      className: PropTypes.string,
      placeholder: PropTypes.string,
      pattern: PropTypes.string,
      title: PropTypes.string,
    };
  }

  render() {
    const props = { ...this.props };
    delete props.children; // <input/> cannot receive prop `children`
    return <input {...props} id={this.props.id} />;
  }
}
TextInput.defaultProps = {
  type: 'text',
};

export default TextInput;
