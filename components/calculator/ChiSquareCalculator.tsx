"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  chiSquareGoodnessOfFit,
  chiSquareTestOfIndependence,
  type ChiSquareResult,
} from "@/lib/stats/chi-square";

type ChiSquareMode = "goodness-of-fit" | "independence";

const emptyGoodnessValues = {
  observed: "",
  expected: "",
};

export function ChiSquareCalculator() {
  const [mode, setMode] = useState<ChiSquareMode>("goodness-of-fit");
  const [goodnessValues, setGoodnessValues] = useState(emptyGoodnessValues);
  const [tableText, setTableText] = useState("");

  const calculation = useMemo(
    () => calculateActiveResult(mode, goodnessValues, tableText),
    [goodnessValues, mode, tableText],
  );

  function resetCurrentMode() {
    if (mode === "goodness-of-fit") {
      setGoodnessValues(emptyGoodnessValues);
      return;
    }

    setTableText("");
  }

  return (
    <section
      aria-label="Chi-square calculator"
      className="rounded-lg border bg-card p-4 shadow-sm md:p-6"
    >
      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as ChiSquareMode)}
        className="space-y-6"
      >
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:max-w-lg">
          <TabsTrigger value="goodness-of-fit" className="min-h-10">
            Goodness of fit
          </TabsTrigger>
          <TabsTrigger value="independence" className="min-h-10">
            Independence
          </TabsTrigger>
        </TabsList>

        <Separator />

        <TabsContent value="goodness-of-fit" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <CountTextarea
              id="chi-square-observed"
              label="Observed counts"
              value={goodnessValues.observed}
              onChange={(value) =>
                setGoodnessValues((current) => ({
                  ...current,
                  observed: value,
                }))
              }
            />
            <CountTextarea
              id="chi-square-expected"
              label="Expected counts"
              value={goodnessValues.expected}
              onChange={(value) =>
                setGoodnessValues((current) => ({
                  ...current,
                  expected: value,
                }))
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="independence" className="mt-0">
          <CountTextarea
            id="chi-square-table"
            label="Contingency table"
            value={tableText}
            minHeight="min-h-40"
            onChange={setTableText}
          />
        </TabsContent>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetCurrentMode}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset current test
          </Button>
        </div>
      </Tabs>

      <ResultSummary calculation={calculation} />
    </section>
  );
}

function CountTextarea({
  id,
  label,
  value,
  minHeight = "min-h-32",
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  minHeight?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        inputMode="decimal"
        aria-describedby={`${id}-format`}
        className={minHeight}
        onChange={(event) => onChange(event.target.value)}
      />
      <p id={`${id}-format`} className="sr-only">
        Enter numeric counts separated by commas, spaces, tabs, or line breaks.
      </p>
    </div>
  );
}

function ResultSummary({
  calculation,
}: {
  calculation:
    | { status: "empty" }
    | { status: "error"; message: string }
    | { status: "ready"; result: ChiSquareResult };
}) {
  return (
    <div className="mt-6 rounded-lg border bg-muted/35 p-4 md:p-5">
      {calculation.status === "empty" ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Enter categorical counts to calculate the chi-square statistic,
          degrees of freedom, expected counts, and p-value.
        </p>
      ) : null}
      {calculation.status === "error" ? (
        <p className="text-sm leading-6 text-destructive">
          {calculation.message}
        </p>
      ) : null}
      {calculation.status === "ready" ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Method" value={calculation.result.method} />
            <Metric
              label="Chi-square statistic"
              value={formatNumber(calculation.result.statistic)}
            />
            <Metric
              label="Degrees of freedom"
              value={String(calculation.result.degreesOfFreedom)}
            />
            <Metric
              label="P-value"
              value={formatProbability(calculation.result.pValue)}
            />
          </dl>
          <div className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>{interpretResult(calculation.result)}</p>
            <ExpectedCounts result={calculation.result} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}

function ExpectedCounts({ result }: { result: ChiSquareResult }) {
  if (result.kind === "goodness-of-fit") {
    return (
      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full min-w-96 text-left text-xs">
          <thead className="border-b bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Observed</th>
              <th className="px-3 py-2 font-medium">Expected</th>
              <th className="px-3 py-2 font-medium">Contribution</th>
            </tr>
          </thead>
          <tbody>
            {result.cells.map((cell, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="px-3 py-2 text-foreground">{index + 1}</td>
                <td className="px-3 py-2">{formatNumber(cell.observed)}</td>
                <td className="px-3 py-2">{formatNumber(cell.expected)}</td>
                <td className="px-3 py-2">{formatNumber(cell.contribution)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full min-w-96 text-left text-xs">
        <thead className="border-b bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Cell</th>
            {result.cells[0].map((_, columnIndex) => (
              <th key={columnIndex} className="px-3 py-2 font-medium">
                Column {columnIndex + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.cells.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b last:border-b-0">
              <td className="px-3 py-2 font-medium text-foreground">
                Row {rowIndex + 1}
              </td>
              {row.map((cell, columnIndex) => (
                <td key={columnIndex} className="px-3 py-2">
                  {formatNumber(cell.expected)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function calculateActiveResult(
  mode: ChiSquareMode,
  goodnessValues: typeof emptyGoodnessValues,
  tableText: string,
):
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ready"; result: ChiSquareResult } {
  try {
    if (mode === "goodness-of-fit") {
      if (
        goodnessValues.observed.trim() === "" ||
        goodnessValues.expected.trim() === ""
      ) {
        return { status: "empty" };
      }

      return {
        status: "ready",
        result: chiSquareGoodnessOfFit({
          observed: parseVector(goodnessValues.observed, "Observed counts"),
          expected: parseVector(goodnessValues.expected, "Expected counts"),
        }),
      };
    }

    if (tableText.trim() === "") {
      return { status: "empty" };
    }

    return {
      status: "ready",
      result: chiSquareTestOfIndependence({
        observed: parseMatrix(tableText, "Contingency table"),
      }),
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Check each input and try again.",
    };
  }
}

function parseVector(text: string, label: string) {
  const values = text
    .trim()
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map((value) => Number(value));

  if (values.length === 0) {
    throw new Error(`${label} must include at least one count.`);
  }

  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error(`${label} must contain only finite numbers.`);
  }

  return values;
}

function parseMatrix(text: string, label: string) {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => parseVector(row, label));

  if (rows.length === 0) {
    throw new Error(`${label} must include at least one row.`);
  }

  return rows;
}

function formatNumber(value: number) {
  if (
    Math.abs(value) >= 1000 ||
    (Math.abs(value) > 0 && Math.abs(value) < 0.001)
  ) {
    return value.toExponential(3);
  }

  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 4,
  }).format(value);
}

function formatProbability(value: number) {
  if (value > 0 && value < 0.0001) {
    return value.toExponential(3);
  }

  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 4,
  }).format(value);
}

function interpretResult(result: ChiSquareResult) {
  if (result.kind === "goodness-of-fit") {
    return `The statistic sums each category contribution and compares it with a chi-square distribution with ${result.degreesOfFreedom} degrees of freedom. The p-value is ${formatProbability(result.pValue)}.`;
  }

  return `The expected table is calculated from row totals and column totals under independence. The p-value is ${formatProbability(result.pValue)} using ${result.degreesOfFreedom} degrees of freedom.`;
}
