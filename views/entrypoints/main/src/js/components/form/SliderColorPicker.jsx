import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _isEqual from 'lodash/isEqual';
import SliderPicker from 'react-color/lib/Slider';
import { getRandomHexColor } from '../../helpers/utilsHelper';

class SliderColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: props.color,
      isHideSlider: true,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.children !== this.props.children ||
      nextProps.type !== this.props.type ||
      !_isEqual(nextState, this.state)
    ) {
      return true;
    }
    return false;
  }

  static get propTypes() {
    return {
      onChangeColor: PropTypes.func.isRequired,
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

  handleChangeComplete = (color, event) => {
    this.setState({ color: color[this.props.type] }, () => {
      this.props.onChangeColor(this.state.color); // delayed after onChange called because we only want the last value to avoid updating outer form's data too quickly
    });
  };

  handleChange = (newColor) => {
    this.setState({ color: newColor[this.props.type] });
  };

  togglePicker = (e) => {
    this.setState((prevState) => {
      return {
        isHideSlider: !prevState.isHideSlider,
      };
    });
  };

  render() {
    const children = React.cloneElement(this.props.children, {
      className: classNames(this.props.children.props.className, 'mb-3'),
      onClick: this.togglePicker,
      // color: this.state.color, // can override here to have instantly visual updates on color, but not overiding will avoid continuesly re-render of child element due to continuesly changed "color" prop, because of the way we implement handleChangeComplete() and the fact that the child compoment is receiving "color" prop from outer form's data
    });

    return (
      <>
        {children}
        <div
          className={classNames('color-picker-ctnr', {
            'd-none': this.state.isHideSlider,
          })}>
          <SliderPicker
            color={this.state.color}
            onChange={this.handleChange}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>
        <p
          className={classNames('text-center text-gray font-italic d-lg-none', {
            'd-none': !this.state.isHideSlider,
          })}>
          Click to choose your preferred color
        </p>
      </>
    );
  }
}

// export default CustomPicker(SliderColorPicker);
export default SliderColorPicker;
