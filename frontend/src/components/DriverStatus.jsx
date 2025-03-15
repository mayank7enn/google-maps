import React from 'react';

const DriverStatus = ({ drivers }) => {
    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Driver Status</h3>
            <ul>
                {drivers.map((driver) => (
                    <li key={driver.id}>
                        <strong>{driver.name}</strong>: {driver.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DriverStatus;