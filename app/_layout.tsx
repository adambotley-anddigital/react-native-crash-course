import { Stack } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'

import '../global.css'

const HeaderLogout = () => {
  const { user, logout } = useAuth()

  return user ? (
    <TouchableOpacity className={styles.logoutButton} onPress={logout}>
      <Text className={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  ) : null
}

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ff8c00',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerRight: () => <HeaderLogout />,
          contentStyle: {
            paddingHorizontal: 10,
            paddingTop: 10,
            backgroundColor: '#ffffff',
          },
        }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="notes" options={{ headerTitle: 'Notes' }} />
        <Stack.Screen name="auth" options={{ headerTitle: 'Login' }} />
      </Stack>
    </AuthProvider>
  )
}

const styles = {
  logoutButton: 'mr-4 py-2 px-4 bg-red-500 rounded-md',
  logoutText: 'color-white font-bold',
}

export default RootLayout
