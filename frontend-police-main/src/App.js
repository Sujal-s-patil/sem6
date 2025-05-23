import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/PoliceRegistration';
import KanbanBoard from './components/KanbanBoard';
//comment
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<KanbanBoard />} />
      </Routes>
    </Router>
  );
}

export default App;

