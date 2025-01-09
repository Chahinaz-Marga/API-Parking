import React, { useEffect, useState } from 'react';

const SearchParkingNear = ({ googleResult, parkings, onMarkersUpdate }) => {
  const searchRadius = 2;
  

  return (
    <div>
      
      <ul>
        {nearbyParkings.map((parking) => (
          <li key={parking['@id']}>{parking.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchParkingNear;
