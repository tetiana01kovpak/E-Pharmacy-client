import * as yup from 'yup';

export const addToCartSchema = yup.object({
  productId: yup.string().required(),
  quantity: yup.number().integer().min(1).default(1),
});

export const updateCartSchema = yup.object({
  productId: yup.string().required(),
  quantity: yup.number().integer().min(1).required(),
});

export const checkoutSchema = yup.object({
  shipping: yup
    .object({
      name: yup.string().trim().min(2).required(),
      email: yup.string().trim().lowercase().email().required(),
      phone: yup.string().trim().required(),
      address: yup.string().trim().min(4).required(),
    })
    .required(),
  paymentMethod: yup.string().oneOf(['COD', 'BANK']).required(),
});
