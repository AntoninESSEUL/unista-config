import { appState, hydrateAppState, serializeAppState } from "./state";
import { equipmentStores, pageStores } from "./stores";

export {
  appState,
  architectureLimits,
  cfr21SettingsState,
  counterGroups,
  faultTypes,
  generalConfigState,
  hydrateAppState,
  messageBoxes,
  permissionMatrixState,
  replaceAppState,
  rolesState,
  serializeAppState,
  translationsState,
  type ArchitectureLimit,
  type FaultType,
  type TranslationRow,
} from "./state";

export {
  activeCycleButtons,
  activeProcessButtons,
  addModuleAction,
  createEquipmentStore,
  equipmentCategories,
  equipmentStores,
  faultGroups,
  getModuleErrorMessage,
  getModuleErrors,
  initEquipmentStores,
  initPageStores,
  modules,
  pageStores,
  processCategories,
  removeModule,
  safetyCategories,
  syncModuleIndexes,
} from "./stores";

export { equipmentFieldSections, equipmentRegistry, initRegistries, pageRegistry } from "./registry";

// Removed CalculationService and ExportService to fix the build error
export { GenerationService, PersistenceService } from "./wails";

export { toast } from "../composables/useToast";
export { countActive } from "./helpers";

export function useConfigStore() {
  return {
    state: appState,
    equipment: equipmentStores,
    pages: pageStores,
    serialize: serializeAppState,
    hydrate: hydrateAppState,
  };
}
