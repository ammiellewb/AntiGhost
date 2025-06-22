# AntiGhost - Personal Relationship Management (PRM) App

A PRM built with React Native and Expo that revolutionizes how you maintain meaningful connections through intelligent algorithmic prioritization and AI-powered conversation suggestions, proactively identifying at-risk relationships before they fade. \
[![AntiGhost Simulator](https://img.youtube.com/vi/LnOwAl3mIG8/0.jpg)](https://youtu.be/LnOwAl3mIG8)


## Features

- **AI-Powered Reminders**: Get personalized conversation suggestions for contacts you haven't talked to recently
- **Contact Management**: Track your contacts with detailed information and conversation history
- **Smart Prioritization**: Automatically prioritize contacts based on how long it's been since your last conversation
- **Quick Notes**: Add and view conversation notes for each contact
- **Google Sign-In**: Secure authentication using Google Sign-In
- **Real-time Database**: Powered by Convex for seamless data synchronization

## Prerequisites

Before running this app, you'll need to set up the following services:

1. **Perplexity AI API** - For conversation suggestions
2. **Firebase Project** - For authentication
3. **Google Cloud Console** - For Google Sign-In configuration
4. **Convex** - For backend database and real-time functionality

## Environment Setup

### 1. Create Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Perplexity API
EXPO_PUBLIC_PERPLEXITY_API_KEY=your_perplexity_api_key_here

# Google Console API
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Firebase Config
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Convex Config
EXPO_PUBLIC_CONVEX_URL=your_convex_deployment_url_here
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google Sign-In
3. Download the `GoogleService-Info.plist` file and place it in the root directory
4. Copy the configuration values to your `.env` file

### 3. Perplexity AI Setup

1. Sign up for a Perplexity AI account at [Perplexity AI](https://www.perplexity.ai/)
2. Generate an API key from your account settings
3. Add the API key to your `.env` file as `EXPO_PUBLIC_PERPLEXITY_API_KEY`

### 4. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your Firebase project
3. Enable the Google Sign-In API
4. Create OAuth 2.0 credentials for iOS and Android
5. Add the client ID to your `.env` file as `EXPO_PUBLIC_GOOGLE_CLIENT_ID`

### 5. Convex Setup

1. Install Convex CLI globally:
   ```bash
   npm install -g convex
   ```

2. Create a new Convex project:
   ```bash
   npx convex dev
   ```

3. Follow the setup wizard to create your Convex project
4. Copy the deployment URL to your `.env` file as `EXPO_PUBLIC_CONVEX_URL`
5. The Convex functions are already set up in the `convex/` directory

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Run on your preferred platform:

   ```bash
   # iOS
   npx expo run:ios
   
   # Android
   npx expo run:android
   
   # Web
   npx expo start --web
   ```

## Development

This project uses:
- **Expo Router** for navigation
- **Convex** for backend database and real-time functionality
- **Firebase** for authentication
- **Perplexity AI** for conversation suggestions
- **React Native Google Sign-In** for authentication

### Convex Functions

The app includes several Convex functions for contact management:
- `getAllContacts` - Retrieve all contacts
- `getRecentNotes` - Get recent conversation notes
- `updateLastContacted` - Update last contact date
- `updateLastConversation` - Add conversation notes

These functions are located in the `convex/` directory and provide real-time data synchronization.

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- All API keys are prefixed with `EXPO_PUBLIC_` to make them available in the client-side code
- For production, consider using a more secure method for API key management
- Convex and Firebase provide built-in security rules and authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
