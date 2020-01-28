import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
// import Select from 'react-select';
// import countryToUnicode from 'country-code-emoji';

import Header from './Header';
import Avt from './Avt';
import TextField from './fields/TextField';
import TextInput from './fields/TextInput';
import SelectInput from './fields/SelectInput';
// import SelectField from './fields/SelectField';
import CheckboxField from './fields/CheckboxField';
import PhoneInput from './fields/PhoneInput';
import { getFirstLetterOf } from '../../helpers/findHelper';
import { randomUUID } from '../../helpers/utilsHelper';

const Form = (props) => {
  const { values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm, contact } = props;
  const firstLetter = getFirstLetterOf(values.name);

  let phoneInputs;
  if (Array.isArray(values.phones) && values.phones.length !== 0) {
    phoneInputs = values.phones.map((phone, index) => {
      return <PhoneInput key={phone.id} phone={phone} index={index} props={props} countries={props.countries} />;
    });
  } else {
    phoneInputs = (
      <PhoneInput
        key={randomUUID()}
        phone={{
          id: randomUUID(),
          phoneNumb: '',
          callingCode: '',
        }}
        index={null}
        props={props}
        countries={props.countries}
      />
    );
  }

  useEffect(() => {
    console.log('Form updated');
  }, [props.values.phones]);

  return (
    <form onSubmit={handleSubmit}>
      <Header title={props.title} handlerCloseBtn={props.closeForm} />
      <div className="form-body">
        <Avt color={contact.color} changeColor={props.changeColor} firstLetter={firstLetter} />
        <div className="form__inputs-container">
          <div className="form-group form__input-container form__input-container--name">
            <label className="form__input-label" htmlFor="inputs__name">
              <span className="form__input-label__text">Name</span>
            </label>
            <TextField
              msg={touched.name && errors.name ? errors.name : ''}
              type="text"
              id="inputs__name"
              required
              autoFocus
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              // addFilledClass={props.addFilledClass}
              // checkInputFilled={props.checkInputFilled}
              className="form-control form__input-field"
            />
          </div>
          <div className="form__cb-container">
            <div className="form__input-container--labels">
              <CheckboxField
                labels={values.labels}
                id="form_cb-family"
                inputRef={props.refCBoxFamily}
                value="family"
                label="Family"
              />
            </div>
            <div className="form__input-container--labels">
              <CheckboxField
                labels={values.labels}
                id="form_cb-coWorker"
                inputRef={props.refCBoxCoWorker}
                value="coWorker"
                label="Co-worker"
              />
            </div>
            <div className="form__input-container--labels">
              <CheckboxField
                labels={values.labels}
                id="form_cb-friends"
                inputRef={props.refCBoxFriend}
                value="friends"
                label="Friends"
              />
            </div>
          </div>
          <div className="form-group form__input-container form__input-container--phone">
            <div className="d-flex justify-content-between">
              <label className="form__input-label" htmlFor="inputs__phone">
                <span className="form__input-label__text">Phone</span>
              </label>
              <span className="pl-3">
                <i className="fas fa-plus" onClick={props.addNewPhoneInputField} />
              </span>
            </div>
            {phoneInputs}
          </div>

          <div className="form-group form__input-container form__input-container--birth">
            <label className="form__input-label" htmlFor="inputs__birth">
              <span className="form__input-label__text">Birth</span>
            </label>
            <TextField
              msg={touched.birth && errors.birth ? errors.birth : ''}
              type="date"
              id="inputs__birth"
              name="birth"
              value={values.birth}
              onChange={handleChange}
              onBlur={handleBlur}
              // addFilledClass={props.addFilledClass}
              // checkInputFilled={props.checkInputFilled}
              className="form-control form__input-field"
            />
          </div>
          <div className="form-group form__input-container form__input-container--email">
            <label className="form__input-label" htmlFor="inputs__email">
              <span className="form__input-label__text">Email</span>
            </label>
            <TextField
              msg={touched.email && errors.email ? errors.email : ''}
              type="email"
              id="inputs__email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              // addFilledClass={props.addFilledClass}
              // checkInputFilled={props.checkInputFilled}
              className="form-control form__input-field"
              placeholder="hello@garyle.me"
            />
          </div>
          <div className="form-group form__input-container form__input-container--website">
            <TextField
              msg={touched.website && errors.website ? errors.website : ''}
              type="url"
              id="inputs__website"
              name="website"
              value={values.website}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control form__input-field"
              pattern="^https?:\/\/\S*"
              placeholder="https://facebook.com/lvnam96"
              title="Website's link should start by 'http://'' or 'https://'">
              <label className="form__input-label" htmlFor="inputs__website">
                <span className="form__input-label__text">Website</span>
              </label>
            </TextField>
          </div>
          <div className="form-group form__input-container form__input-container--note">
            <TextField
              msg={touched.note && errors.note ? errors.note : ''}
              type="text"
              id="inputs__note"
              name="note"
              value={values.note}
              onChange={handleChange}
              onBlur={handleBlur}
              // addFilledClass={props.addFilledClass}
              // checkInputFilled={props.checkInputFilled}
              className="form-control form__input-field">
              <label className="form__input-label" htmlFor="inputs__note">
                <span className="form__input-label__text">Note</span>
              </label>
            </TextField>
          </div>
        </div>
      </div>
      <div className="form-footer">
        <input type="reset" value="Reset" className="form__btn form__btn--reset" onClick={resetForm} />
        <input type="button" value="Cancel" className="form__btn" onClick={props.closeForm} />
        <input
          type="submit"
          value={props.title === 'Edit Contact' ? 'Save' : 'Add'}
          className="form__btn"
          disabled={isSubmitting || !isEmpty(errors)}
        />
      </div>
    </form>
  );
};

Form.propTypes = {
  contact: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    birth: PropTypes.string,
    note: PropTypes.string,
    email: PropTypes.string,
    website: PropTypes.string,
    phones: PropTypes.array,
  }).isRequired,
  title: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired,
  changeColor: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  countries: PropTypes.array,
  addNewPhoneInputField: PropTypes.func.isRequired,
};

Form.defaultProps = {
  countries: [],
};

export default Form;
