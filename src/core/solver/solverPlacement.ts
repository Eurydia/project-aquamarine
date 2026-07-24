import { tryParseIntClamp } from "~/core/parsing";
import {
  Type$ConfigFormData,
  Type$EditorFormData,
  PlacementData,
  ComputeMode,
} from "~/types/query";

/**
 * @version 2.6.1
 * @description
 * Computes the number of facilities needed to meet the given capacity.
 *
 * Tries to solve every desired product which means some products may be overproduced to match the capacity.
 */
const computeFacilitiesNeededCapacity = (
  config: Type$ConfigFormData,
  capacity: Record<string, string>,
) => {
  const { facility, proliferator, recipe } = config;
  const capacityLookup: Record<string, number> = {};
  for (const [k, capacityFlowrate] of Object.entries(capacity)) {
    capacityLookup[k] = tryParseIntClamp(
      capacityFlowrate,
      0,
      Number.MAX_SAFE_INTEGER,
    );
  }

  if (Object.values(capacityLookup).every((value) => value === 0)) {
    return 0;
  }

  const cyclesPerMinute =
    (60 / recipe.cycleTimeSecond) *
    facility.cycleMultiplier *
    proliferator.cycleMultiplier;

  let result = 0;
  for (const [item, itemProducedPerCycle] of Object.entries(
    recipe.productRecord,
  )) {
    const itemProducedPerMinute =
      itemProducedPerCycle * cyclesPerMinute * proliferator.productMultiplier;
    const currNeeded = capacityLookup[item] / itemProducedPerMinute;
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
  config: Type$ConfigFormData,
  constraint: Record<string, string>,
) => {
  const { facility, recipe, proliferator } = config;

  const constraintLookup: Record<string, number> = {};
  for (const [k, v] of Object.entries(constraint)) {
    constraintLookup[k] = tryParseIntClamp(v, 0, Number.MAX_SAFE_INTEGER);
  }

  if (Object.values(constraintLookup).every((value) => value === 0)) {
    return 0;
  }

  const cyclesPerMinute =
    (60 / recipe.cycleTimeSecond) *
    facility.cycleMultiplier *
    proliferator.cycleMultiplier;

  let result = 0;
  for (const [item, itemConsumedPerCycle] of Object.entries(
    recipe.materialRecord,
  )) {
    const itemConsumedPerMinute = itemConsumedPerCycle * cyclesPerMinute;
    const currNeeded = constraintLookup[item] / itemConsumedPerMinute;
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
const computeFacilitiesPerArray = (config: Type$ConfigFormData) => {
  const { flowrate, facility, recipe, proliferator } = config;

  const flowrateLookup: Record<string, number> = {};
  for (const k in flowrate) {
    flowrateLookup[k] = tryParseIntClamp(
      flowrate[k],
      0,
      Number.MAX_SAFE_INTEGER,
    );
  }

  const cyclesPerMinute =
    (60 / recipe.cycleTimeSecond) *
    facility.cycleMultiplier *
    proliferator.cycleMultiplier;

  let matBottleNeck = 0;
  for (const k in recipe.materialRecord) {
    const itemFlowrate = flowrateLookup[k];
    const currBottleNeck =
      itemFlowrate / (recipe.materialRecord[k] * cyclesPerMinute);
    if (
      (matBottleNeck === 0 && currBottleNeck > 0) ||
      currBottleNeck < matBottleNeck
    ) {
      matBottleNeck = currBottleNeck;
    }
  }

  let prodBottleNeck = 0;
  for (const k in recipe.productRecord) {
    const itemFlowrate = flowrateLookup[k];
    const currBottleNeck =
      itemFlowrate /
      (recipe.productRecord[k] *
        cyclesPerMinute *
        proliferator.productMultiplier);
    if (
      (prodBottleNeck === 0 && currBottleNeck > 0) ||
      currBottleNeck < prodBottleNeck
    ) {
      prodBottleNeck = currBottleNeck;
    }
  }

  return Math.min(matBottleNeck, prodBottleNeck);
};

export const computePlacement = (data: Type$EditorFormData): PlacementData => {
  const facilitiesNeeded =
    data.computeMode === ComputeMode.CONSTRAINT
      ? computeFacilitiesNeededConstraint(data, data.constraint)
      : computeFacilitiesNeededCapacity(data, data.capacity);

  const facilitiesPerArray = computeFacilitiesPerArray(data);

  let arraysNeeded = 0;
  let leftoverFacilities = 0;
  if (facilitiesPerArray > 0) {
    arraysNeeded = Math.floor(facilitiesNeeded / facilitiesPerArray);
    leftoverFacilities = facilitiesNeeded - arraysNeeded * facilitiesPerArray;
  }
  return {
    facilitiesNeeded,
    facilitiesPerArray,
    arraysNeeded,
    leftoverFacilities,
  };
};
