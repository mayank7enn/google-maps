exports.getDriverLocationAndETA = async (req, res) => {
    const { driverId, destination } = req.body;

    try {
        // Validate input
        if (!driverId || !destination || !Array.isArray(destination) || destination.length !== 2) {
            return res.status(400).json({ message: 'Invalid input. Provide driverId and valid destination coordinates.' });
        }

        // Find the driver in the database
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Calculate distance and ETA
        const distance = await distanceUtils.calculateRouteDistance(driver.location.coordinates, destination);
        const eta = distanceUtils.calculateETA(distance);

        res.status(200).json({
            driverLocation: driver.location.coordinates,
            distance,
            eta,
        });
    } catch (error) {
        console.error('Error in getDriverLocationAndETA:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};