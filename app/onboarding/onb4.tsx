import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Onboarding4() {
  const router = useRouter();
  // Temporary bypass function for development
  const handleTempBypass = () => {
    console.log('Temporarily bypassing authentication');
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/Logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>You&apos;re All Set!</Text>
      <Text style={styles.subtitle}>Let&apos;s help you stay connected securely.</Text>
      
      {/* Temporary bypass button for development */}
      <TouchableOpacity style={styles.button} onPress={handleTempBypass}>
            <Text style={styles.buttonText}>Login with Google</Text>
          </TouchableOpacity>
          <Text style={styles.progress}>4 / 4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#ffffff' },  image: { width: '80%', height: 250, marginBottom: 30 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#444', textAlign: 'center', marginVertical: 10 },
  progress: { fontSize: 14, color: '#aaa', marginVertical: 10 },
  button: {
    backgroundColor: '#72A9D4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
