<template>
  <div class="pt-4 pb-8 h-full flex flex-col w-full overflow-hidden relative bg-gray-50/50">
    <div class="flex flex-row gap-5 overflow-x-auto pb-8 pt-2 px-5 flex-1 items-start">
      <draggable
        v-model="store.list.value"
        item-key="id"
        class="flex flex-row gap-5 items-start shrink-0"
        animation="250"
        handle=".drag-handle"
        ghost-class="opacity-0"
        @end="store.syncIndexes"
      >
        <template #item="{ element: eq, index: eqIndex }">
          <BaseConfigCard
            :prefix="store.definition.prefix"
            :itemIndex="eq.index"
            :label="store.definition.label ?? 'Item'"
            v-model:enable="eq.enable"
            @delete="store.removeAction(eqIndex)"
            :error="hasLocalError(eq)"
            :errorMessage="getErrorMessage(eq)"
          >
            <div class="flex flex-col gap-2">
              <div v-if="store.definition.hasEmLink">
                <div>
                  <label
                    :class="[
                      'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                      isParentLinkBroken(eq) ? 'text-red-600' : 'text-gray-500',
                    ]"
                  >
                    Linked Module
                  </label>
                  <select
                    v-model="eq.emId"
                    :class="[
                      'w-full px-2 py-1.5 border rounded-md text-sm focus:ring-1 focus:outline-none bg-white transition-colors',
                      isParentLinkBroken(eq)
                        ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-500',
                    ]"
                  >
                    <option :value="null">None</option>
                    <option v-for="mod in modules" :key="mod.id" :value="mod.id">EM{{ mod.index }}</option>
                  </select>
                </div>
              </div>

              <div v-if="store.definition.type === 'workplace'">
                <div>
                  <label
                    :class="[
                      'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                      isParentLinkBroken(eq) ? 'text-red-600' : 'text-gray-500',
                    ]"
                  >
                    Linked Robot
                  </label>
                  <select
                    v-model="eq.robotId"
                    :class="[
                      'w-full px-2 py-1.5 border rounded-md text-sm focus:ring-1 focus:outline-none bg-white transition-colors',
                      isParentLinkBroken(eq)
                        ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-blue-500',
                    ]"
                  >
                    <option :value="null">None</option>
                    <option v-for="robot in robotsList" :key="robot.id" :value="robot.id">R{{ robot.index }}</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  :class="[
                    'block text-[11px] font-bold uppercase tracking-wider mb-1.5',
                    isNameError(eq) ? 'text-red-600' : 'text-gray-500',
                  ]"
                >
                  Name
                </label>
                <input
                  type="text"
                  v-model="eq.name"
                  maxlength="32"
                  placeholder="e.g. CAM_01"
                  @input="onNameInput(eq, $event)"
                  :class="[
                    'w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none bg-white transition-colors',
                    isNameError(eq)
                      ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-1 focus:ring-blue-500',
                  ]"
                />
                <p :class="['text-[10px] mt-1 text-right', eq.name.length >= 32 ? 'text-red-400' : 'text-gray-400']">
                  {{ eq.name.length }} / 32
                </p>
              </div>

              <div>
                <CollapsibleSection label="Translations & Info" v-model="eq.ui.showProps">
                  <template #icon>
                    <AppIcon name="align-left" :size="14" class="text-gray-500" />
                  </template>
                  <TranslationsFields :item="eq" />
                </CollapsibleSection>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Cycle Time
                </label>
                <select
                  v-model.number="eq.cycleTime"
                  class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  <option :value="2" :disabled="!store.definition.allowsFastCycle">
                    2 ms
                    {{ !store.definition.allowsFastCycle ? "(Axes & Mechatro Only)" : "" }}
                  </option>
                  <option :value="4">4 ms</option>
                  <option :value="10">10 ms</option>
                  <option :value="20">20 ms</option>
                </select>
              </div>

              <AxisConfigurationPanel
                v-if="store.definition.customPanel === 'axis'"
                :axis="eq"
                :hasError="(field) => isFieldError(eq, field)"
              />

              <ConfigFieldsSection
                v-for="section in fieldSections"
                :key="section.label"
                :label="section.label"
                :fields="section.fields"
                :item="eq"
                :icon="section.icon"
                v-model="eq.ui[section.uiKey]"
                :is-field-error="(f) => isFieldError(eq, f)"
                :is-field-visible="section.filterVisible ? (f) => isFieldVisible(eq, f) : undefined"
              />

              <div v-if="store.definition.parameterFields && store.definition.parameterFields.length > 0">
                <CollapsibleSection label="Parameters" v-model="eq.ui.showParams">
                  <template #icon>
                    <AppIcon name="sliders-horizontal" :size="14" class="text-gray-500" />
                  </template>

                  <template #badge v-if="hasParamsError(eq)">
                    <span class="relative flex h-2 w-2 ml-1 shrink-0" title="Error in parameters">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                      ></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </template>

                  <EquipmentParameterList
                    :equipment="eq"
                    :get-param-error-message="getParamErrorMessage"
                    @open-sidebar="openSidebar(eqIndex, findOriginalIndex(eq, $event))"
                  />
                </CollapsibleSection>
              </div>
            </div>
          </BaseConfigCard>
        </template>
      </draggable>

      <GhostCard class="shrink-0" :title="`Add New ${store.definition.label}`" @add="store.addAction" />
    </div>

    <ParameterSidebar
      :activeParam="activeParam"
      :parentContext="
        activeParam && selectedArgs
          ? `${store.definition.label}: ${store.definition.prefix}${store.list.value[selectedArgs[0]].index}`
          : ''
      "
      :capabilities="store.definition.sidebarCapabilities"
      @close="closeSidebar"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import draggable from "vuedraggable";
