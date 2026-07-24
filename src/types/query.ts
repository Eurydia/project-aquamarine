import z from "zod/v4";
import { Facility, Proliferator, Recipe } from "@eurydos/dsp-item-registry";

const Schema$Facility = z.object({
  label: z.string(),
  cycleMultiplier: z.number(),
  workConsumptionMW: z.number(),
  idleConsumptionMW: z.number(),
  recipeType: z.string(),
  connectionCount: z.number(),
});

const Schema$Recipe = z.object({
  label: z.string(),
  cycleTimeSecond: z.number(),
  recipeType: z.string(),
  speedupOnly: z.boolean(),
  materialRecord: z.record(z.string(), z.number()),
  productRecord: z.record(z.string(), z.number()),
});

const Schema$Proliferator = z.object({
  label: z.string(),
  mode: z.string(),
  workConsumptionMultiplier: z.number(),
  productMultiplier: z.number(),
  cycleMultiplier: z.number(),
  sprayCount: z.number(),
});

export const Schema$ConfigFormData = z.object({
  facility: Schema$Facility,
  recipe: Schema$Recipe,
  proliferator: Schema$Proliferator,
  proliferatorSprayCount: z.string(),
  sorter: z.record(z.string(), z.string()),
  flowrate: z.record(z.string(), z.string()),
});

export type Type$ConfigFormData = z.input<typeof Schema$ConfigFormData>;

type ConfigFormHandlers = {
  handleFacilityChange: (f: Facility) => void;
  handleRecipeChange: (r: Recipe) => void;
  handleProliferatorChange: (p: Proliferator) => void;
  handleProliferatorSprayCountChange: (v: string) => void;
  handleSorterChange: (l: string, v: string) => void;
  handleFlowrateChange: (l: string, v: string) => void;
};

export enum ComputeMode {
  CONSTRAINT = "CONSTRAINT",
  CAPACITY = "CAPACITY",
}

export const Schema$ComputeFormData = z.object({
  computeMode: z.enum(ComputeMode),
  capacity: z.record(
    z.string().trim().normalize().nonempty(),
    z.string().normalize(),
  ),
  constraint: z.record(
    z.string().trim().normalize().nonempty(),
    z.string().normalize(),
  ),
});

export type Type$ComputeFormData = z.input<typeof Schema$ComputeFormData>;

type ComputeFormHandlers = {
  handleComputeModeChange: (next: string) => void;
  handleCapacityUpdate: (k: string, v: string) => void;
  handleConstraintUpdate: (k: string, v: string) => void;
};

export const Schema$EditorFormData = Schema$ConfigFormData.and(
  Schema$ComputeFormData,
);

export type Type$EditorFormData = Type$ComputeFormData & Type$ConfigFormData;
export type EditorFormHandlers = ComputeFormHandlers & ConfigFormHandlers;

export type PlacementData = {
  facilitiesNeeded: number;
  facilitiesPerArray: number;
  leftoverFacilities: number;
  arraysNeeded: number;
};

export type FlowData = {
  materialFlowPerMinutePerFacility: Record<string, number>;
  productFlowPerMinutePerFacility: Record<string, number>;
};

export type PowerUsageData = {
  workUsageMWPerFacility: number;
  idleUsageMWPerFacility: number;
};
