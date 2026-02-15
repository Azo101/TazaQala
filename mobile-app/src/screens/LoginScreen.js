import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { colors } from '../theme';

const LoginScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!selectedRole) return;
    
    switch (selectedRole) {
      case 'admin':
        navigation.replace('AdminDashboard');
        break;
      case 'driver':
        navigation.replace('DriverDashboard');
        break;
      case 'resident':
        navigation.replace('ResidentDashboard');
        break;
    }
  };

  const RoleCard = ({ role, title, icon, description }) => (
    <TouchableOpacity
      style={[
        styles.roleCard,
        selectedRole === role && styles.roleCardSelected,
      ]}
      onPress={() => setSelectedRole(role)}
    >
      <Text style={styles.roleIcon}>{icon}</Text>
      <Text style={styles.roleTitle}>{title}</Text>
      <Text style={styles.roleDescription}>{description}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>📍</Text>
          <Text style={styles.logoText}>Taza qala</Text>
        </View>
        <Text style={styles.subtitle}>Система отслеживания мусоровозов</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Выберите роль</Text>
        <View style={styles.rolesContainer}>
          <RoleCard
            role="admin"
            title="Администратор"
            icon="👨‍💼"
            description="Управление системой"
          />
          <RoleCard
            role="driver"
            title="Водитель"
            icon="🚛"
            description="Управление маршрутом"
          />
          <RoleCard
            role="resident"
            title="Житель"
            icon="🏠"
            description="Создание заказов"
          />
        </View>

        {selectedRole && (
          <View style={styles.loginForm}>
            <TextInput
              style={styles.input}
              placeholder="Логин"
              placeholderTextColor={colors.placeholder}
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor={colors.placeholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Войти</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  rolesContainer: {
    gap: 15,
    marginBottom: 30,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#eef2ff',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  roleIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginForm: {
    gap: 15,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;




