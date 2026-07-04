import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastStyle={{
          background: "rgba(15,23,42,0.98)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 14,
          color: "#e2e8f0",
          backdropFilter: "blur(16px)",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      />
    </>
  </StrictMode>
);
