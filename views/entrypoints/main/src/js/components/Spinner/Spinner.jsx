import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Spinner = (props) => (
  <div
    className={classNames('spinner-grow', 'align-self-center', {
      [props.colorClass]: !!props.colorClass,
    })}
    role="status">
    <span className="sr-only">Loading...</span>
  </div>
);

Spinner.propTypes = {
  colorClass: PropTypes.string,
};

Spinner.defaultProps = {
  colorClass: 'text-cyan',
};

export default Spinner;
