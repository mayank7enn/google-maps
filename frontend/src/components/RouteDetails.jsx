import React from 'react';

const RouteDetails = ({ distance, eta, optimizedRoute }) => {
    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Route Details</h3>
            <p><strong>Distance:</strong> {distance.toFixed(2)} km</p>
            <p><strong>ETA:</strong> {eta.toFixed(2)} minutes</p>
            {optimizedRoute && (
                <p><strong>Optimized Route:</strong> {optimizedRoute.slice(0, 20)}...</p>
            )}
        </div>
    );
};

export default RouteDetails;