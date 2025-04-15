import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import FileComplaint from './components/FileComplaint';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/file-complaint" element={<FileComplaint />} />
      </Routes>
    </Router>
  );
}

export default App;
