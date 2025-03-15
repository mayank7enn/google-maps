import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!source || !destination) {
            alert('Please provide both Source and Destination.');
            return;
        }
    
        // Parse input values
        const [srcLat, srcLng] = source.split(',').map(coord => coord.trim());
        const [destLat, destLng] = destination.split(',').map(coord => coord.trim());
    
        // Validate parsed values
        if (!srcLat || !srcLng || !destLat || !destLng) {
            alert('Invalid Source or Destination format. Use "lat,lng" format.');
            return;
        }
    
        // Swap lat,lng to lng,lat for API
        const formattedSource = `${srcLng},${srcLat}`;
        const formattedDestination = `${destLng},${destLat}`;
    
        // Redirect to /app with correctly formatted query parameters
        navigate(`/app?source=${formattedSource}&destination=${formattedDestination}`);
    };
    

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Live Tracking Module</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Source (Lat,Lng):
                        <input
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            placeholder="Enter Source (e.g., 19.076,72.8777)"
                            style={{ marginLeft: '10px', padding: '5px' }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Destination (Lat,Lng):
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Enter Destination (e.g., 77.209,28.6139)"
                            style={{ marginLeft: '10px', padding: '5px' }}
                        />
                    </label>
                </div>
                <button type="submit" style={{ padding: '10px 20px' }}>Show Optimized Path</button>
            </form>
        </div>
    );
};

export default HomePage;