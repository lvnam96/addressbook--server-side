import React from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import SelectInput from './SelectInput';
import TextInput from './TextInput';
import { randomUUID } from '../../../helpers/utilsHelper';
import { extractCallingCode } from '../../../helpers/phoneHelper';

class PhoneInput extends React.Component {
  // phone = {
  //   id: string,
  //   callingCode: string,
  //   phoneNumb: string,
  // };
  static get propTypes () {
    return {
      phone: PropTypes.object.isRequired,
      props: PropTypes.object,
      countries: PropTypes.array.isRequired,
    };
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.phone !== this.props.phone || nextProps.countries !== this.props.countries) return true;
    return false;
  }

  render () {
    const { phone, props, countries } = this.props;
    const callingCodeNumb = extractCallingCode(phone.callingCode).numb;
    // const defaultCallingCode = adbk.extAPI.geolocation.country_code2 + '-' + adbk.extAPI.geolocation.calling_code.substr(1);
    return (
      <div className="input-group">
        {Array.isArray(countries) && countries.length > 0 && (
          <>
            <SelectInput
              name={`callingCode${phone.id}`}
              value={phone.callingCode} // value={_isEmpty(phone.callingCode) ? defaultCallingCode : phone.callingCode}
              onChange={(e) => {
                const newPhone = {
                  ...props.values.phone,
                  callingCode: e.currentTarget.value,
                };
                props.setFieldValue('phone', newPhone, true);
              }}
              onBlur={props.handleBlur}
              className="form-control form__input-field"
              style={{
                flex: '0 0 auto',
                width: 'auto',
              }}>
              {countries.map((country) => {
                const val = country.alpha2Code + '-' + country.phoneNumbPrefix;
                return (
                  <option
                    key={randomUUID()}
                    value={val}
                    title={country.name}
                    className="form__select-field__country-options">
                    {` ${country.alpha2Code} (+${country.phoneNumbPrefix})`}
                  </option>
                );
              })}
            </SelectInput>
            {/* <Select
              value={values.callingCode}
              onChange={handleChange}
              onBlur={handleBlur}
              options={props.countries}
              getOptionValue={(options) => options.phoneNumbPrefix}
              getOptionLabel={(options) => options.phoneNumbPrefix}
            /> */}
          </>
        )}
        <TextInput
          type="text"
          id="inputs__phone"
          name={`phoneNumb${phone.id}`}
          value={(callingCodeNumb ? '+' + callingCodeNumb : '') + phone.phoneNumb}
          onChange={(e) => {
            const newPhone = {
              ...props.values.phone,
              phoneNumb: e.currentTarget.value.substr(callingCodeNumb.length + 1),
            };

            props.setFieldValue('phone', newPhone, true);
          }}
          onBlur={props.handleBlur}
          // addFilledClass={props.addFilledClass}
          // checkInputFilled={props.checkInputFilled}
          className="form-control form__input-field"
        />
      </div>
    );
  }
}

export default PhoneInput;
