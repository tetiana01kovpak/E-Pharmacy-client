import { Formik, Form } from 'formik';
import type { FormikHelpers } from 'formik';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { TextField } from '../ui/TextField/TextField';
import { Button } from '../ui/Button/Button';
import { registerUser } from '../../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { registerSchema } from '../../utils/validationSchemas/authSchemas';
import type { RegisterValues } from '../../utils/validationSchemas/authSchemas';
import styles from './RegisterForm.module.css';

const initialValues: RegisterValues = { name: '', email: '', phone: '', password: '' };

type RegisterFormProps = {
  submitLabel?: string;
  compact?: boolean;
  onSuccess: () => void;
};

export function RegisterForm({ submitLabel = 'Register', compact = false, onSuccess }: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector((state) => state.auth.isSubmitting);

  const handleSubmit = async (values: RegisterValues, helpers: FormikHelpers<RegisterValues>) => {
    const result = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(result)) {
      onSuccess();
    } else {
      toast.error(result.payload ?? 'Registration failed');
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={registerSchema} onSubmit={handleSubmit}>
      {({ values, handleChange, handleBlur, touched, errors }) => (
        <Form className={styles.form} noValidate>
          <div className={clsx(styles.grid, compact && styles.compact)}>
            <div>
              <TextField
                label="User Name"
                name="name"
                placeholder="User Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name ? errors.name : undefined}
              />
            </div>
            <div>
              <TextField
                label="Email address"
                name="email"
                type="email"
                placeholder="Email address"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
              />
            </div>
            <div>
              <TextField
                label="Phone number"
                name="phone"
                type="tel"
                placeholder="Phone number"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone ? errors.phone : undefined}
              />
            </div>
            <div>
              <TextField
                label="Password"
                name="password"
                type="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : undefined}
              />
            </div>
          </div>

          <Button type="submit" fullWidth disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? 'Please wait...' : submitLabel}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
