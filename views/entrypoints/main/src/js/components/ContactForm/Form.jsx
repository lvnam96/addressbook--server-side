import React from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import Header from './Header.jsx';
import LetterAvatar from './LetterAvatar.jsx';
import TextField from '../form/fields/TextField';
import MultiCreatableSelectField from '../form/fields/MultiCreatableSelectField.jsx';
import InputFeedback from '../form/fields/InputFeedback';
import PhoneInput from '../form/fields/PhoneInput.jsx';
import SliderColorPicker from '../form/SliderColorPicker.jsx';
import { getFirstLetterOf } from '../../helpers/findHelper';
import { convertDateObjToHTMLInputVal } from '../../helpers/timeHelper';
import Footer from './Footer.jsx';

class CForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeColor = this.handleChangeColor.bind(this);
    // this.addNewPhoneInputField = this.addNewPhoneInputField.bind(this);
    this.onChangeBirth = this.onChangeBirth.bind(this);
    this.onClose = this.onClose.bind(this);
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

  onChangeBirth(e) {
    const date = e.target.value.length > 0 ? new Date(e.target.value) : null; // check ../schemas/contactSchema.js
    this.props.setFieldValue('birth', date, true);
  }

  onClose(e) {
    this.props.handleClose();
  }

  handleChangeLabelField(newValue) {
    this.props.setFieldValue('labels', newValue, true);
  }

  render() {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      handleReset,
      // isSubmitting,
      // resetForm,
      // setFieldValue,
    } = this.props; // extract props from Formik
    const firstLetter = getFirstLetterOf(values.name || '');

    return (
      <form onSubmit={handleSubmit} onReset={handleReset} className="cform">
        <Header title={this.props.title} onClose={this.onClose} />
        <main className="cform__body">
          <div className="mb-3 cform__avt-ctnr">
            <SliderColorPicker type="hex" color={values.color} changeColor={this.handleChangeColor}>
              <LetterAvatar color={values.color} firstLetter={firstLetter} className="mb-3" />
            </SliderColorPicker>
          </div>
          <div className="form-row">
            <div className="col-12 col-md-6">
              <TextField
                msg={touched.name && errors.name ? errors.name : ''}
                type="text"
                id="input--name"
                required
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control form__input-field">
                <label className="" htmlFor="input--name">
                  <span className="">Name</span>
                </label>
              </TextField>
            </div>
            <div className="col-12 col-md-6">
              <TextField
                msg={touched.birth && errors.birth ? errors.birth : ''}
                type="date"
                id="input--birth"
                name="birth"
                value={values.birth instanceof Date ? convertDateObjToHTMLInputVal(values.birth) : ''}
                onChange={this.onChangeBirth}
                onBlur={handleBlur}
                className="form-control form__input-field"
                placeholder="yyyy-mm-dd">
                <label className="" htmlFor="input--birth">
                  <span className="">Birth</span>
                </label>
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
              options={[
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
              ]}
              handleChange={this.handleChangeLabelField}
              onBlur={handleBlur}
            />
          </div>
          <div className="form-group">
            <label className="" htmlFor="input--labels">
              <span className="">Phone</span>
            </label>
            <PhoneInput phone={values.phone} props={this.props} countries={this.props.countryCallingCodes} />
            {errors['phone.phoneNumb'] && <InputFeedback msg={errors['phone.phoneNumb']} color="pink" />}
          </div>
          <div className="form-row">
            <div className="col-12 col-md">
              <TextField
                msg={touched.email && errors.email ? errors.email : ''}
                type="email"
                id="input--email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control form__input-field"
                placeholder="hello@garyle.me"
                title="Your URL must start by 'http://'' or 'https://'">
                <label className="" htmlFor="input--email">
                  <span className="">Email</span>
                </label>
              </TextField>
            </div>
            <div className="col-12 col-md">
              <TextField
                msg={touched.website && errors.website ? errors.website : ''}
                type="url"
                id="input--website"
                name="website"
                value={values.website}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control form__input-field"
                placeholder="https://facebook.com/lvnam96"
                title="Your URL must start by 'http://'' or 'https://'">
                <label className="" htmlFor="input--website">
                  <span className="">Website</span>
                </label>
              </TextField>
            </div>
          </div>
          <TextField
            msg={touched.note && errors.note ? errors.note : ''}
            type="text"
            id="input--note"
            name="note"
            value={values.note}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-control form__input-field"
            title="Your URL must start by 'http://'' or 'https://'">
            <label className="" htmlFor="input--note">
              <span className="">Note</span>
            </label>
          </TextField>
        </main>
        <Footer onClose={this.onClose} isSubmitBtnDisabled={!touched && !_isEmpty(errors)} />
      </form>
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
  handleClose: PropTypes.func,
  // Formik's props:
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

CForm.defaultProps = {
  countryCallingCodes: [],
};

export default CForm;
