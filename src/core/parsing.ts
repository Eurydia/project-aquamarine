/**
 * @version 2.6.0
 * @description
 * Parses a JSON string, return undefined in case of SyntaxError.
 */
export const tryParse = (jsonString: string): unknown | undefined => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return undefined;
  }
};

/**
 * @version 2.6.0
 * @description
 * Parses a string to an integer and clamps the result inclusively.
 * Returns the minimum value if the string is not a number.
 */
export const tryParseIntClamp = (
  value: string,
  minValue: number,
  maxValue: number,
): number => {
  const p = tryParseInt(value) ?? minValue;
  if (p > maxValue) {
    return maxValue;
  }
  if (p < minValue) {
    return minValue;
  }
  return p;
};

/**
 * @version 2.6.0
 * @description
 * Parses a string to an integer.
 * If the string is invalid, the it returns null.
 */
export const tryParseInt = (value: string): number | null => {
  const p = Number.parseInt(value);
  if (Number.isNaN(p)) {
    return null;
  }
  return p;
};
