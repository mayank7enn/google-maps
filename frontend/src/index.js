import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home.jsx';
import App from './App.jsx';
import { LocationProvider } from './context/LocationContext.js'; // Import LocationProvider

// Create a root for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app using the new React 18 API
root.render(
    <LocationProvider> {/* Wrap the app with LocationProvider */}
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/app" element={<App />} />
            </Routes>
        </Router>
    </LocationProvider>
);