import { useMemo, useRef, useState } from "react";
import { Marker, Tooltip } from "react-leaflet";
import 'leaflet/dist/leaflet.css';


function Pointer({ lat, lng, name, onClick }) {
  const [position, setPosition] = useState({ lat, lng });
  const markerRef = useRef(null);
  
 
  const eventHandlers = useMemo(
    () => ({
      click() {
        if (onClick) onClick();
      },
    }),
    [onClick]
  );
 
return (
    <Marker
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
     <Tooltip >
        <strong>{name}</strong>
      </Tooltip>
  
    </Marker>
  );
}

export default Pointer;
