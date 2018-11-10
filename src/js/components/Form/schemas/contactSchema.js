import * as yup from 'yup';

export default yup.object().shape({
    name: yup.string().trim().min(5).max(30).required(),
    email: yup.string().lowercase().email().required(),
    labels: yup.array().of(yup.string()).max(3).required(),
    color: yup.string().lowercase().url().required(),
    phone: yup.string().lowercase().url().required(),
    website: yup.string().lowercase().url().required(),
    birth: yup.date().max(new Date(Date.now())).required(),
    note: yup.string().nullable()
}).required();
