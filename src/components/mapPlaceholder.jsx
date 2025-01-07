// MapWithPlaceholder.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuración del icono por defecto (arregla problemas con iconos en Leaflet)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon.png', // Ruta correcta desde la carpeta 'public'
  iconUrl: '/images/redPointer.png', // Ruta correcta desde la carpeta 'public'
  shadowUrl: '/images/marker-shadow.png', // Ruta correcta desde la carpeta 'public'
});

// Crear el icono rojo personalizado-
const redIcon = new L.Icon({
  iconUrl: '/images/marker-icon-2x.png', // Usar el icono existente en el proyecto
  shadowUrl: '/images/marker-shadow.png', // Usar la sombra existente en el proyecto
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapWithPlaceholder({ parkings, googleResult, searchRadius, onMarkerClick }) {
  // Definir la posición inicial del mapa
  const defaultPosition = [40.4168, -3.7038]; // Madrid

  // Si hay una ubicación de búsqueda, centrar el mapa allí
  const mapCenter = googleResult ? [googleResult.lat, googleResult.lng] : defaultPosition;

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
      {/* Capa de mapas */}
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {/* Marcador rojo en la ubicación buscada */}
      {googleResult && (
        <>
          <Marker position={[googleResult.lat, googleResult.lng]} icon={redIcon}>
            <Popup>
              <strong>{googleResult.name}</strong>
            </Popup>
          </Marker>

          {/* Círculo verde alrededor de la ubicación */}
          <Circle
            center={[googleResult.lat, googleResult.lng]}
            radius={searchRadius * 1000} // Convertir km a metros
            pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
          />
        </>
      )}

      {/* Marcadores de aparcamientos */}
      {parkings &&
        parkings.map((parking) => (
          <Marker
            key={parking.id}
            position={[parking.location.latitude, parking.location.longitude]}
            eventHandlers={{ click: () => onMarkerClick(parking) }}
          >
            <Popup>
              <strong>{parking.title}</strong>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

export default MapWithPlaceholder;
