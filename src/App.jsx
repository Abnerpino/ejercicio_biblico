import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './screens/menu';
import Tablero from './screens/tablero';

const App = () => {
  const [enableVolume, setEnableVolume] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu volumen={enableVolume} setVolumen={setEnableVolume} />} />
        <Route path="/tablero" element={<Tablero volumen={enableVolume} setVolumen={setEnableVolume} />} />
      </Routes>
    </Router>
  );
};

export default App;
