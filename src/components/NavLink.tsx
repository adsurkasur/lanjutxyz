import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<ComponentProps<typeof Link>, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

function NavLink({ className, href, ...props }: NavLinkCompatProps) {
  return <Link href={href} className={cn(className)} {...props} />;
}

export { NavLink };
