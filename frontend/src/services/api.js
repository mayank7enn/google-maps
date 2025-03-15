import axios from 'axios';

const API_URL = "http://localhost:5000";

// Fetch driver location and ETA
// export const getDriverLocationAndETA = async (driverId, destination) => {
//     try {
//         const response = await axios.post(`${API_URL}/api/drivers/location-and-eta`, { driverId, destination });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching ETA:', error);
//         throw error; // Rethrow the error for handling in the component
//     }
// };

// Fetch optimized route between source and destination
// Fetch optimized route between driver, source, and destination
export const getOptimizedRoute = async (driver, source, destination) => {
    try {
        const response = await axios.post(`${API_URL}/api/routes/optimize-route`, {
            stops: [driver, source, destination], // Array of coordinates [lng, lat]
        });

        // Return the full response data
        return response.data;
    } catch (error) {
        console.error('Error fetching optimized route:', error);
        throw error; // Rethrow the error for handling in the component
    }
};