import {
  FACILITY_REGISTRY,
  Proliferator,
  PROLIFERATOR_REGISTERY,
  RECIPE_REGISTRY,
  SORTER_REGISTRY,
} from "@eurydos/dsp-item-registry";

export const getFacility = (label: string) => {
  return FACILITY_REGISTRY.get(label);
};

export const getFacilityAll = () => {
  const items = FACILITY_REGISTRY.values();
  return [...items];
};

export const getRecipeWithType = (rType: string) => {
  for (const item of RECIPE_REGISTRY.values()) {
    if (item.recipeType === rType) {
      return item;
    }
  }
};

export const getRecipe = (label: string) => {
  return RECIPE_REGISTRY.get(label);
};

export const getRecipeAll = () => {
  const items = RECIPE_REGISTRY.values();
  return [...items];
};

export const getProliferator = (label: string) => {
  return PROLIFERATOR_REGISTERY.get(label) as Exclude<Proliferator, "mode"> & {
    mode: string;
  };
};
export const getProliferatorAll = () => {
  const items = PROLIFERATOR_REGISTERY.values();
  return [...items];
};

export const getProliferatorWithMode = (mode: string) => {
  for (const item of PROLIFERATOR_REGISTERY.values()) {
    if (item.mode === mode) {
      return item;
    }
  }
};

export const getSorterAll = () => {
  const items = SORTER_REGISTRY.values();
  return [...items];
};

export const getSorter = (label: string) => {
  return SORTER_REGISTRY.get(label);
};
