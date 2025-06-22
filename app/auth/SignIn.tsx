import { UserContext } from '@/context/UserContext';
import { useConvex } from 'convex/react';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { Alert, Image, Text, View, } from 'react-native';
import { api } from '../../convex/_generated/api';
import { auth } from '../../services/FirebaseConfig';
import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
import { styles } from './SignInUpButton.styles';

export default function SignIn() {
    const router = useRouter();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, setUser } = useContext(UserContext);
    const convex = useConvex();
    
    const onSignIn = () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                const userData = await convex.query(api.Users.GetUserByEmail, {
                    email: email
                });

                console.log(userData);
                setUser(userData);
                router.replace('/(tabs)/home');
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                Alert.alert('Incorrect Email or Password', "Please enter correct email and password.");
            });
    }
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />
            <Text style={styles.title}>Welcome Back 👋</Text>

            <View style={styles.container}>
                <AuthInput placeholder={"Email"} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>
                <AuthInput placeholder={"Password"} password={true} onChangeText={setPassword} autoCapitalize="none" keyboardType="default"/>
                <Button title="Sign In" onPress={() => onSignIn()} />

                <Text style={styles.smallText}>Don&apos;t have an account?  </Text>
                <Link href={'/auth/SignUp'}>
                    <Text style={styles.smallTextUnderline}>Create New Account</Text>
                </Link>
               
            </View>
        </View>
    )
}