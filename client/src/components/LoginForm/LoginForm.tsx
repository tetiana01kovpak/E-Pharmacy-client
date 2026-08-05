import { Formik, Form } from 'formik';
import type { FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import { TextField } from '../ui/TextField/TextField';
import { Button } from '../ui/Button/Button';
import { loginUser } from '../../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginSchema } from '../../utils/validationSchemas/authSchemas';
import type { LoginValues } from '../../utils/validationSchemas/authSchemas';
import styles from './LoginForm.module.css';

const initialValues: LoginValues = { email: '', password: '' };

type LoginFormProps = {
  onSuccess: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector((state) => state.auth.isSubmitting);

  const handleSubmit = async (values: LoginValues, helpers: FormikHelpers<LoginValues>) => {
    const result = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(result)) {
      onSuccess();
    } else {
      toast.error(result.payload ?? 'Login failed');
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
      {({ values, handleChange, handleBlur, touched, errors }) => (
        <Form className={styles.form} noValidate>
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

          <Button type="submit" fullWidth disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? 'Please wait...' : 'Log in'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
