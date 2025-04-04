import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import KanbanBoard from './components/KanbanBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/KanbanBoard" element={<KanbanBoard />} />
      </Routes>
    </Router>
  );
}

export default App;

