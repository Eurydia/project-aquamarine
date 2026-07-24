import {
  Facility,
  Proliferator,
  ProliferatorMode,
  Recipe,
} from "@eurydos/dsp-item-registry";
import { useRef, useState } from "react";
import { getProliferatorWithMode, getRecipeWithType } from "~/assets/get";
import { tryParseIntClamp } from "~/core/parsing";
import {
  CAPACITY_KEY,
  COMPUTE_MODE_KEY,
  CONSTRAINT_KEY,
  FACILITY_KEY,
  FLOWRATE_KEY,
  PROLIFERATOR_KEY,
  PROLIFERATOR_SPRAY_COUNT_KEY,
  RECIPE_KEY,
  SORTER_KEY,
  getLocalEditorFormData,
} from "~/database/local";
import { EditorFormData, EditorFormHandlers } from "~/types/query";
import { useRecord } from "./useRecord";

/**
 * @version 2.6.0
 * @description
 * Counts the number of taken ports, skipping the one given.
 *
 * Each value in the record is also clamped to prevent invalid states.
 */
const countRecordValue = (
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

export const useEditorForm = (): [EditorFormData, EditorFormHandlers] => {
  const { current: formData } = useRef(getLocalEditorFormData());

  const [computeMode, setComputeModeChange] = useState(formData.computeMode);
  const handleComputeModeChange = (nextMode: string) => {
    setComputeModeChange(nextMode);
    localStorage.setItem(COMPUTE_MODE_KEY, nextMode);
  };

  const [facility, setFacility] = useState(formData.facility);
  const handleFacilityChange = (nextFacility: Facility) => {
    setFacility(nextFacility);
    localStorage.setItem(FACILITY_KEY, nextFacility.label);
    const nextR = getRecipeWithType(nextFacility.recipeType);
    if (!nextR) {
      console.warn(`Cannot find recipe for ${nextFacility.recipeType}`);
      return;
    }
    handleRecipeChange(nextR);
  };

  const [recipe, setRecipe] = useState(formData.recipe);
  const handleRecipeChange = (nextRecipe: Recipe) => {
    setRecipe(nextRecipe);
    localStorage.setItem(RECIPE_KEY, nextRecipe.label);
    if (
      nextRecipe.speedupOnly &&
      proliferator.mode === ProliferatorMode.EXTRA_PRODUCTS
    ) {
      const nextP = getProliferatorWithMode(
        ProliferatorMode.PRODUCTION_SPEEDUP,
      );
      if (nextP !== undefined) {
        setProliferator(nextP);
      } else {
        console.warn("Cannot find production speedup proliferator");
      }
    }
    const nextFlowrate: Record<string, string> = {};
    const nextConstraint: Record<string, string> = {};
    const nextCapacity: Record<string, string> = {};
    for (const k in nextRecipe.materialRecord) {
      nextConstraint[k] = "";
      nextFlowrate[k] = "";
    }
    for (const k in nextRecipe.productRecord) {
      nextCapacity[k] = "";
      nextFlowrate[k] = "";
    }
    setFlowrate(nextFlowrate);
    setCapacity(nextCapacity);
    setConstraint(nextConstraint);
  };

  const [proliferator, setProliferator] = useState(formData.proliferator);
  const handleProliferatorChange = (nextP: Proliferator) => {
    setProliferator(nextP);
    localStorage.setItem(PROLIFERATOR_KEY, nextP.label);
    handleProliferatorSprayCountChange(nextP.sprayCount.toString());
  };

  const [proliferatorSprayCount, setProliferatorSprayCount] = useState(
    formData.proliferatorSprayCount,
  );
  const handleProliferatorSprayCountChange = (value: string) => {
    setProliferatorSprayCount(value);
    localStorage.setItem(PROLIFERATOR_SPRAY_COUNT_KEY, value);
  };

  const [sorter, updateSorter, setSorter] = useRecord(
    SORTER_KEY,
    formData.sorter,
  );
  const handleSorterChange = (key: string, value: string) => {
    if (value === "") {
      updateSorter(key, value);
      return;
    }
    setSorter((prev) => {
      const next = { ...prev };
      const takenPorts = countRecordValue(key, next, facility.connectionCount);
      const leftover = facility.connectionCount - takenPorts;
      next[key] = leftover.toString();
      return next;
    });
  };

  const [flowrate, updateFlowrate, setFlowrate] = useRecord(
    FLOWRATE_KEY,
    formData.flowrate,
  );
  const handleFlowrateChange = (key: string, value: string) => {
    if (value === "") {
      updateFlowrate(key, value);
      return;
    }

    setFlowrate((prev) => {
      const next = { ...prev };
      const maxFlow = facility.connectionCount * 7200;
      const takenFlow = countRecordValue(key, prev, maxFlow);
      const leftover = maxFlow - takenFlow;
      next[key] = leftover.toString();
      return next;
    });
  };

  const [constraint, handleConstraintUpdate, setConstraint] = useRecord(
    CONSTRAINT_KEY,
    formData.constraint,
  );
  const [capacity, handleCapacityUpdate, setCapacity] = useRecord(
    CAPACITY_KEY,
    formData.capacity,
  );

  const data: EditorFormData = {
    facility,
    flowrate,
    proliferator,
    proliferatorSprayCount,
    recipe,
    sorter,
    capacity,
    computeMode,
    constraint,
  };
  const handlers: EditorFormHandlers = {
    handleConstraintUpdate,
    handleCapacityUpdate,
    handleComputeModeChange,
    handleFacilityChange,
    handleProliferatorChange,
    handleRecipeChange,
    handleSorterChange,
    handleFlowrateChange,
    handleProliferatorSprayCountChange,
  };
  return [data, handlers];
};
