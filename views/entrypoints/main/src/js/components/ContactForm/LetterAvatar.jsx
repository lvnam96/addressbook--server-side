import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getCSSColorString } from '../../helpers/utilsHelper';

class LetterAvatar extends React.PureComponent {
  static get propTypes () {
    return {
      color: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]).isRequired,
      onClick: PropTypes.func,
      firstLetter: PropTypes.string.isRequired,
      className: PropTypes.string,
    };
  }

  static get defaultProps () {
    return {
      className: ''
    };
  }

  render () {
    const firstLetterElemProps = {
      className: 'letter-avt__first-letter',
      style: {
        backgroundColor: getCSSColorString(this.props.color),
      }
    };
    if (typeof this.props.onClick === 'function') {
      firstLetterElemProps.onClick = this.props.onClick;
      firstLetterElemProps.title = 'Click to choose your preferred color';
      firstLetterElemProps.style.cursor = 'pointer';
    }
    return (
      <div className={classNames('letter-avt', {
        [this.props.className]: this.props.className.length > 0,
      })}
      >
        <div {...firstLetterElemProps}>
          <span>{this.props.firstLetter}</span>
        </div>
      </div>
    );
  }
}

export default LetterAvatar;
