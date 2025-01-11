import L from 'leaflet';
import { useRef, useState } from "react";
import { Marker, Tooltip } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js';

// Icono rojo chulo
const redIcon = new L.AwesomeMarkers.icon({
  icon: 'home',        
  markerColor: 'red',   
  prefix: 'fa',
});

function RedPointer({ lat, lng, name }) {
  const [position] = useState({ lat, lng });
  const markerRef = useRef(null);

  return (
    <Marker
      position={position}
      icon={redIcon} 
      ref={markerRef}
    >
      <Tooltip>
        <strong>{name}</strong>
      </Tooltip>
    </Marker>
  );
}

export default RedPointer;
