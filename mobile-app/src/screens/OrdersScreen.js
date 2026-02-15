import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme';

const OrdersScreen = () => {
  const [activeFilter, setActiveFilter] = useState('in_progress');

  const orders = [
    {
      id: 'ord-1',
      customer: 'Айгуль Нурланова',
      status: 'in_progress',
      address: 'ул. Жамбыла 123, кв. 45',
      date: '18 января в 09:00',
      paymentMethod: 'Оплата картой',
      note: 'Большой объем мусора',
      truck: 'TQ-001',
      driver: 'Алексей Иванов',
      price: '2 500 ₸',
    },
    {
      id: 'ord-2',
      customer: 'Нурлан Касымов',
      status: 'upcoming',
      address: 'ул. Абая 45, кв. 12',
      date: '20 января в 11:00',
      paymentMethod: 'Наличные',
      truck: 'TQ-002',
      driver: 'Марат Султанов',
      price: '2 000 ₸',
    },
    {
      id: 'ord-3',
      customer: 'Мария Петрова',
      status: 'completed',
      address: 'пр. Райымбека 78, кв. 5',
      date: '15 января в 14:00',
      paymentMethod: 'Оплата картой',
      truck: 'TQ-001',
      driver: 'Алексей Иванов',
      price: '2 250 ₸',
    },
  ];

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'in_progress') return order.status === 'in_progress';
    if (activeFilter === 'upcoming') return order.status === 'upcoming';
    if (activeFilter === 'completed') return order.status === 'completed';
    return true;
  });

  const getStatusText = (status) => {
    switch (status) {
      case 'in_progress': return 'В процессе';
      case 'upcoming': return 'Предстоящие';
      case 'completed': return 'Выполненные';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return { bg: '#eef2ff', text: colors.primary };
      case 'upcoming': return { bg: '#fef3c7', text: colors.warning };
      case 'completed': return { bg: '#d1fae5', text: colors.success };
      default: return { bg: '#f3f4f6', text: colors.textSecondary };
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'in_progress' && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter('in_progress')}
        >
          <Text style={[
            styles.filterButtonText,
            activeFilter === 'in_progress' && styles.filterButtonTextActive,
          ]}>
            В процессе (2)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'upcoming' && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter('upcoming')}
        >
          <Text style={[
            styles.filterButtonText,
            activeFilter === 'upcoming' && styles.filterButtonTextActive,
          ]}>
            Предстоящие (2)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'completed' && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter('completed')}
        >
          <Text style={[
            styles.filterButtonText,
            activeFilter === 'completed' && styles.filterButtonTextActive,
          ]}>
            Выполненные (2)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ordersList}>
        {filteredOrders.map((order) => {
          const statusStyle = getStatusColor(order.status);
          return (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderId}>Заказ #{order.id}</Text>
              
              <View style={styles.orderDetails}>
                <View style={styles.orderDetailItem}>
                  <Text style={styles.orderDetailIcon}>📍</Text>
                  <Text style={styles.orderDetailText}>{order.address}</Text>
                </View>
                <View style={styles.orderDetailItem}>
                  <Text style={styles.orderDetailIcon}>📅</Text>
                  <Text style={styles.orderDetailText}>{order.date}</Text>
                </View>
                <View style={styles.orderDetailItem}>
                  <Text style={styles.orderDetailIcon}>💳</Text>
                  <Text style={styles.orderDetailText}>{order.paymentMethod}</Text>
                </View>
                {order.note && (
                  <View style={styles.orderDetailItem}>
                    <Text style={styles.orderDetailIcon}>📝</Text>
                    <Text style={styles.orderDetailText}>Примечание: {order.note}</Text>
                  </View>
                )}
                <View style={styles.orderDetailItem}>
                  <Text style={styles.orderDetailIcon}>🚛</Text>
                  <Text style={styles.orderDetailText}>Мусоровоз: {order.truck}</Text>
                </View>
                <View style={styles.orderDetailItem}>
                  <Text style={styles.orderDetailIcon}>👤</Text>
                  <Text style={styles.orderDetailText}>Водитель: {order.driver}</Text>
                </View>
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderPrice}>{order.price}</Text>
                <View style={[styles.paymentBadge, { backgroundColor: '#d1fae5' }]}>
                  <Text style={[styles.paymentText, { color: colors.success }]}>
                    Оплачен
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filters: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  ordersList: {
    padding: 15,
    paddingTop: 0,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderCustomer: {
    fontSize: 20,
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
  orderId: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  orderDetails: {
    gap: 12,
    marginBottom: 16,
  },
  orderDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  orderDetailIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  orderDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  orderPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OrdersScreen;




