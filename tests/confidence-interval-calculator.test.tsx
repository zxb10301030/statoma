import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConfidenceIntervalCalculator } from "@/components/calculator/ConfidenceIntervalCalculator";

describe("ConfidenceIntervalCalculator", () => {
  it("renders a mean interval after entering summary statistics", () => {
    render(<ConfidenceIntervalCalculator />);

    fireEvent.change(screen.getByLabelText("Sample mean"), {
      target: { value: "82.4" },
    });
    fireEvent.change(screen.getByLabelText("Sample standard deviation"), {
      target: { value: "6" },
    });
    fireEvent.change(screen.getByLabelText("Sample size"), {
      target: { value: "36" },
    });

    expect(screen.getByText("Lower bound")).toBeTruthy();
    expect(screen.getByText("Upper bound")).toBeTruthy();
    expect(screen.getByText("80.37")).toBeTruthy();
    expect(screen.getByText("84.43")).toBeTruthy();
  });
});
