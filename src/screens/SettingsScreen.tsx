import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function SettingsScreen() {
  const [advancedMode, setAdvancedMode] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const value = await AsyncStorage.getItem('advancedMode');
      setAdvancedMode(value === '1');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleAdvancedModeChange = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('advancedMode', value ? '1' : '0');
      setAdvancedMode(value);
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('错误', '保存设置失败');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      '确认退出',
      '确定要退出登录吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('hfs_token');
              navigation.navigate('Login');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('错误', '退出登录失败');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>高级设置</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <Text style={styles.settingTitle}>高级模式</Text>
            <Switch
              value={advancedMode}
              onValueChange={handleAdvancedModeChange}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={advancedMode ? '#1a73e8' : '#f4f3f4'}
            />
          </View>
          <Text style={styles.settingStatus}>
            当前状态：
            <Text style={{ color: advancedMode ? '#4CAF50' : '#f44336' }}>
              {advancedMode ? '已开启' : '未开启'}
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>账号</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  settingItem: {
    marginBottom: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingStatus: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
