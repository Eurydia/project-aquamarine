import { getSorter } from "~/assets/get";
import { tryParseIntClamp } from "~/core/parsing";
import {
  Type$ConfigFormData,
  Type$EditorFormData,
  PowerUsageData,
} from "~/types/query";

/**
 * @version 2.6.1
 * @description
 * Computes the idle power usage of a single facility, including power usage of attached sorters.
 */
const computeIdleUsageMWPerFacility = (data: Type$ConfigFormData) => {
  const { sorter, facility: f } = data;
  let usageMW = 0;
  for (const k in sorter) {
    const s = getSorter(k);
    if (s === undefined) {
      continue;
    }
    const parsedCount = tryParseIntClamp(sorter[k], 0, Number.MAX_SAFE_INTEGER);
    usageMW += parsedCount * s.idleConsumptionMW;
  }
  return f.idleConsumptionMW + usageMW;
};

/**
 * @version 2.6.1
 * @description
 * Computes the work power usage of a single facility, including power usage of attached sorters.
 */
const computeWorkUsageMWPerFacility = (data: Type$ConfigFormData) => {
  const { facility: f, proliferator: p, sorter } = data;
  let usageMW = 0;
  for (const k in sorter) {
    const s = getSorter(k);
    if (s === undefined) {
      continue;
    }
    const parsedCount = tryParseIntClamp(sorter[k], 0, Number.MAX_SAFE_INTEGER);
    usageMW += parsedCount * s.workConsumptionMW;
  }
  const facilityWorkConsumptionMW =
    f.workConsumptionMW * p.workConsumptionMultiplier;

  return facilityWorkConsumptionMW + usageMW;
};

export const computePowerUsage = (
  data: Type$EditorFormData,
): PowerUsageData => {
  const idleUsageMWPerFacility = computeIdleUsageMWPerFacility(data);
  const workUsageMWPerFacility = computeWorkUsageMWPerFacility(data);
  return {
    idleUsageMWPerFacility,
    workUsageMWPerFacility,
  };
};
