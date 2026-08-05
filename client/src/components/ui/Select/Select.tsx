import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import styles from './Select.module.css';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, id, className, ...rest }, ref) => {
    const selectId = id ?? rest.name;

    return (
      <div className={clsx(styles.field, className)}>
        <label htmlFor={selectId} className="visually-hidden">
          {label}
        </label>
        <select {...rest} ref={ref} id={selectId} className={styles.select}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={16} className={styles.chevron} />
      </div>
    );
  },
);

Select.displayName = 'Select';
