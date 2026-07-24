import { ProliferatorMode } from "@eurydos/dsp-item-registry";
import {
  getFacility,
  getProliferator,
  getRecipe,
  getSorterAll,
} from "~/assets/get";
import { tryParse, tryParseInt } from "~/core/parsing";
import { EditorFormData } from "~/types/query";

export const FACILITY_KEY = "facility";
export const RECIPE_KEY = "recipe";
export const PROLIFERATOR_KEY = "proliferator";
export const SORTER_KEY = "sorter";
export const FLOWRATE_KEY = "flowrate";
export const PROLIFERATOR_SPRAY_COUNT_KEY = "proliferatorSprayCount";
export const COMPUTE_MODE_KEY = "computeMode";
export const CONSTRAINT_KEY = "constraint";
export const CAPACITY_KEY = "capacity";

/**
 * @version 2.6.1
 * @description
 * Loads an object from local storage, parses it, sanitizes it, and returns it.
 *
 * The object should be a record whose keys are strings and values are strings.
 * Otherwise, the function returns null.
 */
const getLocalRecord = (key: string): Record<string, string> | null => {
  const jsonString = localStorage.getItem(key);
  if (jsonString === null) {
    return null;
  }
  const jsonObj = tryParse(jsonString);
  if (!jsonObj || typeof jsonObj !== "object") {
    return null;
  }
  // Every key should be a string.
  for (const key in jsonObj) {
    if (typeof key !== "string") {
      return null;
    }
  }
  const obj = jsonObj as Record<string, unknown>;
  // Every value should be a string and pass the validator.
  for (const k in obj) {
    const v = obj[k];
    if (typeof v !== "string") {
      return null;
    }
    if (v !== "" && tryParseInt(v) === null) {
      return null;
    }
  }
  const p = obj as Record<string, string>;
  return p;
};

/**
 * @version 2.6.0
 * @description
 * Loads a string from local storage, performs type-checking, and passes it to the callback function.
 */
const getLocalString = <T>(
  key: string,
  processor: (l: string) => T,
): T | null => {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  return processor(item);
};

/**
 * @version 2.6.1
 * @description
 * Verifies that the has the exact keys as the given array.
 * Returns false if a key is missing or an unexpected key is found.
 */
const verifyRecordKeys = (
  record: Record<string, unknown>,
  keys: string[],
): boolean => {
  for (const k of keys) {
    if (record[k] === undefined) {
      return false;
    }
  }
  for (const k in record) {
    if (!keys.includes(k)) {
      return false;
    }
  }
  return true;
};

/**
 * @version 2.6.0
 * @description
 * Loads the previous session data from local storage, sanitizes it, and returns it.
 *
 * This function does not attempt to recover data, so if the sanitization fails, it returns a predfined fallback object.
 */

export const getLocalEditorFormData = (): EditorFormData => {
  const fallback: EditorFormData = {
    facility: getFacility("Arc Smelter")!,
    recipe: getRecipe("Copper Ingot")!,
    proliferator: getProliferator("None")!,
    proliferatorSprayCount: "12",
    sorter: {
      "Sorter Mk.I": "",
      "Sorter Mk.II": "",
      "Sorter Mk.III": "",
      "Pile Sorter": "",
    },
    flowrate: {
      "Copper Ore": "",
      "Copper Ingot": "",
    },
    capacity: {
      "Copper Ingot": "",
    },
    constraint: {
      "Copper Ore": "",
    },
    computeMode: "0",
  };

  const computeMode = getLocalString(COMPUTE_MODE_KEY, (s) => {
    if (s === "0" || s === "1") {
      return s;
    }
    return null;
  });
  if (!computeMode) {
    return fallback;
  }

  // Everything should based on the saved facility.
  const facility = getLocalString(FACILITY_KEY, getFacility);
  if (!facility) {
    return fallback;
  }

  // The recipe, if it exists, should have the same recipe type as the facility.
  const recipe = getLocalString(RECIPE_KEY, getRecipe);
  if (!recipe) {
    return fallback;
  }
  if (recipe.recipeType !== facility.recipeType) {
    return fallback;
  }

  // The proliferator, if it exists, should be compatible with the recipe.
  const proliferator = getLocalString(PROLIFERATOR_KEY, getProliferator);
  if (!proliferator) {
    return fallback;
  }
  if (
    recipe.speedupOnly &&
    proliferator.mode === ProliferatorMode.EXTRA_PRODUCTS
  ) {
    return fallback;
  }

  // The proliferator spray count, if it exists, should be empty string or a string representing a natural number.
  const proliferatorSprayCount = getLocalString(
    PROLIFERATOR_SPRAY_COUNT_KEY,
    (s) => {
      if (s === "") {
        return "";
      }
      const p = tryParseInt(s);
      if (!p || p < 0) {
        return undefined;
      }
      return p.toString();
    },
  );
  if (!proliferatorSprayCount) {
    return fallback;
  }

  // The sorter, if it exists, should contain sorter labels as keys.
  const sorter = getLocalRecord(SORTER_KEY);
  if (!sorter) {
    return fallback;
  }
  if (
    !verifyRecordKeys(
      sorter,
      getSorterAll().map((s) => s.label),
    )
  ) {
    return fallback;
  }

  // The constraint, if it exists, should match exactly the keys in the recipe's material record.
  const constraint = getLocalRecord(CONSTRAINT_KEY);
  if (!constraint) {
    return fallback;
  }
  if (!verifyRecordKeys(constraint, Object.keys(recipe.materialRecord))) {
    return fallback;
  }

  // The capacity, if it exists, should match exactly the keys in the recipe's product record.
  const capacity = getLocalRecord(CAPACITY_KEY);
  if (!capacity) {
    return fallback;
  }
  if (!verifyRecordKeys(capacity, Object.keys(recipe.productRecord))) {
    return fallback;
  }

  // The flowrate record, if it exists, should match exactly the keys in the recipe's material and product records.
  const flowrate = getLocalRecord(FLOWRATE_KEY);
  if (
    flowrate === null ||
    !verifyRecordKeys(flowrate, [
      ...Object.keys(recipe.materialRecord),
      ...Object.keys(recipe.productRecord),
    ])
  ) {
    return fallback;
  }

  const formData: EditorFormData = {
    facility,
    recipe,
    proliferator,
    proliferatorSprayCount,
    sorter,
    flowrate,
    capacity,
    constraint,
    computeMode,
  };
  return formData;
};
