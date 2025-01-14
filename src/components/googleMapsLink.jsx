import React from 'react';

function GoogleMapsLink ({ address }) {
    const openGoogleMaps = () => {
        const destination = encodeURIComponent(`${address}`);
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div>
            <button onClick={openGoogleMaps} className="btn btn-link">
            <i className="bi bi-pin-map-fill" style={{ fontSize: '1.2rem' }}></i>
            </button>
        </div>
    );
};

export default GoogleMapsLink;
