const locale = "en-US";
const significantDigits = 4;
const smallScientificThreshold = 0.0001;
const largeScientificThreshold = 100000;

const significantFormatter = new Intl.NumberFormat(locale, {
  maximumSignificantDigits: significantDigits,
});

const scientificFormatter = new Intl.NumberFormat(locale, {
  maximumSignificantDigits: significantDigits,
  notation: "scientific",
});

const integerFormatter = new Intl.NumberFormat(locale, {
  maximumFractionDigits: 0,
});

const welchDegreesFormatter = new Intl.NumberFormat(locale, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat(locale, {
  maximumFractionDigits: 1,
  style: "percent",
});

function assertFiniteNumber(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

export function formatNumber(value: number) {
  assertFiniteNumber(value, "Value");

  const magnitude = Math.abs(value);

  if (
    magnitude !== 0 &&
    (magnitude < smallScientificThreshold ||
      magnitude >= largeScientificThreshold)
  ) {
    return scientificFormatter.format(value);
  }

  return significantFormatter.format(value);
}

export function formatProbability(value: number) {
  assertFiniteNumber(value, "Probability");

  if (value < 0 || value > 1) {
    throw new Error("Probability must be between 0 and 1.");
  }

  return formatNumber(value);
}

export function formatPValue(value: number) {
  assertFiniteNumber(value, "P-value");

  if (value < 0 || value > 1) {
    throw new Error("P-value must be between 0 and 1.");
  }

  if (value < smallScientificThreshold) {
    return "< 0.0001";
  }

  return formatNumber(value);
}

export function formatInteger(value: number) {
  assertFiniteNumber(value, "Integer value");

  return integerFormatter.format(value);
}

export function formatDegreesOfFreedom(
  value: number,
  options: { welch?: boolean } = {},
) {
  assertFiniteNumber(value, "Degrees of freedom");

  if (options.welch) {
    return welchDegreesFormatter.format(value);
  }

  return integerFormatter.format(value);
}

export function formatPercent(value: number) {
  assertFiniteNumber(value, "Percent value");

  return percentFormatter.format(value);
}
