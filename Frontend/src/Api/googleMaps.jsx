import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places', 'geometry'];

const GoogleMaps = ({ mapCenter: propMapCenter, marker: propMarker, onAddressChange }) => {
  const [mapRef, setMapRef] = useState(null);

  const mapStyles = {
    height: '800px',
    width: '100%'
  };

  const onMapLoad = useCallback((map) => {
    setMapRef(map);
  }, []);

  // Efecto para mover el mapa cuando cambian las coordenadas desde el padre
  useEffect(() => {
    if (mapRef && propMapCenter) {
      mapRef.panTo(propMapCenter);
    }
  }, [mapRef, propMapCenter]);

  const moveMapToPosition = (lat, lng) => {
    if (mapRef) {
      mapRef.panTo({ lat, lng });
    }
  };

  const findNearestCrossStreet = async (lat, lng, mainStreet) => {
    return new Promise((resolve) => {
      if (!mapRef) return resolve('');
      
      const service = new window.google.maps.places.PlacesService(mapRef);
      service.nearbySearch({
        location: { lat, lng },
        radius: 200,
        type: ['route']
      }, (results, status) => {
        if (status === 'OK' && results) {
          const crossStreet = results.find(place => 
            place.name && place.name !== mainStreet && place.name.toLowerCase().includes('st')
          );
          resolve(crossStreet ? crossStreet.name : '');
        } else {
          resolve('');
        }
      });
    });
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const ecuadorBounds = {
        north: 1.4897,
        south: -5.0159,
        west: -81.0849,
        east: -75.1652
      };

      const response = await geocoder.geocode({
        location: { lat, lng },
        bounds: ecuadorBounds,
        region: 'ec'
      });

      if (response.results[0]) {
        const result = response.results[0];
        const addressComponents = result.address_components;
        let streetNumber = '', route = '', city = '', province = '',
        neighborhood = '', country = '', secondaryStreet = '';
        
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
      console.error('Error getting address:', error);
    }
  };

  const onMapClick = useCallback((e) => {
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    // En lugar de actualizar el estado local, notifica al componente padre
    onAddressChange(prevState => ({
      ...prevState,
      _mapCenter: newPosition,
      _marker: newPosition
    }));
    getAddressFromCoordinates(newPosition.lat, newPosition.lng);
    moveMapToPosition(newPosition.lat, newPosition.lng);
  }, [onAddressChange]);

  const onMarkerDragEnd = useCallback((e) => {
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    // En lugar de actualizar el estado local, notifica al componente padre
    onAddressChange(prevState => ({
      ...prevState,
      _mapCenter: newPosition,
      _marker: newPosition
    }));
    getAddressFromCoordinates(newPosition.lat, newPosition.lng);
    moveMapToPosition(newPosition.lat, newPosition.lng);
  }, [onAddressChange]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyC9_P4vQeDtyafKAFvad3bJJPwmO7tmKQQ" libraries={libraries}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={propMapCenter || { lat: -0.1807, lng: -78.4678 }}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {(propMarker && propMarker.lat && propMarker.lng) && (
          <Marker
            position={propMarker}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMaps;
