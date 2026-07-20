import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
    </GoogleOAuthProvider>
  );
};

export default App;