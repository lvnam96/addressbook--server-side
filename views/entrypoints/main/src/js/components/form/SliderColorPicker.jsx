import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SliderPicker from 'react-color/lib/Slider';
import { getRandomHexColor } from '../../helpers/utilsHelper';

class SliderColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: props.color,
      isHideSlider: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
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

  handleChangeComplete(color, event) {
    this.setState({ color: color[this.props.type] });
    this.props.changeColor(this.state.color); // delayed for about 200ms after onChange called
  }

  handleChange(newColor) {
    this.setState({ color: newColor[this.props.type] });
  }

  render() {
    // const selectedRGBA =
    //   typeof this.state.color === 'string'
    //     ? this.state.color
    //     : `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`;

    const children = React.cloneElement(this.props.children, {
      className: classNames(this.props.children.props.className, 'mb-3'),
      onClick: (e) => {
        this.setState((prevState) => {
          return {
            isHideSlider: !prevState.isHideSlider,
          };
        });
      },
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
