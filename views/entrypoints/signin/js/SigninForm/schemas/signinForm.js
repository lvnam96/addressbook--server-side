import * as Yup from 'yup';

export default (values) => {
  return Yup.object()
    .shape({
      uname: Yup.string()
        .trim()
        .lowercase()
        .label('Username')
        .min(2)
        .max(50)
        .required(),
      passwd: Yup.string()
        .label('Password')
        .required(),
    })
    .required();
};
