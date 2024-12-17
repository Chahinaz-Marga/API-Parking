import { useCallback, useMemo, useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";



function Pointer({ lat, lng, name, onClick }) {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState({ lat, lng });
  const markerRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
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
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      {showPopup && (
        <Popup autoClose={false} closeButton={false}>
          <strong>{name}</strong>
          <br />
          <span onClick={toggleDraggable}>
          {draggable
            ? "Marker is draggable"
            : "Click here to make marker draggable"}
        </span>
        </Popup>
      )}
    </Marker>
  );
}

export default Pointer;
