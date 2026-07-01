// src/config/equipment.ts — UI types (data lives in Go registry)

import { models } from "../../wailsjs/go/models";

export interface SidebarCapabilities {
  showName: boolean;
  showTranslations: boolean;
  showReserves: boolean;
  showRobot: boolean;
  showRobotVarName?: boolean;
  showResetVisible?: boolean;
  showStepsConfig?: boolean;
  showFaultInfo?: boolean;
}

export interface ConfigField {
  label: string;
  field: string;
  type: "select" | "boolean" | "number" | "text";
  options?: readonly string[];
  defaultValue?: string | number | boolean;
}

export interface EquipmentFieldSection {
  label: string;
  fieldsKey: "configFields" | "controllerFields" | "processFields";
  iconKey?: "configIcon" | "controllerIcon" | "processIcon";
  uiKey: "showConfiguration" | "showController" | "showProcess";
  filterVisible?: boolean;
}

export interface EquipmentDefinition {
  type: string;
  label: string;
  prefix: string;
  hasEmLink: boolean;
  hasParameters?: boolean;
  allowsFastCycle?: boolean;
  customPanel?: "axis";
  menuIcon?: string;
  configIcon?: string;
  configFields: ConfigField[];
  controllerIcon?: string;
  controllerFields?: ConfigField[];
  processIcon?: string;
  processFields?: ConfigField[];
  parameterFields?: ConfigField[];
  configurationFields?: ConfigField[];
  limitsFields?: ConfigField[];
  defaultValuesFields?: ConfigField[];
  reductionFields?: ConfigField[];
  homingFields?: ConfigField[];
  autoTuneFields?: ConfigField[];
  inverterFields?: ConfigField[];

  sidebarCapabilities: SidebarCapabilities;
}

/** Runtime equipment with dynamic config fields injected from the registry. */
export type EquipmentInstance = models.BaseEquipment & {
  // Strictly type the parameters array to inherit backend safety and avoid 'as' casting
  parameters: models.Parameter[];
} & Record<string, unknown>;

export interface PageDefinition {
  type: string;
  label: string;
  prefix: string;
  maxSlots: number;
  menuIcon: string;
}
