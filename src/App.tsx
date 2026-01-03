import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Meet from "./components/meet";
import { MeetingGuard } from "./components/meet/components/meetingGuard";

// At last need to implement lazy load if time is there
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/meet/:code"
          element={
            <MeetingGuard>
              <Meet />
            </MeetingGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
