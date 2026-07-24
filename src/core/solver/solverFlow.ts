import { tryParseIntClamp } from "~/core/parsing";
import {
  Type$ConfigFormData,
  Type$EditorFormData,
  FlowData,
} from "~/types/query";

/**
 * @version 2.6.1
 * @description
 * If the proliferator is set, its usage splits into two entries, which are materials and products.
 */
const computeMaterialPerMinutePerFacility = (
  configFormData: Type$ConfigFormData,
): Record<string, number> => {
  const { facility, recipe, proliferator, proliferatorSprayCount } =
    configFormData;

  const { cycleTimeSecond, materialRecord } = recipe;

  const cycles =
    (60 / cycleTimeSecond) *
    facility.cycleMultiplier *
    proliferator.cycleMultiplier;

  const result: Record<string, number> = {};
  for (const k in materialRecord) {
    result[k] = materialRecord[k] * cycles;
  }

  const sprayCount = tryParseIntClamp(
    proliferatorSprayCount,
    0,
    Number.MAX_SAFE_INTEGER,
  );
  if (sprayCount > 0 && proliferator.sprayCount > 0) {
    let prolifMaterialCost = 0;
    for (const ratio of Object.values(recipe.materialRecord)) {
      prolifMaterialCost += cycles * ratio;
    }

    let prolifProductCost = 0;
    for (const ratio of Object.values(recipe.productRecord)) {
      prolifProductCost += cycles * ratio * proliferator.productMultiplier;
    }

    result[`${proliferator.label} (materials)`] =
      prolifMaterialCost / sprayCount;
    result[`${proliferator.label} (products)`] = prolifProductCost / sprayCount;
  }
  return result;
};

const computeProductionPerMinutePerFacility = (
  configFormData: Type$ConfigFormData,
): Record<string, number> => {
  const { facility: f, recipe: r, proliferator: p } = configFormData;
  const { cycleTimeSecond, productRecord } = r;

  const cyclesPerMinute =
    (60 / cycleTimeSecond) * f.cycleMultiplier * p.cycleMultiplier;

  const result: Record<string, number> = {};
  for (const k in productRecord) {
    result[k] = productRecord[k] * cyclesPerMinute * p.productMultiplier;
  }
  return result;
};

export const computeFlow = (formData: Type$EditorFormData): FlowData => {
  const materialFlowPerMinutePerFacility =
    computeMaterialPerMinutePerFacility(formData);

  const productFlowPerMinutePerFacility =
    computeProductionPerMinutePerFacility(formData);

  return {
    materialFlowPerMinutePerFacility,
    productFlowPerMinutePerFacility,
  };
};
