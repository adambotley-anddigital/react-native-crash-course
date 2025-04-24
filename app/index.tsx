import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import PostItImage from '@/assets/images/post-it.png'
import { useAuth } from '@/contexts/AuthContext'

const HomeScreen = () => {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/notes')
    }
  }, [user, loading])

  if (loading) {
    return (
      <View style={styles.centeredContainter}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Image source={PostItImage} style={styles.image} />
      <Text style={styles.title}>Welcome to Notes App</Text>
      <Text style={styles.subtitle}>Capture your thoughts anytime, anywhere</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push('/notes')
        }}>
        <Text className="bg-pink-500">Get Started</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredContainter: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
})

export default HomeScreen
