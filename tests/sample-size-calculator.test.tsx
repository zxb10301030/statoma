import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SampleSizeCalculator } from "@/components/calculator/SampleSizeCalculator";

describe("SampleSizeCalculator", () => {
  it("renders a survey proportion sample size after entering assumptions", () => {
    render(<SampleSizeCalculator />);

    fireEvent.change(screen.getByLabelText("Estimated proportion"), {
      target: { value: "0.5" },
    });
    fireEvent.change(screen.getByLabelText("Margin of error"), {
      target: { value: "0.05" },
    });

    expect(screen.getByText("Required sample size")).toBeTruthy();
    expect(screen.getByText("385")).toBeTruthy();
  });
});
