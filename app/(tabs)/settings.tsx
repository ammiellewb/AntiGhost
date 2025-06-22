import { auth } from "@/services/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { UserContext } from "../../context/UserContext";
import { styles } from "./styles/settings.styles";
// import { router } from "expo-router";
// import { styles } from "./styles/settings.styles";
// import { GoogleSignInService } from "../auth/googleSignIn";

export default function SettingsScreen() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error: any) {
              Alert.alert("Error", "Failed to sign out: " + error.message);
            }
          },
        },
      ]
    );
  };

  const handleEditPreferences = () => {
    router.push('/preferences');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.settingsList}>
        <TouchableOpacity style={styles.settingItem} onPress={handleEditPreferences}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Edit Preferences</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="shield-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="help-circle-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={24} color="#DB4437" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
