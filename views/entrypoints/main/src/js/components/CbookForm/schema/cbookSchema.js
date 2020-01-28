import object from 'yup/lib/object';
import string from 'yup/lib/string';

export default (values) => {
  const cbookValidationSchema = object()
    .shape({
      name: string()
        .trim()
        .min(2, "Contacts book's name must be at least 2 characters")
        .max(40, "Contacts book's name must be at most 30 characters")
        .required('This field is required.'),
      color: string()
        .lowercase()
        .matches(
          /((^hsl|^rgb)a?\(\d{1,3},\s*\d{1,3}%?,\s*\d{1,3}%?(,\s*0?\.?\d{1,3})?\)$)|^#([0-9a-z]{3}|[0-9a-z]{6}|[0-9a-z]{8}$)/
        ) // https://regex101.com/r/lNHe0G/1/tests
        .required(),
    })
    .required();

  return cbookValidationSchema;
};
