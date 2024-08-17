import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "primereact/resources/themes/viva-light/theme.css";
import App from "./App";
import "./index.css";

export const MainApp = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <StrictMode>
      <PrimeReactProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PrimeReactProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<MainApp />);
