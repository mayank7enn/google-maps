import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { decode } from '@mapbox/polyline';
import L from 'leaflet';

// Fix for default Leaflet marker icons not loading correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function FitBounds({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds);
        }
    }, [map, bounds]);
    return null;
}

const MapComponent = ({ routeData, driverLocation }) => {
    const defaultCenter = [0,0]; // Default location (Delhi)
    const zoomLevel = 10;

    // State for decoded route
    const [decodedRoute, setDecodedRoute] = useState([]);

    useEffect(() => {
        console.log("🔄 Received routeData:", routeData);
    
        if (!routeData || Object.keys(routeData).length === 0) {
            console.warn("⚠️ No route data available");
            setDecodedRoute([]);
            return;
        }
    
        if (!routeData.optimizedRoute) {
            console.warn("⚠️ No optimizedRoute found in API response:", routeData);
            setDecodedRoute([]);
            return;
        }
    
        try {
            // Keep precision at 5 (default)
            const decoded = decode(routeData.optimizedRoute).map(([lat, lng]) => [lat, lng]);
            setDecodedRoute(decoded);
            console.log("✅ Decoded Route:", decoded);
        } catch (error) {
            console.error("❌ Error decoding route:", error);
            setDecodedRoute([]);
        }
    }, [routeData]);
    
    // Ensure valid source and destination
    const sourcePoint = decodedRoute.length > 0 ? decodedRoute[0] : defaultCenter;
    const destinationPoint = decodedRoute.length > 0 ? decodedRoute[decodedRoute.length - 1] : defaultCenter;
    const bounds = decodedRoute.length > 0 ? decodedRoute : [];

    const mapCenter = driverLocation ? [driverLocation[1], driverLocation[0]] : sourcePoint;

    return (
        <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {bounds.length > 0 && <FitBounds bounds={bounds} />}

            {/* Driver Location */}
            {driverLocation && (
                <Marker position={[driverLocation[1], driverLocation[0]]}>
                    <Popup>🚖 Driver's Current Location</Popup>
                </Marker>
            )}

            {/* Source (Pickup) Location */}
            <Marker position={sourcePoint}>
                <Popup>
                    📍 Source (Pickup)
                    <br />
                    Distance: {(routeData?.legs?.[0]?.distance / 1000 || 0).toFixed(2)} km
                    <br />
                    ETA: {Math.round(routeData?.legs?.[0]?.duration / 60 || 0)} mins
                </Popup>
            </Marker>

            {/* Destination (Dropoff) Location */}
            <Marker position={destinationPoint}>
                <Popup>
                    🎯 Destination (Dropoff)
                    <br />
                    Total Trip Time: {Math.round(routeData?.totalDuration / 60 || 0)} mins
                </Popup>
            </Marker>

            {/* Polyline for route */}
            {decodedRoute.length > 0 && <Polyline positions={decodedRoute} color="blue" />}
        </MapContainer>
    );
};

export default MapComponent;
