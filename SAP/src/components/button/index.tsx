import { type ComponentProps } from 'react';

import clsx from 'clsx';

import styles from './styles.module.css';

type ButtonProps = ComponentProps<'button'> & {
    variant?: 'info' | 'error';
};

export function Button({ children, disabled, variant, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={clsx(
                styles.container,
                variant === 'error' && styles.error,
                disabled && styles.disabled,
            )}
        >
            {children}
        </button>
    );
}
