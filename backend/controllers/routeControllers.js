const axios = require('axios');

exports.optimizeRoute = async (req, res) => {
    const { stops } = req.body; // Array of coordinates [lng, lat]
    console.log('Received stops:', stops);

    if (!stops || stops.length < 3) {
        return res.status(400).json({ message: 'At least three stops are required for route optimization (driver, source, destination).' });
    }

    try {
        const coords = stops
            .map(stop => stop.map(coord => parseFloat(coord.toFixed(6))).join(',')) // Ensure consistent decimal places
            .join(';');

        console.log("Formatted coordinates:", coords);

        const response = await axios.get(`http://router.project-osrm.org/trip/v1/driving/${coords}?roundtrip=false&source=first&destination=last`);
        console.log('OSRM API Response:', response.data);

        if (!response.data.trips || response.data.trips.length === 0) {
            return res.status(400).json({ message: 'Failed to optimize route.' });
        }

        const trip = response.data.trips[0];
        const optimizedRoute = trip.geometry; // Encoded polyline of the optimized route

        // Calculate total distance and duration
        const totalDistance = trip.distance;
        const totalDuration = trip.duration;

        // Extract legs
        const legs = trip.legs.map(leg => ({
            distance: leg.distance,
            duration: leg.duration,
            geometry: leg.geometry,
        }));

        res.status(200).json({
            optimizedRoute,
            legs,
            totalDistance,
            totalDuration,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error optimizing route.', error: error.message });
    }
};

// New function to calculate optimized path between source and destination
exports.getOptimizedPath = async (req, res) => {
    const { source, destination } = req.query;

    if (!source || !destination) {
        return res.status(400).json({ message: 'Both source and destination are required.' });
    }

    try {
        const coords = `${source};${destination}`;
        const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=polyline`);
        const { routes } = response.data;

        if (!routes || routes.length === 0) {
            return res.status(400).json({ message: 'Failed to calculate route.' });
        }

        const optimizedRoute = routes[0].geometry; // Encoded polyline of the optimized route
        res.status(200).json({ optimizedRoute });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error calculating route.', error: error.message });
    }
};