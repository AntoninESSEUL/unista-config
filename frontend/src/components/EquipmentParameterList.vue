<template>
  <div class="flex flex-col gap-1.5 mt-1">
    <div
      v-for="p in filteredParameters"
      :key="p.id"
      :class="[
        'flex items-center justify-between px-2 py-1.5 rounded-md border text-sm font-medium transition-all',
        getParamErrorMessage(p) !== null
          ? 'bg-red-50 border-red-300 text-red-700'
          : p.actif
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100',
      ]"
    >
      <span
        class="truncate flex-1 cursor-pointer py-0.5 flex items-center gap-1.5"
        :title="getParamErrorMessage(p) || p.name"
        @click="$emit('open-sidebar', p)"
      >
        <span
          v-if="getParamErrorMessage(p) !== null"
          class="inline-flex shrink-0 w-1.5 h-1.5 rounded-full bg-red-500"
        />
        {{ p.name }}
      </span>
      <label class="relative inline-flex items-center cursor-pointer ml-2 shrink-0" @click.stop>
        <input type="checkbox" v-model="p.actif" class="sr-only peer" />
        <div
          class="w-7 h-4 bg-gray-300 rounded-full peer peer-focus:outline-none peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { models } from "../../wailsjs/go/models";
import type { EquipmentInstance } from "../config/equipment";

const props = defineProps<{
  equipment: EquipmentInstance;
  getParamErrorMessage: (p: models.Parameter) => string | null;
}>();

defineEmits<{
  (e: "open-sidebar", param: models.Parameter): void;
}>();

// Cached computed property: only recalculates if equipment properties actually change.
const filteredParameters = computed(() => {
  let params = (props.equipment.parameters as models.Parameter[]) ?? [];

  if (props.equipment.type === "vacuum" && props.equipment.cmdType === "VacuumOnly") {
    params = params.filter((p) => !p.name.toLowerCase().includes("blow"));
  }

  if (props.equipment.type === "robot" && !props.equipment.trackingActive) {
    const trackingLabels = [
      "Tracking Start 1",
      "Conveyor Tracking Start 1",
      "Tracking Stop 1",
      "Conveyor Tracking Stop 1",
      "Tracking Start 2",
      "Conveyor Tracking Start 2",
      "Tracking Stop 2",
      "Conveyor Tracking Stop 2",
    ];
    params = params.filter((p) => !trackingLabels.includes(p.name));
  }

  if (props.equipment.type === "robot") {
    const hasPalletization =
      props.equipment.palettizationId !== null &&
      props.equipment.palettizationId !== undefined &&
      props.equipment.palettizationId !== 0;

    if (!hasPalletization) {
      params = params.filter((p) => p.name !== "Palletizing Recipe");
    }
  }

  return params;
});
</script>
