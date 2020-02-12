import object from 'yup/lib/object';
import string from 'yup/lib/string';
import array from 'yup/lib/array';
import date from 'yup/lib/date';

export default (values) => {
  const contactValidationSchema = object()
    .shape({
      name: string()
        .label('Name')
        .trim()
        .min(2)
        .max(40)
        .required('This field is required.'),
      labels: array()
        .label('Labels')
        .of(object())
        .nullable(),
      // color: object({
      //   r: Yup
      //     // .cast()
      //     .number()
      //     .min(0)
      //     .max(255),
      //   g: Yup
      //     // .cast()
      //     .number()
      //     .min(0)
      //     .max(255),
      //   b: Yup
      //     // .cast()
      //     .number()
      //     .min(0)
      //     .max(255),
      //   a: Yup
      //     // .cast()
      //     .number()
      //     .min(0)
      //     .max(1),
      // }).required(),
      color: string()
        .label('Color')
        .lowercase()
        .matches(
          /((^hsl|^rgb)a?\(\d{1,3},\s*\d{1,3}%?,\s*\d{1,3}%?(,\s*0?\.?\d{1,3})?\)$)|^#([0-9a-z]{3}|[0-9a-z]{6}|[0-9a-z]{8}$)/
        ) // https://regex101.com/r/lNHe0G/1/tests
        .required(),
      email: string()
        .label('Email')
        .lowercase()
        .email(),
      // phones: array().of(<phone schema below>),
      phone: object().shape({
        id: string(),
        callingCode: string()
          .ensure()
          .matches(/[A-Z]{2}-\d+/g),
        phoneNumb: string()
          .label('Phone number')
          .ensure()
          .lowercase()
          .test('phone-number-validator', 'Not a valid phone number', function(val) {
            return typeof val === 'string' && (val.length === 0 || val.match(/[^\d\s]/gi) === null);
          }),
      }),
      website: string()
        .label('Website')
        .lowercase()
        .url()
        .nullable(),
      birth: date()
        .label('Birthday')
        .max(new Date(), 'Can only select day before today')
        .nullable(),
      note: string()
        .label('Note')
        .ensure()
        .strict()
        .trim('There must not be empty spaces at beginning & end positions')
        .nullable(),
    })
    .required();

  return contactValidationSchema;
};
