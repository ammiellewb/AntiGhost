import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 60,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4285F4',
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
  smallText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },
  smallTextUnderline: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
}); 