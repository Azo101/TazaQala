import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';

import LoginScreen from './src/screens/LoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import DriverDashboard from './src/screens/DriverDashboard';
import ResidentDashboard from './src/screens/ResidentDashboard';
import MapScreen from './src/screens/MapScreen';
import OrdersScreen from './src/screens/OrdersScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AdminDashboard" 
            component={AdminDashboard}
            options={{ title: 'Админ панель' }}
          />
          <Stack.Screen 
            name="DriverDashboard" 
            component={DriverDashboard}
            options={{ title: 'Панель водителя' }}
          />
          <Stack.Screen 
            name="ResidentDashboard" 
            component={ResidentDashboard}
            options={{ title: 'Панель жителя' }}
          />
          <Stack.Screen 
            name="MapScreen" 
            component={MapScreen}
            options={{ title: 'Карта мусоровозов' }}
          />
          <Stack.Screen 
            name="OrdersScreen" 
            component={OrdersScreen}
            options={{ title: 'Заказы' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}




