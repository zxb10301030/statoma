import type { ReactNode } from "react";

type InputPanelProps = {
  children?: ReactNode;
};

export function InputPanel({ children }: InputPanelProps) {
  return <section className="rounded-lg border bg-card p-5">{children}</section>;
}
