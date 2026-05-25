import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PValueCalculator } from "@/components/calculator/PValueCalculator";

describe("PValueCalculator", () => {
  it("renders a two-sided z p-value after entering a statistic", () => {
    render(<PValueCalculator />);

    fireEvent.change(screen.getByLabelText("Observed test statistic"), {
      target: { value: "1.96" },
    });

    expect(screen.getByText("Cumulative probability")).toBeTruthy();
    expect(screen.getByText("p-value")).toBeTruthy();
    expect(screen.getAllByText("0.05").length).toBeGreaterThan(0);
  });
});
