import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './TextField.module.css';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, className, ...rest }, ref) => {
    const inputId = id ?? rest.name;

    return (
      <div className={clsx(styles.field, className)}>
        <label htmlFor={inputId} className="visually-hidden">
          {label}
        </label>
        <input
          {...rest}
          ref={ref}
          id={inputId}
          className={clsx(styles.input, error && styles.inputError)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {error && (
          <span id={`${inputId}-error`} className={styles.errorText} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
