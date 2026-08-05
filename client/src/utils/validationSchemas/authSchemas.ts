import * as yup from 'yup';

const EMAIL_REGEX = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s-()]{7,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const registerSchema = yup.object({
  name: yup.string().trim().min(2, 'Name must be at least 2 characters').max(40).required('Name is required'),
  email: yup.string().trim().matches(EMAIL_REGEX, 'Enter a valid email address').required('Email is required'),
  phone: yup.string().trim().matches(PHONE_REGEX, 'Enter a valid phone number').required('Phone number is required'),
  password: yup
    .string()
    .matches(PASSWORD_REGEX, 'At least 8 characters, including a letter and a number')
    .required('Password is required'),
});

export const loginSchema = yup.object({
  email: yup.string().trim().matches(EMAIL_REGEX, 'Enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export type RegisterValues = yup.InferType<typeof registerSchema>;
export type LoginValues = yup.InferType<typeof loginSchema>;
