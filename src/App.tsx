import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Meet from "./components/meet";

// At last need to implement lazy load if time is there
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/meet/:code" element={<Meet />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
