import { ReactNode } from "react";

/** Consistent page gutters + max measure. Generous whitespace by design. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}
