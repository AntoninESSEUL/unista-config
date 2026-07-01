import { watch } from "vue";
import { appState, PersistenceService } from "../core";

// Simple debounce: delays execution until calls stop for `delay` ms.
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Starts silent auto-save.
 * Call only AFTER the initial data load has completed, so the first
 * hydration does not trigger a spurious save of a still-empty state.
 */
export function useAutoSave() {
  const debouncedSave = debounce(() => {
    void PersistenceService.saveAll();
  }, 1500);

  return watch(appState, debouncedSave, { deep: true });
}
