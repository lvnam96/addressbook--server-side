import object from 'yup/lib/object';
import string from 'yup/lib/string';

export default (values) => {
  return object()
    .shape({
      uname: string()
        .trim()
        .lowercase()
        .label('Username')
        .min(2)
        .max(50)
        .required(),
      passwd: string()
        .label('Password')
        .required(),
    })
    .required();
};
