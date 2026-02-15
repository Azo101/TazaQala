import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '../theme';
import MetricCard from '../components/MetricCard';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const metrics = [
    { title: 'Всего заказов', value: '6', subtitle: '2 выполнено', icon: '📦' },
    { title: 'Активные мусоровозы', value: '2/4', subtitle: 'В работе сейчас', icon: '🚛' },
    { title: 'Общая выручка', value: '4 500 ₸', subtitle: 'Средний чек: 2 250 ₸', icon: '💰' },
    { title: 'Ожидают выполнения', value: '2', subtitle: '2 в процессе', icon: '⏰' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </View>

      <TouchableOpacity
        style={styles.mapCard}
        onPress={() => navigation.navigate('MapScreen')}
      >
        <View style={styles.mapCardHeader}>
          <Text style={styles.mapCardTitle}>Карта мусоровозов</Text>
          <Text style={styles.mapCardIcon}>🗺️</Text>
        </View>
        <Text style={styles.mapCardDescription}>
          Отслеживание местоположения всех мусоровозов в реальном времени
        </Text>
        <View style={styles.mapPreview}>
          <Text style={styles.mapPreviewText}>Нажмите для просмотра карты</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate('OrdersScreen')}
      >
        <Text style={styles.actionCardIcon}>📋</Text>
        <View style={styles.actionCardContent}>
          <Text style={styles.actionCardTitle}>Управление заказами</Text>
          <Text style={styles.actionCardSubtitle}>Просмотр и управление всеми заказами</Text>
        </View>
        <Text style={styles.actionCardArrow}>→</Text>
      </TouchableOpacity>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Статистика по заказам</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Всего заказов:</Text>
          <Text style={styles.statsValue}>6</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Выполнено:</Text>
          <Text style={[styles.statsValue, { color: colors.primary }]}>2</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>В процессе:</Text>
          <Text style={[styles.statsValue, { color: colors.primary }]}>2</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Ожидают:</Text>
          <Text style={[styles.statsValue, { color: colors.error }]}>2</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 15,
  },
  mapCard: {
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
  mapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  mapCardIcon: {
    fontSize: 24,
  },
  mapCardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  mapPreview: {
    height: 200,
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  mapPreviewText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  actionCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionCardIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  actionCardContent: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  actionCardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionCardArrow: {
    fontSize: 24,
    color: colors.primary,
  },
  statsCard: {
    backgroundColor: colors.surface,
    margin: 15,
    marginBottom: 30,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});

export default AdminDashboard;




