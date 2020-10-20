import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  LayoutAnimation,
} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, MapEvent } from 'react-native-maps';
import * as Location from 'expo-location';

import mapMarkerImg from '../../images/map-marker.png';

export default function SelectMapPosition() {
  const navigation = useNavigation();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
      }

      let location = await Location.getCurrentPositionAsync({});
      const cordenate = location.coords;
      setLocation({
        latitude: cordenate.latitude,
        longitude: cordenate.longitude,
      });
      console.log(cordenate.latitude);
    })();
  }, []);
  console.log(location);

  if (errorMsg) {
    alert('Eita, precisamos de acesso a sua localização...');
    return;
  }

  function handleNextStep() {
    navigation.navigate('OrphanageData', { position });
  }
  function handleSelectMapPosition(event: MapEvent) {
    setPosition(event.nativeEvent.coordinate);
  }

  if (location.latitude === 0) {
    return (
      <View style={styles.loading}>
        <Text>Carregando sua localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.052,
          longitudeDelta: 0.052,
        }}
        style={styles.mapStyle}
        onPress={handleSelectMapPosition}
      >
        {position.latitude !== 0 && (
          <Marker
            icon={mapMarkerImg}
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          />
        )}
      </MapView>
      {position.latitude !== 0 && (
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </RectButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    position: 'relative',
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  },
});
