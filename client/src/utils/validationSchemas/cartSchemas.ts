import * as yup from 'yup';

const EMAIL_REGEX = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s-()]{7,20}$/;

export const shippingSchema = yup.object({
  name: yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().trim().matches(EMAIL_REGEX, 'Enter a valid email address').required('Email is required'),
  phone: yup.string().trim().matches(PHONE_REGEX, 'Enter a valid phone number').required('Phone number is required'),
  address: yup.string().trim().min(4, 'Address is too short').required('Address is required'),
});

export type ShippingValues = yup.InferType<typeof shippingSchema>;
