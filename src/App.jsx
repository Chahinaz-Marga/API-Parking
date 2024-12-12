import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import ParkingList from './components/parkingList';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ParkingList />} />
        <Route path="/about" element={<h1>Sobre nosotros</h1>} />
        <Route path="/contact" element={<h1>Contacto</h1>} />
      </Routes>
    </Router>
  );
}

export default App;

