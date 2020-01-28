import React from 'react';
import PropTypes from 'prop-types';

class SelectInput extends React.PureComponent {
  render () {
    const htmlAttrs = { ...this.props };
    delete htmlAttrs.children; // <input/> cannot receive prop `children`
    delete htmlAttrs.options; // <input/> cannot receive prop `children`
    return (
      <select {...htmlAttrs} id={this.props.id}>
        {this.props.children}
      </select>
    );
  }
}

SelectInput.propTypes = {
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  // value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  pattern: PropTypes.string,
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    })
  ),
  children: PropTypes.arrayOf(PropTypes.element),
  selectedOption: PropTypes.string,
};

export default SelectInput;
