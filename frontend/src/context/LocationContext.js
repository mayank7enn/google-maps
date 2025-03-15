import React, { createContext, useState } from 'react';

// Create the context
export const LocationContext = createContext();

// Create the provider component
export const LocationProvider = ({ children }) => {
    const [drivers, setDrivers] = useState([
        { id: '1', name: 'John Doe', location: [72.8777, 19.076], status: 'online' },
        { id: '2', name: 'Jane Smith', location: [77.209, 28.6139], status: 'offline' },
    ]);

    return (
        <LocationContext.Provider value={{ drivers, setDrivers }}>
            {children}
        </LocationContext.Provider>
    );
};