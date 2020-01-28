import React from 'react';
import PropTypes from 'prop-types';

import { getRandomHexColor } from '../../helpers/utilsHelper';

class FormAvt extends React.Component {
  constructor (props) {
    super(props);
    this.onClickChangeColor = this.onClickChangeColor.bind(this);
  }

  static get propTypes () {
    return {
      color: PropTypes.string.isRequired,
      handleChangeColor: PropTypes.func.isRequired,
      firstLetter: PropTypes.string.isRequired,
    };
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.color !== this.props.color || nextProps.firstLetter !== this.props.firstLetter) {
      return true;
    }
    return false;
  }

  onClickChangeColor (e) {
    const newColor = getRandomHexColor();
    this.props.handleChangeColor(newColor);
  }

  render () {
    return (
      <div className="form-popup__avt">
        <div
          className="form-popup__avt__first-letter"
          style={{ backgroundColor: this.props.color }}
          title="We have not supported avatar yet! So... choose a random color for this contact!"
          onClick={this.onClickChangeColor}
        >
          {this.props.firstLetter}
        </div>
      </div>
    );
  }
}

export default FormAvt;
