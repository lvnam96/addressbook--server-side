import React from 'react';
import PropTypes from 'prop-types';

import SelectInput from './SelectInput';
import TextInput from './TextInput.jsx';
import { randomUUID } from '../../../helpers/utilsHelper';
import { extractCallingCode } from '../../../helpers/phoneHelper';
import _isEmpty from 'lodash/isEmpty';
import _debounce from 'lodash/debounce';
import { getCountriesList } from '../../../services/dataService';
import LoadingIndicator from '../../AsyncLoader/LoadingIndicator.jsx';

// helper:
const getCallingCodes = (countries = []) => {
  if (!Array.isArray(countries)) {
    throw new Error('Data should be an array');
  }
  const countryCallingCodes = [];
  countries.forEach((country) => {
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
  return countryCallingCodes;
};
const defaultCallingCodes = getCallingCodes(); // this will be an empty array

class PhoneInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingCodes: _isEmpty(adbk.extAPI.countryCallingCodes) ? defaultCallingCodes : adbk.extAPI.countryCallingCodes,
    };
  }

  static get propTypes() {
    return {
      phone: PropTypes.shape({ id: PropTypes.string, callingCode: PropTypes.string, phoneNumb: PropTypes.string })
        .isRequired, // phone = { id: string, callingCode: string, phoneNumb: string };
      onBlur: PropTypes.func.isRequired,
      setFieldValue: PropTypes.func.isRequired,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.phone !== this.props.phone || nextState.callingCodes !== this.state.callingCodes) return true;
    return false;
  }

  componentDidMount() {
    if (this.state.callingCodes === defaultCallingCodes) {
      this.debouncedUpdateCallingCodes(); // debounced by "infinity" seconds

      this._prepareCountryCodeData()
        .then((callingCodes) => {
          this.debouncedUpdateCallingCodes && this.debouncedUpdateCallingCodes.flush(); // this code is still executed after data is fetched, but the task (setState) will not run
          return callingCodes;
        })
        .catch((err) => {
          this.debouncedUpdateCallingCodes && this.debouncedUpdateCallingCodes.cancel();
          delete this.debouncedUpdateCallingCodes;
          adbk.reportError(err);
        });
    }
  }

  componentWillUnmount() {
    this.debouncedUpdateCallingCodes && this.debouncedUpdateCallingCodes.cancel();
    delete this.debouncedUpdateCallingCodes;
  }

  _prepareCountryCodeData() {
    return getCountriesList()
      .then((res) => {
        if (res.isSuccess) {
          let callingCodes;
          try {
            callingCodes = getCallingCodes(res.data);
          } catch (err) {
            throw new Error('There is an error. Please report to developer. Thank you!');
          }
          adbk.extAPI.countryCallingCodes = callingCodes;

          return callingCodes;
        } else {
          throw new Error(res.errMsg);
        }
      })
      .catch((err) => {
        adbk.showNoti('error', err.message);
        adbk.reportError(err, err.stack);
      });

    // const countryCallingCodes = React.lazy(() => import(/* webpackPreload: true */ 'https://restcountries.eu/rest/v2/all'));
    // adbk.extAPI.countryCallingCodes = countryCallingCodes;
    // this.setState({
    //   countryCallingCodes,
    // });
  }

  debouncedUpdateCallingCodes = _debounce(() => {
    // this debouncedUpdateCallingCodes func is only invoked by its flush method (because timeout is Infinity)
    // when the data is fetched && this component is not unmounted
    // Reason of doing this way:
    // there is a chance to unmount this component before its data is fetched,
    // we need a way to cancel the then() method of resolved promise
    // (there is no way to cancel a resolved promise in vanilla JS)
    this.setState(
      {
        callingCodes: adbk.extAPI.countryCallingCodes,
      },
      () => {
        delete this.debouncedUpdateCallingCodes;
      }
    );
  }, Infinity);

  render() {
    const { phone } = this.props;
    const { callingCodes } = this.state;
    const callingCodeNumb = extractCallingCode(phone.callingCode).numb;
    // const defaultCallingCodes = adbk.extAPI.geolocation.country_code2 + '-' + adbk.extAPI.geolocation.calling_code.substr(1);
    return Array.isArray(callingCodes) && callingCodes.length > 0 ? (
      <div className="input-group">
        <>
          <SelectInput
            name={`callingCode${phone.id}`}
            value={phone.callingCode}
            onChange={(e) => {
              const newPhone = {
                ...phone,
                callingCode: e.currentTarget.value,
              };
              this.props.setFieldValue('phone', newPhone, true);
            }}
            onBlur={this.props.onBlur}
            className="form-control form__input-field"
            style={{
              flex: '0 0 auto',
              width: 'auto',
            }}>
            {callingCodes.map((country) => {
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
        </>
        <TextInput
          type="text"
          id="inputs__phone"
          name={`phoneNumb${phone.id}`}
          value={(callingCodeNumb ? '+' + callingCodeNumb : '') + phone.phoneNumb}
          onChange={(e) => {
            const newPhone = {
              ...phone,
              phoneNumb: e.currentTarget.value.substr(callingCodeNumb.length + 1),
            };

            this.props.setFieldValue('phone', newPhone, true);
          }}
          onBlur={this.props.onBlur}
          className="form-control form__input-field"
        />
      </div>
    ) : (
      <LoadingIndicator />
    );
  }
}

export default PhoneInput;
