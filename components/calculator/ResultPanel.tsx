import type { ReactNode } from "react";

type ResultPanelProps = {
  children?: ReactNode;
};

export function ResultPanel({ children }: ResultPanelProps) {
  return <aside className="rounded-lg border bg-muted/40 p-5">{children}</aside>;
}
