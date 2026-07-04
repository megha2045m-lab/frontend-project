import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyFiles from "./pages/MyFiles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Starred from "./pages/Starred";
import Trash from "./pages/Trash";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Login />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/myfiles"   element={<ProtectedRoute><MyFiles /></ProtectedRoute>} />
        <Route path="/starred"   element={<ProtectedRoute><Starred /></ProtectedRoute>} />
        <Route path="/trash"     element={<ProtectedRoute><Trash /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;