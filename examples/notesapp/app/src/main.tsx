import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { App } from "./ui/App";
import { requestPersistentStorage } from "./pwa/persist";

registerSW({ immediate: true });
void requestPersistentStorage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
