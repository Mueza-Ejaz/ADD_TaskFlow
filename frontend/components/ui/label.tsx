import React from 'react';
import clsx from 'clsx'; // Using clsx for conditional classes

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  // Add any specific props for your Label component here if needed
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';

export { Label };
