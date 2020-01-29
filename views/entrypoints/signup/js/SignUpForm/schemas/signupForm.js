import object from 'yup/lib/object';
import string from 'yup/lib/string';
import boolean from 'yup/lib/boolean';
const REQUIRE_ERROR_MSG = 'This field is required.';

const emailSchema = string()
  .trim()
  .lowercase()
  .email('Please enter a valid email');
const unameSchema = string()
  .trim()
  .lowercase();

export default (values, checkEmailUsed, checkUnameUsed) => {
  values.useEmailAsUname = typeof values.useEmailAsUname === 'boolean' ? values.useEmailAsUname : false;
  return object()
    .shape({
      useEmailAsUname: boolean().required(REQUIRE_ERROR_MSG),
      email: emailSchema
        .label('Email')
        .notRequired()
        .test('is-email-used', 'There is an account using this email', async (val) => {
          if (await emailSchema.min(5).isValid(val)) {
            const isEmailUsed = await checkEmailUsed(val);

            return !isEmailUsed;
          } else return true;
        })
        .when('useEmailAsUname', {
          is: true,
          then: string().required(),
        }),
      uname: unameSchema
        .label('Username')
        .when('useEmailAsUname', {
          is: false,
          then: string()
            .min(2)
            .max(50)
            .required(),
          otherwise: string().notRequired(),
        })
        .test('is-uname-used', 'There is an account using this username', async (val) => {
          const unameAsEmailSchema = unameSchema.email().min(5);
          const schema = values.useEmailAsUname ? unameAsEmailSchema : unameSchema.min(2).max(50);
          if (await schema.isValid(val)) {
            const isUnamelUsed = await checkUnameUsed(val);

            return !isUnamelUsed;
          } else return true;
        }),
      passwd: string()
        .label('Password')
        .min(6)
        .required(),
      cfPasswd: string()
        .label('Confirm Password')
        .length(values.passwd.length)
        .test('are-passwds-match', 'Confirm Password must matches password', (val) => val === values.passwd)
        .required(),
    })
    .required();
};
