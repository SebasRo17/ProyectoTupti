import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const GoogleMaps = ({ onAddressChange }) => {
  const [marker, setMarker] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: -0.1807, // Coordenadas predeterminadas (Centro de Ecuador)
    lng: -78.4678
  });

  const mapStyles = {
    height: '800px',
    width: '100%'
  };

  const onMapLoad = useCallback((map) => {
    setMapRef(map);
  }, []);

  const findNearestCrossStreet = async (lat, lng, mainStreet) => {
    return new Promise((resolve) => {
      if (!mapRef) return resolve('');
      
      const service = new window.google.maps.places.PlacesService(mapRef);
      service.nearbySearch({
        location: { lat, lng },
        radius: 200, // Aumentamos el radio de búsqueda a 200 metros
        type: ['route'] // Aseguramos que solo buscamos "rutas" o "calles"
      }, (results, status) => {
        if (status === 'OK' && results) {
          // Filtramos para encontrar la intersección más cercana que no sea la calle principal
          const crossStreet = results.find(place => 
            place.name && place.name !== mainStreet && place.name.toLowerCase().includes('st') // Aseguramos que sea una calle
          );
          resolve(crossStreet ? crossStreet.name : ''); // Devolvemos el nombre de la calle secundaria o vacío
        } else {
          resolve('');
        }
      });
    });
  };  

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      
      // Añadimos límites para restringir los resultados a Ecuador
      const ecuadorBounds = {
        north: 1.4897,
        south: -5.0159,
        west: -81.0849,
        east: -75.1652
      };
  
      const response = await geocoder.geocode({
        location: { lat, lng },
        bounds: ecuadorBounds,
        region: 'ec'  // Restringir a Ecuador
      });
  
      if (response.results[0]) {
        const result = response.results[0];
        const addressComponents = result.address_components;
        let streetNumber = '', route = '', city = '', province = '',
        neighborhood = '', country= '', secondaryStreet = '';
        addressComponents.forEach(component => {
          const types = component.types;
          
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          } else if (types.includes('route')) {
            route = component.long_name;
          } else if (types.includes('sublocality_level_2') || types.includes('route_2')) {
            secondaryStreet = component.long_name;
          } else if (types.includes('sublocality_level_1') ||  types.includes('neighborhood')) {
            neighborhood = component.long_name;
          } else if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            province = component.long_name;
          } else if (types.includes('country')) {
            country = component.long_name;
          }
        });
        const crossStreet = await findNearestCrossStreet(lat, lng, route);
        console.log('Calle secundaria encontrada:', crossStreet); 
        onAddressChange({
          callePrincipal: route || result.formatted_address.split(',')[0],
          numeracion: streetNumber,
          calleSecundaria: crossStreet || secondaryStreet || '',
          barrio: neighborhood,
          ciudad: city,
          provincia: province,
          pais: country
        });
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
    }
  };

  const onMapClick = useCallback((e) => {
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setMarker(newPosition);
    setMapCenter(newPosition);
    getAddressFromCoordinates(newPosition.lat, newPosition.lng);
  }, [onAddressChange]);

  const onMarkerDragEnd = useCallback((e) => {
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setMarker(newPosition);
    setMapCenter(newPosition);
    getAddressFromCoordinates(newPosition.lat, newPosition.lng);
  }, [onAddressChange]);

  return (
    <LoadScript googleMapsApiKey= "AIzaSyC9_P4vQeDtyafKAFvad3bJJPwmO7tmKQQ" libraries={['places', 'geometry']}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={mapCenter}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {marker && (
          <Marker
            position={marker}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMaps;


