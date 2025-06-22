import { useConvex } from 'convex/react';
import { Link, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { api } from '../convex/_generated/api';
import { auth } from '../services/FirebaseConfig';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    image: require('../assets/images/onboarding1.png'),
    title: 'Reconnecting Made Effortless',
    subtitle: 'Never Lose Touch. Effortlessly.',
  },
  {
    id: '2',
    image: require('../assets/images/onboarding2.png'),
    title: 'Your Relationships, Simplified and Intentional',
    subtitle: 'Deepen Your Bonds. On Your Terms.',
  },
  {
    id: '3',
    image: require('../assets/images/onboarding3.png'),
    title: 'The Smart Way To Stay Connected',
    subtitle: 'Stay Connected. The Smart, Private Way.',
  },
];

export default function Index() {
  const router = useRouter();
  const context = useContext(UserContext);
  const user = context?.user;
  const setUser = context?.setUser;
  const convex = useConvex();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userInfo) => {
      if (userInfo?.email && setUser) {
        console.log(userInfo.email);
        const userData = await convex.query(api.Users.GetUserByEmail, {
          email: userInfo.email,
        });
        if (userData) {
          console.log(userData);
          setUser(userData);
          router.replace("/(tabs)/home");
        }
      } else {
        setUser?.(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={SLIDES}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <Text style={styles.progress}>{`${currentIndex + 1} / ${SLIDES.length}`}</Text>
      <Text style={styles.appTitle}>AntiGhost</Text>
      <Text style={styles.appSubtitle}>Keep relationships alive</Text>

      <View style={styles.signInSection}>
        <Text style={styles.signInText}>
          Sign in to continue or create a new account
        </Text>

        <View style={styles.buttonContainer}>
          <Link href="/auth/SignIn" asChild>
            <TouchableOpacity style={styles.signInButton}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/auth/SignUp" asChild>
            <TouchableOpacity style={styles.signUpButton}>
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 50,
  },
  slide: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
  progress: {
    textAlign: 'center',
    fontSize: 14,
    color: '#aaa',
    marginVertical: 10,
    marginBottom: 40,
  },
  signInSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  signInText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#6A9FD1',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  appTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
});
