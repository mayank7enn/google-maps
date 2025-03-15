const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
    },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' },
}, { timestamps: true });

DriverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', DriverSchema);