import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../theme';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const trucks = [
    {
      id: 'TQ-001',
      driver: 'Алексей Иванов',
      location: { latitude: 43.2220, longitude: 76.8512 },
      status: 'active',
      fuelLevel: 75,
    },
    {
      id: 'TQ-002',
      driver: 'Марат Султанов',
      location: { latitude: 43.2250, longitude: 76.8550 },
      status: 'active',
      fuelLevel: 45,
    },
    {
      id: 'TQ-003',
      driver: 'Дмитрий Ким',
      location: { latitude: 43.2200, longitude: 76.8600 },
      status: 'waiting',
      fuelLevel: 25,
    },
    {
      id: 'TQ-004',
      driver: 'Сергей Петров',
      location: { latitude: 43.2150, longitude: 76.8450 },
      status: 'repair',
      fuelLevel: 90,
    },
  ];

  const bins = [
    { id: 'bin-1', location: { latitude: 43.2230, longitude: 76.8520 }, filled: true },
    { id: 'bin-2', location: { latitude: 43.2260, longitude: 76.8560 }, filled: true },
    { id: 'bin-3', location: { latitude: 43.2210, longitude: 76.8580 }, filled: false },
    { id: 'bin-4', location: { latitude: 43.2240, longitude: 76.8620 }, filled: true },
    { id: 'bin-5', location: { latitude: 43.2170, longitude: 76.8480 }, filled: false },
  ];

  const getTruckColor = (status) => {
    switch (status) {
      case 'active': return colors.primary;
      case 'waiting': return colors.warning;
      case 'repair': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getBinColor = (filled) => {
    return filled ? colors.error : colors.success;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 43.2220,
          longitude: 76.8512,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {bins.map((bin) => (
          <Marker
            key={bin.id}
            coordinate={bin.location}
            pinColor={getBinColor(bin.filled)}
            onPress={() => setSelectedMarker({ type: 'bin', ...bin })}
          >
            <View style={[styles.binMarker, { backgroundColor: getBinColor(bin.filled) }]}>
              <Text style={styles.binMarkerText}>🗑️</Text>
            </View>
          </Marker>
        ))}

        {trucks.map((truck) => (
          <Marker
            key={truck.id}
            coordinate={truck.location}
            onPress={() => setSelectedMarker({ type: 'truck', ...truck })}
          >
            <View style={[styles.truckMarker, { borderColor: getTruckColor(truck.status) }]}>
              <Text style={styles.truckMarkerText}>🚛</Text>
              <View style={[styles.fuelBar, { width: `${truck.fuelLevel}%`, backgroundColor: truck.fuelLevel > 30 ? colors.success : truck.fuelLevel > 15 ? colors.warning : colors.error }]} />
            </View>
          </Marker>
        ))}
      </MapView>

      {selectedMarker && (
        <View style={styles.infoCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedMarker(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          {selectedMarker.type === 'truck' ? (
            <>
              <Text style={styles.infoTitle}>{selectedMarker.id}</Text>
              <Text style={styles.infoText}>Водитель: {selectedMarker.driver}</Text>
              <Text style={styles.infoText}>Статус: {selectedMarker.status === 'active' ? 'Активен' : selectedMarker.status === 'waiting' ? 'Ожидает' : 'Ремонт'}</Text>
              <View style={styles.fuelInfo}>
                <Text style={styles.infoText}>Бензин: {selectedMarker.fuelLevel}%</Text>
                <View style={styles.fuelBarContainer}>
                  <View style={[styles.fuelBarFull, { width: `${selectedMarker.fuelLevel}%`, backgroundColor: selectedMarker.fuelLevel > 30 ? colors.success : selectedMarker.fuelLevel > 15 ? colors.warning : colors.error }]} />
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.infoTitle}>Мусорка #{selectedMarker.id}</Text>
              <Text style={styles.infoText}>
                Статус: {selectedMarker.filled ? 'Полная' : 'Пустая'}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: selectedMarker.filled ? '#fee2e2' : '#d1fae5' }]}>
                <Text style={[styles.statusText, { color: selectedMarker.filled ? colors.error : colors.success }]}>
                  {selectedMarker.filled ? 'Требуется вывоз' : 'В порядке'}
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Легенда</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Активный</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Ожидает</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>Ремонт</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Мусорка (пустая)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>Мусорка (полная)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  truckMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  truckMarkerText: {
    fontSize: 24,
  },
  fuelBar: {
    position: 'absolute',
    bottom: -5,
    left: 5,
    height: 4,
    borderRadius: 2,
  },
  binMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  binMarkerText: {
    fontSize: 16,
  },
  infoCard: {
    position: 'absolute',
    bottom: 100,
    left: 15,
    right: 15,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: 'bold',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  fuelInfo: {
    marginTop: 10,
  },
  fuelBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginTop: 5,
    overflow: 'hidden',
  },
  fuelBarFull: {
    height: '100%',
    borderRadius: 4,
  },
  statusBadge: {
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  legend: {
    position: 'absolute',
    top: 60,
    right: 15,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 150,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default MapScreen;

