<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar />
    <main class="flex-1 overflow-y-auto">
      <router-view />
    </main>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Sidebar from "./components/Sidebar.vue";
import ToastContainer from "./components/ToastContainer.vue";
import { useAutoSave } from "./composables/useAutoSave";
import { toast } from "./composables/useToast";
import { PersistenceService, appState } from "./core";
import { initRegistries } from "./core/registry";
import { HardwareService } from "./core/wails";

onMounted(async () => {
  // 1. Load equipment/page registries from the backend.
  try {
    await initRegistries();
  } catch (err) {
    console.error("[Registry] Failed to load registries:", err);
    toast.error("Startup Failed", {
      description: "Could not load equipment/page definitions from the backend.",
    });
    return;
  }

  // 2. Load persisted data. Nothing writes to disk before this resolves.
  const loadSuccess = await PersistenceService.init();

  if (!loadSuccess) {
    toast.error("Data Load Failure", {
      description: "Configuration file is corrupted.",
    });
    return;
  }

  // 3. Data is safe. Now, and only now, start watching for changes.
  useAutoSave();

  // 4. Best-effort hardware auto-load. A failure here must not block the app.
  try {
    const modules = await HardwareService.autoLoadHardware();
    if (modules) appState.detectedHardware = modules;
  } catch (err) {
    console.error("[Hardware] Auto-load failed:", err);
  }
});
</script>
