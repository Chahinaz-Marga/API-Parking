import React from 'react';

function GoogleMapsLink ({ address }) {
    const openGoogleMaps = () => {
        const destination = encodeURIComponent(`${address}`);
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div>
            <button onClick={openGoogleMaps}>
            Ruta
            </button>
        </div>
    );
};

export default GoogleMapsLink;
