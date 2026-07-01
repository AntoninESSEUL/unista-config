// src/composables/useParamSelection.ts
import { computed, ref, type Ref } from "vue";

/**
 * Generic composable to handle multidimensional parameter selection.
 * Automatically adapts to 1D, 2D, 3D, or ND coordinate systems.
 */
export function useParamSelection<TParam, TArgs extends number[]>(
  getParam: (...args: TArgs) => TParam | null,
  options?: { canOpen?: () => boolean; canClose?: () => boolean },
) {
  // Store all indices in a single reactive array
  const args = ref<TArgs | null>(null) as Ref<TArgs | null>;

  const activeParam = computed(() => {
    if (!args.value) return null;
    return getParam(...args.value);
  });

  const open = (...newArgs: TArgs) => {
    if (options?.canOpen && !options.canOpen()) return;
    args.value = newArgs;
  };

  const close = () => {
    if (options?.canClose && !options.canClose()) return;
    args.value = null;
  };

  return { args, activeParam, open, close };
}
