import { useCallback, useMemo, useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";



function Pointer({ lat, lng, name, onClick }) {
  const [position, setPosition] = useState({ lat, lng });
  const markerRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const eventHandlers = useMemo(
    () => ({
      mouseover() {
        setShowPopup(true);
      },
      mouseout() {
        setShowPopup(false);
      },
      click() {
        if (onClick) onClick();
      },
    }),
    [onClick]
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      {showPopup && (
        <Popup autoClose={false} closeButton={false}>
          <strong>{name}</strong>
        </Popup>
      )}
    </Marker>
  );
}

export default Pointer;
