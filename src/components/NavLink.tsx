import { Link } from "@tanstack/react-router";
import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<ComponentProps<typeof Link>, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const baseNav =
  "relative inline-flex items-center px-1 py-1 transition-colors duration-200 " +
  // Animated underline indicator using a pseudo-element so we can
  // smoothly transition between routes.
  "after:content-[''] after:absolute after:left-1 after:right-1 after:-bottom-0.5 " +
  "after:h-[2px] after:rounded-full " +
  "after:bg-gradient-to-r after:from-primary after:via-primary-glow after:to-accent " +
  "after:shadow-[0_0_10px_hsl(var(--primary)/0.55)] " +
  "after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out " +
  "hover:after:scale-x-100";

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, ...props }, ref) => {
    return (
      <Link
        ref={ref as never}
        preload="intent"
        {...(props as ComponentProps<typeof Link>)}
        activeProps={{
          className: cn(
            baseNav,
            className,
            "text-foreground after:scale-x-100 drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]",
            activeClassName,
          ),
        }}
        inactiveProps={{
          className: cn(baseNav, className, "text-muted-foreground hover:text-foreground", pendingClassName),
        }}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
