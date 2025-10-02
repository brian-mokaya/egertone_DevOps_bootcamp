import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Monitoring from './components/Monitoring';
import Results from './components/Results';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">SMS Emmy</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Upload</Link>
              <Link to="/results" className="nav-link">Results</Link>
              <Link to="/monitoring" className="nav-link">Monitoring</Link>
            </div>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/monitoring" element={<Monitoring />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
