import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamListBase} from '@react-navigation/native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ExamScreen from './src/screens/ExamScreen';
import LoginScreen from './src/screens/LoginScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('hfs_token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    // 可以在这里添加一个加载画面
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Home' : 'Login'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a73e8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: '登录',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'HFS NEXT',
            headerRight: () => <SettingsButton />,
          }}
        />
        <Stack.Screen
          name="Exam"
          component={ExamScreen}
          options={{title: '考试详情'}}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: '设置'}}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

// 设置按钮组件
function SettingsButton() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Settings')}
      style={{marginRight: 10}}>
      <Icon name="settings" size={24} color="#fff" />
    </TouchableOpacity>
  );
}
