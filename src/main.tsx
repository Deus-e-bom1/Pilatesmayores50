import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { initPixels } from "./lib/tracking";
import "./styles.css";

function Root() {
  useEffect(() => {
    initPixels();
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
