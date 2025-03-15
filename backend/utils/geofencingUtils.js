const Geofence = require('../models/Geofence');

exports.checkGeofence = async (driverLocation) => {
    const fences = await Geofence.find({
        area: {
            $geoIntersects: {
                $geometry: {
                    type: 'Point',
                    coordinates: driverLocation,
                },
            },
        },
    });
    return fences.length > 0; // True if inside a geofence
};