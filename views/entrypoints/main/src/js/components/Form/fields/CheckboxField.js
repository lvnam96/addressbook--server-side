import React from 'react';
import PropTypes from 'prop-types';

import CheckboxInput from './CheckboxInput';
// import ContactFormContext from '../containers/ContactFormContext';

class CheckboxField extends React.PureComponent {
  render () {
    return (
      <>
        <CheckboxInput {...this.props} defaultChecked={!!(this.props.labels.indexOf(this.props.value) > -1)} />
        {this.props.children ? (
          this.props.children
        ) : (
          <label className="form__cb-label" htmlFor={'form_cb-' + this.props.value}>
            {this.props.label}
          </label>
        )}
      </>
    );
  }
}

// CheckboxField.contextType = ContactFormContext;

CheckboxField.propTypes = {
  value: PropTypes.string,
  labels: PropTypes.array.isRequired,
};

export default CheckboxField;
