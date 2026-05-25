import type { ReactNode } from "react";

type CalculatorLayoutProps = {
  children: ReactNode;
};

export function CalculatorLayout({ children }: CalculatorLayoutProps) {
  return <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">{children}</div>;
}
