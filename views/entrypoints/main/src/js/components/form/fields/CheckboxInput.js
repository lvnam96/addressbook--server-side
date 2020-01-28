import React from 'react';
import PropTypes from 'prop-types';

class CheckboxInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.cboxRef = React.createRef();
  }

  clickRealCbox = () => {
    this.cboxRef.current.click();
  };

  handleKeyPressFakeCbox = (e) => {
    // listen to space key pressed event
    if (e.keyCode === 32) this.clickRealCbox();
  };

  handleClickFakeCbox = (e) => {
    this.clickRealCbox();
  };

  render() {
    const checkboxSize = this.props.size;
    const htmlAttrs = { ...this.props };
    delete htmlAttrs.children; // <input/> cannot receive prop `children`
    // delete htmlAttrs.onClick; // `onClick` handler is not for real checkbox
    delete htmlAttrs.size; // <input/> cannot receive prop `size`
    return (
      <>
        <input
          {...htmlAttrs}
          style={{
            display: 'none',
            ...htmlAttrs.style,
          }}
          type="checkbox"
          ref={this.cboxRef}
        />
        <div
          className="d-inline-block mr-2 rounded-circle"
          onKeyUp={this.handleKeyPressFakeCbox}
          onClick={this.handleClickFakeCbox}
          role="checkbox"
          aria-checked={this.props.checked}
          // aria-label={this.props.title}
          tabIndex={0}
          style={{
            fontSize: checkboxSize,
            width: checkboxSize,
            height: checkboxSize,
            border: '1px solid #666',
            position: 'relative',
            opacity: this.props.disabled ? '.5' : 1,
          }}>
          <i
            className="fas fa-check"
            style={{
              fontSize: '.5em',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: this.props.checked ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(0)',
              transition: 'transform .2s ease-in-out',
            }}
          />
        </div>
      </>
    );
  }
}

CheckboxInput.propTypes = {
  // onClick: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  checked: PropTypes.bool.isRequired,
  defaultChecked: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  className: PropTypes.string,
  size: PropTypes.string,
  title: PropTypes.string,
};

CheckboxInput.defaultProps = {
  size: '1.6rem',
  disabled: false,
};

export default CheckboxInput;
