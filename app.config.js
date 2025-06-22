import 'dotenv/config';

export default {
  "expo": {
    "name": "spurhacks",
    "slug": "spurhacks",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/Logo.png",
    "scheme": "spurhacks",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/Logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.spurhacks.app",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      },
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/Logo.png"
    },
    "plugins": [
      "expo-router",
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": process.env.EXPO_PUBLIC_GOOGLE_REVERSED_CLIENT_ID
        }
      ],
      "expo-splash-screen"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "android": {
      "package": "com.spurhacks.app"
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "ce7a4385-8380-4fe8-9734-572b93fbe68e"
      }
    }
  }
}; 