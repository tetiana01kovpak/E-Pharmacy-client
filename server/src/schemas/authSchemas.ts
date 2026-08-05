import * as yup from 'yup';

const EMAIL_REGEX = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s-()]{7,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const registerSchema = yup.object({
  name: yup.string().trim().min(2).max(40).required(),
  email: yup.string().trim().lowercase().matches(EMAIL_REGEX, 'Invalid email format').required(),
  phone: yup.string().trim().matches(PHONE_REGEX, 'Invalid phone number format').required(),
  password: yup
    .string()
    .matches(PASSWORD_REGEX, 'Password must be at least 8 characters and include a letter and a number')
    .required(),
});

export const loginSchema = yup.object({
  email: yup.string().trim().lowercase().matches(EMAIL_REGEX, 'Invalid email format').required(),
  password: yup.string().required(),
});
