import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./style.css";

// Mount immediately: the UI must always render, even if backend calls
// fail later. Data loading (registries, persisted state, hardware) happens
// inside App.vue's onMounted, with its own error handling.
createApp(App).use(router).mount("#app");
