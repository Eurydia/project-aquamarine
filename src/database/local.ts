import { getFacility, getProliferator, getRecipe } from "~/assets/get";
import {
  ComputeMode,
  Type$EditorFormData,
  Schema$EditorFormData,
} from "~/types/query";
const LOCAL_STORAGE_KEY = "EURYDIA_AQUAMARINE_SESSION_KEY";

export const saveLocalEditorData = (data: Type$EditorFormData) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

export const loadLocalEditorFormData = (): Type$EditorFormData => {
  const fallback: Type$EditorFormData = {
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
    computeMode: ComputeMode.CONSTRAINT,
  };

  const savedString = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (savedString === null) {
    return fallback;
  }
  let savedObject: unknown;
  try {
    savedObject = JSON.parse(savedString);
  } catch {
    return fallback;
  }

  return Schema$EditorFormData.catch(fallback).parse(savedObject);
};
