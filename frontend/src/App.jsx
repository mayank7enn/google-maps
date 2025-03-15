import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MapComponent from './components/MapComponent.jsx';
import { LocationProvider } from './context/LocationContext.js';
import queryString from 'query-string';
import { getOptimizedRoute } from './services/api.js';
import socket from './socket'; // Import the socket instance

function App() {
    const location = useLocation();
    const [routeData, setRouteData] = useState(null);
    const [driverLocation, setDriverLocation] = useState([77.08272060641288, 28.680673947983266]); // Default [lng, lat]
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Parse query parameters
    const queryParams = queryString.parse(location.search);
    const source = queryParams.source?.trim().replace(/\s+/g, '');
    const destination = queryParams.destination?.trim().replace(/\s+/g, '');

    // Fetch Optimized Route
    const fetchOptimizedRoute = async (driverCoords) => {
        if (!source || !destination) {
            setError('Source or destination is missing in query parameters.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const sourceCoords = source.split(',').map(Number);
            const destinationCoords = destination.split(',').map(Number);

            const response = await getOptimizedRoute(driverCoords, sourceCoords, destinationCoords);
            console.log('🚀 API Response (Route Data):', response);

            if (!response || !response.optimizedRoute) {
                setError('No optimized route found.');
                setRouteData(null);
                return;
            }

            setRouteData(response);
            setError(null);
        } catch (error) {
            console.error('❌ Error fetching optimized route:', error);
            setError('Failed to calculate route. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch route on first render
    useEffect(() => {
        fetchOptimizedRoute(driverLocation);
    }, [source, destination, location.search]);

    // Listen for driver location updates from the socket
    useEffect(() => {
        const handleDriverUpdate = (newLocation) => {
            console.log('📍 Driver location updated via socket:', newLocation);

            const lng = parseFloat(newLocation.longitude);
            const lat = parseFloat(newLocation.latitude);

            console.log('🌍 New Coordinates:', lng, " : ", lat);

            setDriverLocation((prevLocation) => {
                const [prevLng, prevLat] = prevLocation;

                // Only update if location changes significantly
                if (Math.abs(prevLng - lng) > 0.0001 || Math.abs(prevLat - lat) > 0.0001) {
                    fetchOptimizedRoute([lng, lat]);
                    return [lng, lat];
                }

                return prevLocation;
            });
        };
        
        socket.on('connect', () => {
            console.log('🔌 Connected to socket server');
        });

        socket.on('updateDriverAddress', handleDriverUpdate);

        return () => {
            console.log('🔌 Disconnected from socket server');
            socket.off('updateDriverAddress', handleDriverUpdate); // Properly remove listener
        };
    }, []);

    return (
        <div className="App">
            <h1>Live Tracking Module</h1>
            {loading && <p>Loading route data...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="route-info">
                {routeData && routeData.legs && routeData.legs.length > 0 ? (
                    <div className="route-summary">
                        <h2>Route Summary</h2>
                        <p>Driver to Pickup: {(routeData.legs[0].distance / 1000).toFixed(2)} km ({Math.round(routeData.legs[0].duration / 60)} mins)</p>
                        <p>Pickup to Destination: {(routeData.legs[1].distance / 1000).toFixed(2)} km ({Math.round(routeData.legs[1].duration / 60)} mins)</p>
                        <p>Total Trip: {(routeData.totalDistance / 1000).toFixed(2)} km ({Math.round(routeData.totalDuration / 60)} mins)</p>
                    </div>
                ) : (
                    <p>No route data available.</p>
                )}
            </div>

            <MapComponent routeData={routeData} driverLocation={driverLocation} />
        </div>
    );
}

export default function RootApp() {
    return (
        <LocationProvider>
            <App />
        </LocationProvider>
    );
}
