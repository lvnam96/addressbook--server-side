import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _debounce from 'lodash/debounce';
import { getCountriesList } from '../../../services/dataService';

import { getRandomHexColor, formatContactName } from '../../../helpers/utilsHelper';
import { fixedEncodeURIComponent, fixedEncodeURI } from '../../../helpers/encodeHelper';
import { yup as yupHelper } from '../../../helpers/packageHelper';
import getContactSchema from '../schemas/contactSchema';
import countries from './countries.json';

import CForm from '../Form.jsx';

const defaultEmptyContact = adbk.classes.Contact.fromScratch();
const spacePtrn = /\s/gi;

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
      console.error('SHITTTTT!!!! Error in form validation!', err);
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
      return props.handleSave(copyVal).then(() => {
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
    this.state = {
      countryCallingCodes: _isEmpty(adbk.extAPI.countryCallingCodes) ? [] : adbk.extAPI.countryCallingCodes,
    };

    this.handleSave = this.handleSave.bind(this);
    this._prepareCountryCodeData = this._prepareCountryCodeData.bind(this);
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
    const defaultContact = defaultEmptyContact;
    defaultContact.phone.callingCode = _isEmpty(_get(adbk, 'extAPI.geolocation'))
      ? 'VN-84'
      : adbk.extAPI.geolocation.country_code2 + '-' + adbk.extAPI.geolocation.calling_code.substr(1);
    defaultContact.color = getRandomHexColor();

    return {
      isOpenInPopup: false,
      contact: defaultContact,
    };
  }

  componentDidMount() {
    if (_isEmpty(this.state.countryCallingCodes)) {
      this.debounced = _debounce(() => {
        // this debounced func is only invoked by flush method (because timeout is Infinity)
        // when the data is fetched && this component is not unmounted,
        // because there is a chance to unmount this component before its data is fetched,
        // we need a way to cancel the then() method of resolved promise
        // (there is no way to cancel a resolved promise in vanilla JS)
        this.setState(
          {
            countryCallingCodes: adbk.extAPI.countryCallingCodes,
          },
          () => {
            delete this.debounced;
          }
        );
      }, Infinity);
      this.debounced();

      this._prepareCountryCodeData()
        .then(() => {
          this.debounced && this.debounced.flush(); // this code is still executed after data is fetched, but the task (setState) will not run
        })
        .catch((err) => {
          this.debounced && this.debounced.cancel();
          console.error(err);
        });
    }
  }

  componentWillUnmount() {
    this.debounced && this.debounced.cancel();
  }

  _prepareCountryCodeData() {
    return getCountriesList().then((res) => {
      if (res.isSuccess) {
        const countryCallingCodes = [];

        if (Array.isArray(res.data)) {
          res.data.forEach((country) => {
            const { name, callingCodes, flag, alpha2Code } = country;
            callingCodes.forEach((code) => {
              if (code) {
                countryCallingCodes.push({
                  name,
                  phoneNumbPrefix: code,
                  flag,
                  alpha2Code,
                });
              }
            });
          });
          adbk.extAPI.countryCallingCodes = countryCallingCodes;
        }
        return countryCallingCodes;
      } else {
        adbk.showNoti('error', res.errMsg);
        throw new Error(res.errMsg);
      }
    });

    // const countryCallingCodes = React.lazy(() => import(/* webpackPreload: true */ 'https://restcountries.eu/rest/v2/all'));
    // adbk.extAPI.countryCallingCodes = countryCallingCodes;
    // this.setState({
    //   countryCallingCodes,
    // });
  }

  handleSave(values) {
    return adbk.handleSaveContactForm(values).then(() => {
      this.props.handleClose();
    });
  }

  render() {
    return (
      <div className="form-container">
        <WrappedForm
          {...this.props}
          handleSave={this.handleSave}
          countryCallingCodes={this.state.countryCallingCodes}
        />
      </div>
    );
  }
}

export default CFormContainer;
