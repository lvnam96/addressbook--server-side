import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import _isEmpty from 'lodash/isEmpty';

// import { getRandomHexColor } from '../../helpers/utilsHelper';
import { yup as yupHelper } from '../../helpers/packageHelper';
import getCbookSchema from './schema/cbookSchema';

import CbookForm from './CbookForm.jsx';

const defaultEmptyCbook = adbk.classes.Cbook.fromScratch();

const WrappedForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const values = { ...props.cbook.toJSON() };
    // delete values.id; // this prop should not be handled, BUT it should be passed because we need to identify what we are doing (create or update?) when submit form
    return values;
  },
  validate: (values, props) => {
    const copyVal = { ...values };
    const cbookSchema = getCbookSchema(copyVal);

    try {
      cbookSchema.validateSync(copyVal, { abortEarly: false });
      return {};
    } catch (err) {
      console.error('SHITTTTT!!!! Error in form validation!', err);
      return yupHelper.getErrorsFromValidationError(err);
    }
  },
  handleSubmit: (values, { props, setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    resetForm();
    const copyVal = { ...values };
    const cbookSchema = getCbookSchema(copyVal);
    const err = (() => {
      try {
        cbookSchema.validateSync(copyVal, { abortEarly: false });
        return {};
      } catch (err) {
        return err;
      }
    })();

    if (!_isEmpty(err)) {
      setErrors(err);
    } else {
      props.handleSave(copyVal);
    }
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  },
  displayName: 'ContactEditingForm',
})(CbookForm);

class CbookFormContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
  }

  static get propTypes() {
    return {
      isInlineForm: PropTypes.bool, // for any comp can be displayed a popup
      isOpenInPopup: PropTypes.bool, // for any comp can be displayed a popup
      cbook: PropTypes.instanceOf(adbk.classes.Cbook).isRequired,
      handleClose: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      cbook: defaultEmptyCbook,
    };
  }

  componentDidMount() {}

  handleSave(values) {
    adbk.handleSaveCbookForm(values).then(() => {
      this.props.handleClose();
    });
  }

  render() {
    return (
      <WrappedForm
        isOpenInPopup={this.props.isOpenInPopup}
        isInlineForm={this.props.isInlineForm}
        title={this.props.title}
        cbook={this.props.cbook}
        handleSave={this.handleSave}
        handleClose={this.props.handleClose}
      />
    );
  }
}

export default CbookFormContainer;
