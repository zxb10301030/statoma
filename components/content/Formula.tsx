import type { ReactNode } from "react";

type FormulaProps = {
  children: ReactNode;
};

export function Formula({ children }: FormulaProps) {
  return <div className="overflow-x-auto rounded-lg border bg-muted/30 p-4">{children}</div>;
}