import AppIcon from "../components/AppIcon.vue";
import AxisConfigurationPanel from "../components/axis/AxisConfigurationPanel.vue";
import BaseConfigCard from "../components/BaseConfigCard.vue";
import CollapsibleSection from "../components/CollapsibleSection.vue";
import ConfigFieldsSection from "../components/ConfigFieldsSection.vue";
import EquipmentParameterList from "../components/EquipmentParameterList.vue";
import GhostCard from "../components/GhostCard.vue";
import ParameterSidebar from "../components/ParameterSidebar.vue";
import TranslationsFields from "../components/TranslationsFields.vue";
import { useEquipmentValidation } from "../composables/useEquipmentValidation";
import { useParamSelection } from "../composables/useParamSelection.js";
import type { ConfigField, EquipmentInstance } from "../config/equipment";
import { equipmentFieldSections, equipmentStores, modules } from "../core";
import { sanitizeVariableName } from "../utils/validators";

const props = defineProps<{ type: string }>();

// Resolve the correct store based on the generic equipment type route parameter
const store = computed(() => equipmentStores[props.type as keyof typeof equipmentStores]);

const robotsList = computed(() => equipmentStores.robot?.list.value ?? []);

const {
  isFieldVisible,
  isParentLinkBroken,
  isNameError,
  isFieldError,
  getParamErrorMessage,
  hasParamsError,
  hasLocalError,
  getErrorMessage,
} = useEquipmentValidation(store);

// Map dynamic field sections defined in JSON registry to the UI configuration
const fieldSections = computed(() => {
  const def = store.value?.definition;
  if (!def || def.customPanel === "axis") return [];

  return equipmentFieldSections.value
    .map((spec) => ({
      label: spec.label,
      fields: (def[spec.fieldsKey] || []) as ConfigField[],
      icon: spec.iconKey ? (def[spec.iconKey] as string | undefined) : undefined,
      uiKey: spec.uiKey,
      filterVisible: spec.filterVisible ?? false,
    }))
    .filter((s) => s.fields.length > 0);
});

// Enforce standard variable naming conventions on input
const onNameInput = (eq: EquipmentInstance, event: Event) => {
  eq.name = sanitizeVariableName((event.target as HTMLInputElement).value);
};

// Returns the true index of a parameter in the original un-filtered array
const findOriginalIndex = (eq: EquipmentInstance, param: { id: number }): number => {
  return eq.parameters.findIndex((p) => p.id === param.id);
};

// Watch equipment list changes specifically to enforce palletization recipe business rules.
// Uses deep watch to avoid infinite update loops common with watchEffect.
watch(
  () => store.value.list.value,
  (equipmentList) => {
    for (const eq of equipmentList) {
      if (eq.type !== "robot") continue;

      const palletizingRecipe = eq.parameters?.find((p) => p.name === "Palletizing Recipe");
      if (!palletizingRecipe) continue;

      const isActive = eq.palettizationId !== null && eq.palettizationId !== undefined && eq.palettizationId !== 0;

      // Force recipe activation if a palletization is linked
      if (isActive && !palletizingRecipe.actif) {
        palletizingRecipe.actif = true;
      }
    }
  },
  { deep: true },
);

// Manage Sidebar parameter selection state
const {
  args: selectedArgs, // args[0] is the equipment index, args[1] is the parameter index
  activeParam,
  open: openSidebar,
  close: closeSidebar,
} = useParamSelection(
  (eqIdx: number, paramIdx: number) => store.value.list.value[eqIdx]?.parameters?.[paramIdx] ?? null,
);
</script>
