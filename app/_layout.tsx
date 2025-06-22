import { api } from "@/convex/_generated/api";
import { ConvexProvider, ConvexReactClient, useConvex } from "convex/react";
import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { auth } from "../services/FirebaseConfig";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";

const InitialLayout = () => {
  const { user, setUser } = useContext(UserContext);
  const segments = useSegments();
  const router = useRouter();
  const convex = useConvex();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userInfo) => {
      if (userInfo && userInfo.email) {
        const userData = await convex.query(api.Users.GetUserByEmail, {
          email: userInfo.email,
        });
        setUser(userData);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const inTabsGroup = segments[0] === "(tabs)";
    const inAuthGroup = segments[0] === "auth";
    const inPreferences = segments[0] === "preferences";

    if (user && !inTabsGroup && !inAuthGroup && !inPreferences) {
      router.replace("/(tabs)/home");
    } else if (!user && inTabsGroup) {
      router.replace("/");
    }
  }, [user, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default function RootLayout() {
  const convex = new ConvexReactClient(
    process.env.EXPO_PUBLIC_CONVEX_URL!,
    {
      unsavedChangesWarning: false,
    }
  );

  const [user, setUser] = useState(null);

  return (
    <ConvexProvider client={convex}>
      <UserContext.Provider value={{ user, setUser }}>
        <InitialLayout />
      </UserContext.Provider>
    </ConvexProvider>
  );
}