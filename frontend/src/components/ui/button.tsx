import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // base: sturdy, sporty, accessible
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md uppercase tracking-wide font-semibold " +
    "transition-transform duration-150 will-change-transform " +
    "focus-visible:outline-none focus-visible:ring-2 ring-brand-yellow " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Ocean-Race CTA: PH yellow with subtle bottom bar accent
        default:
          "bg-brand-yellow text-ink shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 " +
          "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 " +
          "after:bg-ink/40 hover:after:bg-ink/60",

        // Dark “ink” solid (great on light backgrounds)
        inverse:
          "bg-ink text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 " +
          "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 " +
          "after:bg-white/30 hover:after:bg-white/50",

        // Clean outline that adapts to context (good for nav, dark bars)
        outline:
          "border border-current bg-transparent text-current hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0",

        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0",

        ghost:
          "bg-transparent text-current hover:bg-accent/20 hover:text-ink active:translate-y-0",

        link: "text-primary underline underline-offset-4 hover:no-underline",
      },
      size: {
        default: "h-10 px-5 text-[13px] md:text-sm",
        sm: "h-8 px-3 rounded-md text-xs",
        lg: "h-11 px-6 text-sm md:text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default", // yellow CTA by default
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
