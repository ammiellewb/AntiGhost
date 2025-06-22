import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 80,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 60,
    textAlign: 'center',
  },
  signInSection: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#34A853',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tempButton: {
    backgroundColor: '#34A853',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  tempButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 16,
  },
}); 