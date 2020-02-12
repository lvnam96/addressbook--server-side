import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getCSSColorString } from '../../helpers/utilsHelper';

const LetterAvatar = (props) => {
  const firstLetterElemProps = {
    className: 'letter-avt__first-letter',
    style: {
      backgroundColor: getCSSColorString(props.color),
    },
  };
  if (typeof props.onClick === 'function') {
    firstLetterElemProps.onClick = props.onClick;
    firstLetterElemProps.title = 'Click to choose your preferred color';
    firstLetterElemProps.style.cursor = 'pointer';
  }
  return (
    <div
      className={classNames('letter-avt', {
        [props.className]: props.className.length > 0,
      })}>
      <div {...firstLetterElemProps}>
        <span>{props.firstLetter}</span>
      </div>
    </div>
  );
};

LetterAvatar.propTypes = {
  color: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]).isRequired,
  onClick: PropTypes.func,
  firstLetter: PropTypes.string.isRequired,
  className: PropTypes.string,
};

LetterAvatar.defaultProps = {
  className: '',
};

export default memo(LetterAvatar);
