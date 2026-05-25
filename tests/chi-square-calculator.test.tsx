import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChiSquareCalculator } from "@/components/calculator/ChiSquareCalculator";

describe("ChiSquareCalculator", () => {
  it("renders a goodness-of-fit result after entering counts", () => {
    render(<ChiSquareCalculator />);

    fireEvent.change(screen.getByLabelText("Observed counts"), {
      target: { value: "50, 30, 20" },
    });
    fireEvent.change(screen.getByLabelText("Expected counts"), {
      target: { value: "40, 40, 20" },
    });

    expect(screen.getByText("Chi-square statistic")).toBeTruthy();
    expect(screen.getByText("Degrees of freedom")).toBeTruthy();
    expect(screen.getByText("P-value")).toBeTruthy();
    expect(screen.getByText("0.0821")).toBeTruthy();
  });
});
