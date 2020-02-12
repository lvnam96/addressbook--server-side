import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

import { formatContactName } from '../../../helpers/utilsHelper';
import { fixedEncodeURIComponent, fixedEncodeURI } from '../../../helpers/encodeHelper';
import { yup as yupHelper } from '../../../helpers/packageHelper';
import getContactSchema from '../schemas/contactSchema';

import CForm from '../Form.jsx';

const WrappedForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const values = { ...props.contact.toJSON() };
    values.birth = props.contact.birth; // Date objects will be convert to String after the above line
    values.labels = values.labels ? Array.from(values.labels) : adbk.sampleData.emptyArr; // convert Set object to Array
    return values;
  },
  validate: (values, props) => {
    const copyVal = { ...values };
    const contactSchema = getContactSchema(copyVal);

    // copyVal.phones =
    //   !_isEmpty(copyVal.phones) && Array.isArray(copyVal.phones)
    //     ? copyVal.phones.map((phone) => phone.replace(spacePtrn, ''))
    //     : [];
    copyVal.birth = copyVal.birth ? new Date(copyVal.birth) : null;
    copyVal.name = formatContactName(copyVal.name);

    try {
      contactSchema.validateSync(copyVal, { abortEarly: false });
      return adbk.sampleData.emptyObj;
    } catch (err) {
      adbk.status.isDev && adbk.logErrorToConsole('SHITTTTT!!!! Error in form validation!', err);
      return yupHelper.getErrorsFromValidationError(err);
    }
  },
  handleSubmit: (values, { props, setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    resetForm();

    const copyVal = (function prepareContactData(val) {
      val.labels.forEach((label) => {
        if (label.__isNew__) {
          label.value = label.value
            .toLocaleLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, ' ')
            .trim()
            .replace(/\s/gi, '-');
          label.isNew = true;
          delete label.__isNew__;
        }
        return label;
      });
      val.name = formatContactName(val.name);
      return val;
    })({ ...values });

    const contactSchema = getContactSchema(copyVal);
    let err;
    try {
      contactSchema.validateSync(copyVal, { abortEarly: false });
      err = adbk.sampleData.emptyObj;
    } catch (e) {
      err = e;
    }

    if (!_isEmpty(err)) {
      setErrors(err);
    } else {
      return props.onSave(copyVal).then(() => {
        setSubmitting(false);
        // props.handleClose();
        return null;
      });
    }
  },
  displayName: 'ContactFormFomikWrapper',
})(CForm);

class CFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
  }

  static get propTypes() {
    return {
      isOpenInPopup: PropTypes.bool,
      handleClose: PropTypes.func,
      title: PropTypes.string.isRequired,
      contact: PropTypes.instanceOf(adbk.classes.Contact),
    };
  }

  static get defaultProps() {
    const defaultContact = adbk.classes.Contact.fromScratch();
    defaultContact.phone.callingCode = _isEmpty(_get(adbk, 'extAPI.geolocation'))
      ? 'VN-84'
      : adbk.extAPI.geolocation.country_code2 + '-' + adbk.extAPI.geolocation.calling_code.substr(1);

    return {
      isOpenInPopup: false,
      contact: defaultContact,
    };
  }

  handleSave(values) {
    // eslint-disable-next-line promise/always-return
    return adbk.handleSaveContactForm(values).then(() => {
      this.props.handleClose();
    });
  }

  render() {
    return (
      <div className="form-container">
        <WrappedForm {...this.props} onSave={this.handleSave} />
      </div>
    );
  }
}

export default CFormContainer;
