<template>
  <DashboardParameterEditor
    :entities="machineLogicEntities"
    context-label="Machine Logic"
    header-subtitle="Machine Logic"
    :header-title="(e) => String(e.name).toUpperCase()"
    badge-label="Logic"
    badge-class="bg-indigo-100 text-indigo-700"
    width-class="w-[320px]"
    body-class="p-4 flex flex-col gap-4 overflow-y-auto"
    :sections="PARAM_SECTIONS"
    :sidebar-capabilities="{
      showName: true,
      showTranslations: true,
      showReserves: true,
      showRobot: false,
      showRobotVarName: false,
      showResetVisible: false,
    }"
  >
    <template #default>
      <div class="hidden"></div>
    </template>
  </DashboardParameterEditor>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import DashboardParameterEditor from "../components/DashboardParameterEditor.vue";
import { SINGLETON_PAGES } from "../config/navigation";
import { PARAM_CATEGORIES } from "../config/paramCategories";
import { appState } from "../core";

const SINGLETON_DESCRIPTIONS: Record<string, string> = {
  Process: "Defines machine operating modes such as emptying, and other production modes.",
  Setting: "Defines recipe checklist parameters that can be enabled or disabled.",
  Info: "Displays read-only HMI data such as power consumption and measurements.",
};

const PARAM_SECTIONS = PARAM_CATEGORIES.map((cat) => ({
  key: cat.key,
  label: cat.label,
  toggleKey: cat.toggleKey,
  colorDot: cat.color,
  cols: 2 as const,
}));

// Safely isolates the single instances based on DRY constants
const machineLogicEntities = computed(() => {
  return SINGLETON_PAGES.map((type) => appState.pages[type]?.[0]).filter(Boolean);
});

watchEffect(() => {
  machineLogicEntities.value.forEach((entity) => {
    if (entity && SINGLETON_DESCRIPTIONS[entity.name]) {
      entity.detail = SINGLETON_DESCRIPTIONS[entity.name];
    }
  });
});
</script>
