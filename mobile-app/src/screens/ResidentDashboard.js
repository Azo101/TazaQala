import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors } from '../theme';

const ResidentDashboard = () => {
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  const myOrders = [
    {
      id: 'ord-1',
      address: 'ул. Жамбыла 123, кв. 45',
      date: '18 января',
      time: '09:00',
      status: 'В процессе',
      price: '2 500 ₸',
    },
    {
      id: 'ord-2',
      address: 'ул. Абая 45, кв. 12',
      date: '20 января',
      time: '11:00',
      status: 'Предстоящий',
      price: '2 000 ₸',
    },
  ];

  const handleCreateOrder = () => {
    if (!address || !date || !time) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }
    Alert.alert('Успешно', 'Заказ создан! Ожидайте подтверждения.');
    setAddress('');
    setDate('');
    setTime('');
    setNote('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Добро пожаловать!</Text>
        <Text style={styles.userName}>Житель</Text>
      </View>

      <View style={styles.createOrderCard}>
        <Text style={styles.sectionTitle}>Создать заказ</Text>
        
        <Text style={styles.inputLabel}>Адрес *</Text>
        <TextInput
          style={styles.input}
          placeholder="ул. Примерная 123, кв. 45"
          placeholderTextColor={colors.placeholder}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.inputLabel}>Дата *</Text>
        <TextInput
          style={styles.input}
          placeholder="20 января"
          placeholderTextColor={colors.placeholder}
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.inputLabel}>Время *</Text>
        <TextInput
          style={styles.input}
          placeholder="09:00"
          placeholderTextColor={colors.placeholder}
          value={time}
          onChangeText={setTime}
        />

        <Text style={styles.inputLabel}>Примечание</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Большой объем мусора, требуется грузовик"
          placeholderTextColor={colors.placeholder}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.createButton} onPress={handleCreateOrder}>
          <Text style={styles.createButtonText}>Создать заказ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ordersSection}>
        <Text style={styles.sectionTitle}>Мои заказы</Text>
        {myOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Заказ #{order.id}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: order.status === 'В процессе' ? '#eef2ff' : '#fef3c7' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: order.status === 'В процессе' ? colors.primary : colors.warning }
                ]}>
                  {order.status}
                </Text>
              </View>
            </View>
            <View style={styles.orderDetail}>
              <Text style={styles.orderDetailIcon}>📍</Text>
              <Text style={styles.orderDetailText}>{order.address}</Text>
            </View>
            <View style={styles.orderDetail}>
              <Text style={styles.orderDetailIcon}>📅</Text>
              <Text style={styles.orderDetailText}>{order.date} в {order.time}</Text>
            </View>
            <View style={styles.orderPrice}>
              <Text style={styles.priceLabel}>Стоимость:</Text>
              <Text style={styles.priceValue}>{order.price}</Text>
            </View>
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
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  createOrderCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ordersSection: {
    margin: 15,
    marginTop: 0,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    marginBottom: 8,
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
  orderPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default ResidentDashboard;




