import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {fetchHFSApi} from '../utils/api';
import {HFS_APIs} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as React from 'react';

enum LoginRoleType {
  parent = 2,
  student = 1,
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(LoginRoleType.parent.toString());
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    checkExistingToken();
  }, []);

  const checkExistingToken = async () => {
    try {
      const token = await AsyncStorage.getItem('hfs_token');
      if (token) {
        const response = await fetchHFSApi(HFS_APIs.userSnapshot, {
          token: token,
          method: 'GET',
        });

        if (response.ok) {
          Alert.alert('提示', '你已经登录过了');
          navigation.navigate('Home');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('提示', '你还没写账号/密码呢！！！');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchHFSApi(HFS_APIs.login, {
        method: 'POST',
        token: '114514',
        postBody: {
          loginName: email,
          password: btoa(password),
          roleType: role,
          loginType: 1,
          rememberMe: 2,
        },
      });

      if (!response.ok) {
        Alert.alert('错误', '登录失败，原因：' + response.errMsg);
        return;
      }

      await AsyncStorage.setItem('hfs_token', response.payload.token);
      Alert.alert('成功', '登录成功 进入新世界');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('错误', '登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <View style={styles.content}>
          <Text style={styles.title}>登录</Text>
          <Text style={styles.subtitle}>欢迎使用好分数</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>邮箱</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="输入邮箱"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>密码</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="输入密码"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>角色</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={role}
                  onValueChange={itemValue => setRole(itemValue)}
                  style={styles.picker}>
                  <Picker.Item
                    label="家长"
                    value={LoginRoleType.parent.toString()}
                  />
                  <Picker.Item
                    label="学生"
                    value={LoginRoleType.student.toString()}
                  />
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? '登录中...' : '登录'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#93b7e8',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
