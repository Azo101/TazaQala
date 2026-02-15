import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme';

const DriverDashboard = ({ navigation }) => {
  const currentOrder = {
    id: 'ord-1',
    customer: 'Айгуль Нурланова',
    address: 'ул. Жамбыла 123, кв. 45',
    time: '09:00',
    status: 'В процессе',
    fuelLevel: 75,
  };

  const upcomingOrders = [
    { id: 'ord-2', customer: 'Нурлан Касымов', address: 'ул. Абая 45', time: '11:00' },
    { id: 'ord-3', customer: 'Мария Петрова', address: 'пр. Райымбека 78', time: '14:00' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Добро пожаловать!</Text>
        <Text style={styles.driverName}>Алексей Иванов</Text>
        <Text style={styles.truckId}>Мусоровоз: TQ-001</Text>
      </View>

      <View style={styles.fuelCard}>
        <Text style={styles.fuelTitle}>Уровень бензина</Text>
        <View style={styles.fuelBarContainer}>
          <View style={[styles.fuelBar, { width: `${currentOrder.fuelLevel}%`, backgroundColor: currentOrder.fuelLevel > 30 ? colors.success : currentOrder.fuelLevel > 15 ? colors.warning : colors.error }]} />
        </View>
        <Text style={styles.fuelPercentage}>{currentOrder.fuelLevel}%</Text>
      </View>

      <View style={styles.currentOrderCard}>
        <Text style={styles.sectionTitle}>Текущий заказ</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Заказ #{currentOrder.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: '#eef2ff' }]}>
            <Text style={[styles.statusText, { color: colors.primary }]}>
              {currentOrder.status}
            </Text>
          </View>
        </View>
        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailIcon}>👤</Text>
          <Text style={styles.orderDetailText}>{currentOrder.customer}</Text>
        </View>
        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailIcon}>📍</Text>
          <Text style={styles.orderDetailText}>{currentOrder.address}</Text>
        </View>
        <View style={styles.orderDetail}>
          <Text style={styles.orderDetailIcon}>⏰</Text>
          <Text style={styles.orderDetailText}>{currentOrder.time}</Text>
        </View>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => navigation.navigate('MapScreen')}
        >
          <Text style={styles.mapButtonText}>Открыть карту</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.upcomingSection}>
        <Text style={styles.sectionTitle}>Предстоящие заказы</Text>
        {upcomingOrders.map((order) => (
          <View key={order.id} style={styles.upcomingOrderCard}>
            <View style={styles.upcomingOrderHeader}>
              <Text style={styles.upcomingOrderId}>Заказ #{order.id}</Text>
              <Text style={styles.upcomingOrderTime}>{order.time}</Text>
            </View>
            <Text style={styles.upcomingOrderCustomer}>{order.customer}</Text>
            <Text style={styles.upcomingOrderAddress}>{order.address}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 15,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  truckId: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  fuelCard: {
    backgroundColor: colors.surface,
    margin: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  fuelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  fuelBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  fuelBar: {
    height: '100%',
    borderRadius: 6,
  },
  fuelPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  currentOrderCard: {
    backgroundColor: colors.surface,
    margin: 15,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDetailIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  orderDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  mapButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  upcomingSection: {
    margin: 15,
    marginTop: 0,
  },
  upcomingOrderCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  upcomingOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  upcomingOrderId: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  upcomingOrderTime: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  upcomingOrderCustomer: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  upcomingOrderAddress: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default DriverDashboard;




