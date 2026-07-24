import { tryParseIntClamp } from "./parsing";

export const countRecordValue = (
  key: string,
  record: Record<string, string>,
  total: number,
): number => {
  let count = 0;
  for (const k in record) {
    if (k === key) {
      continue;
    }
    count += tryParseIntClamp(record[k], 0, total - count);
  }
  return count;
};
