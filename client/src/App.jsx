import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            padding: "14px 18px",
            borderRadius: "14px",
            background: "#171321",
            color: "#ffffff",
            fontFamily: "Work Sans, sans-serif",
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;