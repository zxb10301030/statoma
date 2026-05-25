import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("renders the Statoma wordmark", () => {
    render(<Header />);

    expect(screen.getAllByText("Statoma").length).toBeGreaterThan(0);
  });
});
