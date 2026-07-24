import { tryParseIntClamp } from "~/core/parsing";
import { ConfigFormData, EditorFormData, PlacementData } from "~/types/query";

/**
 * @version 2.6.1
 * @description
 * Computes the number of facilities needed to meet the given capacity.
 *
 * Tries to solve every desired product which means some products may be overproduced to match the capacity.
 */
const computeFacilitiesNeededCapacity = (
  config: ConfigFormData,
  capacity: Record<string, string>,
) => {
  const { facility, proliferator, recipe } = config;
  const parsed: Record<string, number> = {};
  for (const [k, v] of Object.entries(capacity)) {
    parsed[k] = tryParseIntClamp(v, 0, Number.MAX_SAFE_INTEGER);
  }

  if (Object.values(parsed).every((value) => value === 0)) {
    return 0;
  }

  const cyclesPerMinute =
    (60 / recipe.cycleTimeSecond) *
    facility.cycleMultiplier *
    proliferator.cycleMultiplier;

  let result = 0;
  for (const [k, v] of Object.entries(recipe.productRecord)) {
    const itemFlowrate = v * cyclesPerMinute * proliferator.productMultiplier;
    const currNeeded = parsed[k] / itemFlowrate;
    if (currNeeded > result) {
      result = currNeeded;
    }
  }

  return result;
};

/**
 * @version 2.6.1
 * @description
 * Computes the number of facilities based on the constraint.
 * The result depends on the limiting factor of each recipe.
 */
const computeFacilitiesNeededConstraint = (
  config: ConfigFormData,
  constraint: Record<string, string>,
) => {
  const { facility, recipe, proliferator } = config;

  const parsed: Record<string, number> = {};
  for (const [k, v] of Object.entries(constraint)) {
    parsed[k] = tryParseIntClamp(v, 0, Number.MAX_SAFE_INTEGER);
  }

  if (Object.values(parsed).every((value) => value === 0)) {
    return 0;
  }

  const cyclesPerMinute =
    (60 / recipe.cycleTimeSecond) *
    facility.cycleMultiplier *
    proliferator.cycleMultiplier;

  let result = 0;
  for (const [k, v] of Object.entries(recipe.materialRecord)) {
    const itemFlowrate = v * cyclesPerMinute;
    const currNeeded = parsed[k] / itemFlowrate;
    if ((currNeeded > 0 && result === 0) || currNeeded < result) {
      result = currNeeded;
    }
  }
  return result;
};

/**
 * @version 2.6.1
 * @description
 * Computes how many facilities can be placed in a single array.
 */
const computeFacilitiesPerArray = (config: ConfigFormData) => {
  const { flowrate, facility, recipe, proliferator } = config;

  const parsed: Record<string, number> = {};
  for (const k in flowrate) {
    parsed[k] = tryParseIntClamp(flowrate[k], 0, Number.MAX_SAFE_INTEGER);
  }

  const cyclesPerMinute =
    (60 / recipe.cycleTimeSecond) *
    facility.cycleMultiplier *
    proliferator.cycleMultiplier;

  let matBottleNeck = 0;
  for (const k in recipe.materialRecord) {
    const itemFlowrate = parsed[k];
    const currBottleNeck = itemFlowrate / (parsed[k] * cyclesPerMinute);
    if (
      (matBottleNeck === 0 && currBottleNeck > 0) ||
      currBottleNeck < matBottleNeck
    ) {
      matBottleNeck = currBottleNeck;
    }
  }

  let prodBottleNeck = 0;
  for (const k in recipe.productRecord) {
    const itemFlowrate = parsed[k];
    const currBottleNeck =
      itemFlowrate /
      (parsed[k] * cyclesPerMinute * proliferator.productMultiplier);
    if (
      (prodBottleNeck === 0 && currBottleNeck > 0) ||
      currBottleNeck < prodBottleNeck
    ) {
      prodBottleNeck = currBottleNeck;
    }
  }

  return Math.min(matBottleNeck, prodBottleNeck);
};

export const computePlacement = (data: EditorFormData): PlacementData => {
  let facilitiesNeeded = 0;
  if (data.computeMode === "constraint") {
    facilitiesNeeded = computeFacilitiesNeededConstraint(data, data.constraint);
  } else {
    facilitiesNeeded = computeFacilitiesNeededCapacity(data, data.capacity);
  }
  const facilitiesPerArray = computeFacilitiesPerArray(data);

  let arraysNeeded = 0;
  let leftoverFacilities = 0;
  if (facilitiesPerArray > 0) {
    arraysNeeded = Math.floor(facilitiesNeeded / facilitiesPerArray);
    facilitiesNeeded = facilitiesNeeded - arraysNeeded * facilitiesPerArray;
  }
  return {
    facilitiesNeeded,
    facilitiesPerArray,
    arraysNeeded,
    leftoverFacilities,
  };
};
