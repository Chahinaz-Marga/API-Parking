export function filterParkingsByDistance(parkings, userLat, userLng, radius) {
    const earthRadiusKm = 6371;
  
    return parkings.filter((parking) => {
      const parkingLat = parking.location.latitude;
      const parkingLng = parking.location.longitude;
  
      // Fórmula de Haversine
      const dLat = degreesToRadians(parkingLat - userLat);
      const dLng = degreesToRadians(parkingLng - userLng);
  
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(userLat)) *
          Math.cos(degreesToRadians(parkingLat)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
  
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadiusKm * c;
  
      return distance <= radius; // Incluir el parking si está dentro del radio
    });
  }
  
  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  

  