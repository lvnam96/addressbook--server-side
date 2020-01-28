import React from 'react';
import PropTypes from 'prop-types';
import SketchPicker from 'react-color/lib/Sketch';
import { getRandomHexColor } from '../../helpers/utilsHelper';

class SketchColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: props.color,
    };
    this.onClickTriggerElem = this.onClickTriggerElem.bind(this);
    this.onClose = this.onClose.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    this.onChangeComplete = this.onChangeComplete.bind(this);
  }

  static get propTypes() {
    return {
      changeColor: PropTypes.func.isRequired,
      color: PropTypes.any,
      children: PropTypes.element.isRequired,
      type: PropTypes.oneOf(['hex', 'rgb', 'hsl', 'hsv']),
      // passed by HOC CustomPicker:
      // hex: PropTypes.string,
      // hsl: PropTypes.object,
      // rgb: PropTypes.object,
      // hsv: PropTypes.object,
      // onChange: PropTypes.func.isRequired,
    };
  }

  static get defaultProps() {
    return {
      color: getRandomHexColor(),
      type: 'hex',
    };
  }

  onClickTriggerElem(e) {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  onClose(e) {
    this.setState({ displayColorPicker: false });
    this.props.changeColor(this.state.color);
    // this.props.onChange(this.state.color);
  }

  onChangeComplete(color, event) {
    this.setState({ color: color[this.props.type] });
    // this.props.changeColor(this.state.color);
  }

  render() {
    const selectedColor =
      typeof this.state.color === 'string'
        ? this.state.color
        : `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`;
    const styles = {
      color: {
        width: '14px',
        height: '14px',
        borderRadius: '2px',
        background: selectedColor,
      },
      colorInputPrepend: {
        borderColor: selectedColor,
        backgroundColor: selectedColor,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    };
    const children = React.cloneElement(this.props.children, {
      onClick: this.onClickTriggerElem,
    });

    return (
      <>
        {children}
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.onClose} />
            <SketchPicker
              color={this.state.color}
              // onChange={this.handleChange}
              onChangeComplete={this.onChangeComplete}
            />
          </div>
        ) : null}
      </>
    );
  }
}

// export default CustomPicker(SketchColorPicker);
export default SketchColorPicker;
