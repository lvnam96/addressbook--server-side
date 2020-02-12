import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import { Form } from 'formik';
import memoize from 'memoize-one';

import Header from './Header.jsx';
import LetterAvatar from './LetterAvatar.jsx';
import TextField from '../form/fields/TextField.jsx';
import MultiCreatableSelectField from '../form/fields/MultiCreatableSelectField.jsx';
import InputFeedback from '../form/fields/InputFeedback.jsx';
import PhoneInput from '../form/fields/PhoneInput.jsx';
import SliderColorPicker from '../form/SliderColorPicker.jsx';
import { getFirstLetterOf } from '../../helpers/findHelper';
import { convertDateObjToHTMLInputVal } from '../../helpers/timeHelper';
import Footer from './Footer.jsx';
import FormikErrorMessage from '../form/fields/FormikErrorMessage.jsx';

const memoizedGetFirstLetterOf = memoize(getFirstLetterOf);

const inputProps = {
  name: {
    type: 'text',
    id: 'input--name',
    required: true,
    name: 'name',
    className: 'form__input-field',
  },
  birth: {
    type: 'date',
    id: 'input--birth',
    name: 'birth',
    className: 'form__input-field',
    placeholder: 'yyyy-mm-dd',
  },
  email: {
    type: 'email',
    id: 'input--email',
    name: 'email',
    className: 'form__input-field',
    placeholder: 'hello@garyle.me',
    title: "Your URL must start by 'http://'' or 'https://'",
  },
  website: {
    type: 'url',
    id: 'input--website',
    name: 'website',
    className: 'form__input-field',
    placeholder: 'https://facebook.com/lvnam96',
    title: "Your URL must start by 'http://'' or 'https://'",
  },
  note: {
    type: 'text',
    id: 'input--note',
    name: 'note',
    className: 'form__input-field',
    title: "Your URL must start by 'http://'' or 'https://'",
  },
};
const defaultLabels = [
  {
    label: 'Coworkers',
    value: 'coworkers',
  },
  {
    label: 'Family',
    value: 'family',
  },
  {
    label: 'Friends',
    value: 'friends',
  },
];

class CForm extends Component {
  constructor(props) {
    super(props);

    this.handleChangeColor = this.handleChangeColor.bind(this);
    // this.addNewPhoneInputField = this.addNewPhoneInputField.bind(this);
    this.handleChangeBirth = this.handleChangeBirth.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeLabelField = this.handleChangeLabelField.bind(this);
  }

  handleChangeColor(newColor) {
    this.props.setFieldValue('color', newColor, true);
  }

  // addNewPhoneInputField (e) {
  //   e.stopPropagation();
  //   const { values } = this.props;
  //   this.props.setFieldValue(
  //     'phones',
  //     [
  //       ...values.phones,
  //       {
  //         id: randomUUID(),
  //         callingCode: '',
  //         phoneNumb: '',
  //       },
  //     ],
  //     false // shouldValidate?
  //   );
  // }

  handleChangeBirth(e) {
    const date = e.target.value.length > 0 ? new Date(e.target.value) : null; // check ../schemas/contactSchema.js
    this.props.setFieldValue('birth', date, true);
  }

  handleClose(e) {
    this.props.handleClose();
  }

  handleChangeLabelField(newValue) {
    this.props.setFieldValue('labels', newValue, true);
  }

  shouldComponentUpdate(nextProps) {
    if (
      this.props.isSubmitting !== nextProps.isSubmitting ||
      this.props.countryCallingCodes !== nextProps.countryCallingCodes ||
      this.props.values !== nextProps.values ||
      this.props.touched !== nextProps.touched ||
      this.props.errors !== nextProps.errors
    ) {
      return true;
    }
    return false;
  }

  render() {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      // handleSubmit,
      // handleReset,
      isSubmitting,
      // resetForm,
      setFieldValue,
    } = this.props; // extract props from Formik
    const firstLetter = memoizedGetFirstLetterOf(values.name || '');

    return (
      <Form className="cform">
        <Header title={this.props.title} onClose={this.handleClose} />
        <main className="cform__body">
          <div className="mb-3 cform__avt-ctnr">
            <SliderColorPicker type="hex" color={values.color} onChangeColor={this.handleChangeColor}>
              <LetterAvatar color={values.color} firstLetter={firstLetter} className="mb-3" />
            </SliderColorPicker>
          </div>
          <div className="form-row">
            <div className="col-12 col-md-6">
              <TextField
                inputProps={inputProps.name}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Name"
                labelFor="input--name">
                <FormikErrorMessage name="name" />
              </TextField>
            </div>
            <div className="col-12 col-md-6">
              <TextField
                inputProps={inputProps.birth}
                value={values.birth instanceof Date ? convertDateObjToHTMLInputVal(values.birth) : ''}
                onChange={this.handleChangeBirth}
                onBlur={handleBlur}
                label="Birth"
                labelFor="input--birth">
                <FormikErrorMessage name="birth" />
              </TextField>
            </div>
          </div>
          <div className="form-group">
            <label className="" htmlFor="input--labels">
              <span className="">Labels</span>
            </label>
            <MultiCreatableSelectField
              id="input--labels"
              name="labels"
              defaultValue={values.labels}
              options={defaultLabels}
              onChange={this.handleChangeLabelField}
              onBlur={handleBlur}
            />
          </div>
          <div className="form-group">
            <label className="" htmlFor="input--labels">
              <span className="">Phone</span>
            </label>
            <PhoneInput phone={values.phone} onBlur={handleBlur} setFieldValue={setFieldValue} />
            {/* <FormikErrorMessage name="phone.phoneNumb" /> */}
            {errors['phone.phoneNumb'] && <InputFeedback msg={errors['phone.phoneNumb']} />}
          </div>
          <div className="form-row">
            <div className="col-12 col-md">
              <TextField
                inputProps={inputProps.email}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Email"
                labelFor="input--email">
                <FormikErrorMessage name="email" />
              </TextField>
            </div>
            <div className="col-12 col-md">
              <TextField
                inputProps={inputProps.website}
                value={values.website}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Website"
                labelFor="input--website">
                <FormikErrorMessage name="website" />
              </TextField>
            </div>
          </div>
          <TextField
            inputProps={inputProps.note}
            value={values.note}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Note"
            labelFor="input--note">
            <FormikErrorMessage name="note" />
          </TextField>
        </main>
        <Footer onClose={this.handleClose} isSubmitBtnDisabled={(touched && !_isEmpty(errors)) || isSubmitting} />
      </Form>
    );
  }
}

CForm.propTypes = {
  countryCallingCodes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      phoneNumbPrefix: PropTypes.string,
      flag: PropTypes.string,
      alpha2Code: PropTypes.string,
    })
  ),
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  // Formik's props:
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  // handleReset: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

CForm.defaultProps = {
  countryCallingCodes: [],
};

export default CForm;
