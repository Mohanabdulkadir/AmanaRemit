import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Calculator from './pages/Calculator';
import Details from './pages/Details';
import Invoice from './pages/Invoice';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/details" element={<Details />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
