const axios = require('axios');

exports.calculateRouteDistance = async (start, end) => {
    const coords = `${start[0]},${start[1]};${end[0]},${end[1]}`;
    const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${coords}?overview=false`);
    return response.data.routes[0].distance / 1000; // Distance in kilometers
};

exports.calculateETA = (distance) => {
    const averageSpeed = 50; // in km/h
    return (distance / averageSpeed) * 60; // ETA in minutes
};