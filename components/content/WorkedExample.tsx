import type { ReactNode } from "react";

type WorkedExampleProps = {
  children: ReactNode;
};

export function WorkedExample({ children }: WorkedExampleProps) {
  return <section className="rounded-lg border bg-card p-5">{children}</section>;
}
