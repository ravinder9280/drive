import { CheckIcon } from '@radix-ui/react-icons';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '../lib/utils';

const buttonVariants = cva(
'inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white hover:bg-primary/80 disabled:bg-primary/80',
        success:
          'bg-green-600 text-white hover:bg-green-600/80 disabled:bg-green-600 disabled:text-white',
       destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      },
     size: {
        default: "h-9 px-4 py-2",
        icon: "h-9 w-9",
        lg: "h-10 rounded-md px-8",
        sm: "h-8 rounded-md px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isSuccess?: boolean;
  successText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      loadingText = 'Loading...',
      isSuccess,
      successText = 'Success!',
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    if (isSuccess) {
      return (
        <Comp
          className={cn(
            buttonVariants({ variant: 'success', size, className }),
            'gap-x-2',
          )}
          disabled={props.disabled}
          ref={ref}
        >
          {isLoading ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            <CheckIcon className="size-5" />
          )}
          {successText}
        </Comp>
      );
    }
    if (isLoading) {
      return (
        <Comp
          className={cn(
            buttonVariants({ variant, size, className }),
            'gap-x-2',
          )}
          ref={ref}
          disabled
        >
          <Loader className="size-5 animate-spin " />
          {loadingText}
        </Comp>
      );
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
