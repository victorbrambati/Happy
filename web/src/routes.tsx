import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import OrphanagesMap from './pages/OrphanagesMap';
import Orphanage from './pages/Orphanage';
import CreateOrphanage from './pages/CreateOrphanage';
import geolocation from './services/geolocation';

function Routes() {
  const [geolocations, setGeolocations] = useState({
    city: '',
    region_name: '',
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    geolocation
      .get(
        `check?access_key=${process.env.REACT_APP_GEOLOCATION_TOKEN}&format=1`
      )
      .then((response) => {
        setGeolocations(response.data);
      });
  }, []);

  if (geolocations.city === '') {
    return <p>Carregando...</p>;
  }
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/"
          exact
          component={() => (
            <Landing
              city={geolocations.city}
              state={geolocations.region_name}
            />
          )}
        />
        <Route
          path="/app"
          component={() => (
            <OrphanagesMap
              city={geolocations.city}
              state={geolocations.region_name}
              latitude={geolocations.latitude}
              longitude={geolocations.longitude}
            />
          )}
        />

        <Route
          path="/orphanages/create"
          component={() => (
            <CreateOrphanage
              latitude={geolocations.latitude}
              longitude={geolocations.longitude}
            />
          )}
        />
        <Route path="/orphanages/:id" component={Orphanage} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
