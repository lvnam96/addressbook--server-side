import React from 'react';
import PropTypes from 'prop-types';

import SketchColorPicker from '../SketchColorPicker.jsx';
import InputFeedback from './InputFeedback.jsx';
import TextInput from './TextInput.jsx';

class ColorField extends React.PureComponent {
  render() {
    // const inputProps = { ...this.props };
    // delete inputProps.children;
    // delete inputProps.msg;
    const selectedRGBA = `rgba(${this.props.color.r}, ${this.props.color.g}, ${this.props.color.b}, ${this.props.color.a})`;
    return (
      <>
        <div className="form-group">
          {this.props.children}
          <SketchColorPicker icon={this.props.icon} color={this.props.color} changeColor={this.props.changeColor}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label
                  className="input-group-text"
                  htmlFor="inputGroupSelect01"
                  style={{
                    borderColor: selectedRGBA,
                    backgroundColor: selectedRGBA,
                  }}>
                  {this.props.icon}
                </label>
              </div>
              <TextInput type="text" disabled value={selectedRGBA} className="form-control form__input-field" />
            </div>
          </SketchColorPicker>
          {this.props.msg && <InputFeedback msg={this.props.msg} color="pink" />}
        </div>
      </>
    );
  }
}

ColorField.propTypes = {
  color: PropTypes.shape({
    r: PropTypes.number.isRequired,
    g: PropTypes.number.isRequired,
    b: PropTypes.number.isRequired,
    a: PropTypes.number.isRequired,
  }).isRequired, // label element
  icon: PropTypes.element,
  changeColor: PropTypes.func.isRequired,
  children: PropTypes.element, // label element
  msg: PropTypes.string,
};
// ColorField.defaultProps = {};

export default ColorField;
