import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GoogleSignInButtonProps {
  onSignInSuccess?: (user: any) => void;
  onSignInError?: (error: string) => void;
}

export default function GoogleSignInButton({ 
  onSignInSuccess, 
  onSignInError 
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await GoogleSignInService.signIn();
      
      if (result.type === 'success') {
        console.log('Sign in successful:', result.data);
        onSignInSuccess?.(result.data);
      } else {
        console.log('Sign in cancelled');
        onSignInError?.('Sign in was cancelled');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      Alert.alert('Sign In Error', error.message);
      onSignInError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.buttonText}>
          {isLoading ? 'Signing In...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    backgroundColor: '#99C6F0',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  googleIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 