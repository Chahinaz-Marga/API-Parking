import { useMemo, useRef, useState } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from 'leaflet'; // Importamos Leaflet para personalizar el icono
import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js';


// Icono rojo personalizado
const redIcon = new L.AwesomeMarkers.icon({
  icon: 'home',        
  markerColor: 'red',   
  prefix: 'fa',
});

function RedPointer({ lat, lng, name }) {
  const [position, setPosition] = useState({ lat, lng });
  const markerRef = useRef(null);

  return (
    <Marker
      position={position}
      icon={redIcon} // Aplicamos el icono rojo personalizado
      ref={markerRef}
    >
      <Tooltip>
        <strong>{name}</strong>
      </Tooltip>
    </Marker>
  );
}

export default RedPointer;

