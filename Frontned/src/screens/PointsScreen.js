import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import SectionTitle from '../components/SectionTitle';
import { fallbackCenters, getRecyclingCenters } from '../services/centerService';
import { styles } from '../styles/appStyles';
import { calculateDistanceKm, formatDistance } from '../utils/geo';

export default function PointsScreen() {
  const [centers, setCenters] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [centerError, setCenterError] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingCenters, setIsLoadingCenters] = useState(true);

  const sortedPoints = useMemo(() => {
    if (!userLocation) return centers;

    return centers
      .map((point) => {
        const distanceKm = calculateDistanceKm(userLocation, point);
        return {
          ...point,
          distanceKm,
          distanceLabel: formatDistance(distanceKm)
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [centers, userLocation]);

  useEffect(() => {
    loadRecyclingCenters();
    requestUserLocation();
  }, []);

  async function loadRecyclingCenters() {
    setIsLoadingCenters(true);
    setCenterError('');

    try {
      const serverCenters = await getRecyclingCenters();
      setCenters(serverCenters.length ? serverCenters : fallbackCenters);
    } catch (error) {
      setCenters(fallbackCenters);
      setCenterError(error.message || 'No se pudieron cargar los puntos verdes del servidor.');
    } finally {
      setIsLoadingCenters(false);
    }
  }

  async function requestUserLocation() {
    setIsLoadingLocation(true);
    setLocationError('');

    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      setLocationError('Activa el permiso de ubicacion para ordenar los puntos por cercania.');
      setIsLoadingLocation(false);
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude
    });
    setIsLoadingLocation(false);
  }

  function openInGoogleMaps(point) {
    const url = `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`;
    Linking.openURL(url);
  }

  return (
    <View>
      <SectionTitle eyebrow="Ubicacion" title="Puntos verdes cercanos" />
      {isLoadingCenters ? (
        <View style={styles.locationStatusCard}>
          <MaterialCommunityIcons color="#2E7D5B" name="timer-sand" size={24} />
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>Cargando puntos verdes</Text>
            <Text style={styles.listText}>Consultando centros de reciclaje en el servidor.</Text>
          </View>
        </View>
      ) : null}

      {centerError ? (
        <View style={styles.scanErrorCard}>
          <MaterialCommunityIcons color="#B94A48" name="alert-circle-outline" size={24} />
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>Aviso de puntos verdes</Text>
            <Text style={styles.listText}>{centerError}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.locationStatusCard}>
        <MaterialCommunityIcons
          color={userLocation ? '#2E7D5B' : '#D8902A'}
          name={userLocation ? 'crosshairs-gps' : 'map-marker-question-outline'}
          size={24}
        />
        <View style={styles.listBody}>
          <Text style={styles.listTitle}>
            {userLocation ? 'Ubicacion detectada' : 'Ubicacion del usuario'}
          </Text>
          <Text style={styles.listText}>
            {userLocation
              ? 'Los puntos verdes estan ordenados del mas cercano al mas lejano.'
              : locationError || 'Buscando tu ubicacion para calcular distancias.'}
          </Text>
        </View>
      </View>

      {!userLocation ? (
        <TouchableOpacity
          disabled={isLoadingLocation}
          onPress={requestUserLocation}
          style={[styles.primaryButton, isLoadingLocation && styles.primaryButtonDisabled]}
        >
          <MaterialCommunityIcons color="#FFFFFF" name={isLoadingLocation ? 'timer-sand' : 'crosshairs-gps'} size={22} />
          <Text style={styles.primaryButtonText}>
            {isLoadingLocation ? 'Obteniendo ubicacion...' : 'Actualizar ubicacion'}
          </Text>
        </TouchableOpacity>
      ) : null}

      <FlatList
        data={sortedPoints}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.placeCard}>
            <View style={styles.placeHeader}>
              <View style={styles.mapPin}>
                <MaterialCommunityIcons color="#FFFFFF" name="map-marker" size={22} />
              </View>
              <View style={styles.listBody}>
              <Text style={styles.listTitle}>{item.name}</Text>
                <Text style={styles.listText}>{item.address}</Text>
                {item.schedule ? <Text style={styles.listText}>Horario: {item.schedule}</Text> : null}
              </View>
              <Text style={styles.distance}>{item.distanceLabel || 'GPS'}</Text>
            </View>
            <Text style={styles.accepts}>
              Recibe: {item.accepts.length ? item.accepts.join(', ') : 'Materiales varios'}
            </Text>
            <TouchableOpacity onPress={() => openInGoogleMaps(item)} style={styles.mapButton}>
              <MaterialCommunityIcons color="#2E7D5B" name="map-search-outline" size={20} />
              <Text style={styles.mapButtonText}>Ver en mapa</Text>
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}
