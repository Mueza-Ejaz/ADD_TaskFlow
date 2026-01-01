import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  glassmorphism?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, glassmorphism = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg shadow-lg bg-white dark:bg-gray-800 p-6',
          {
            'backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700': glassmorphism,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export { Card };
