import { useMutation } from 'convex/react';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { Alert, Image, Text, View, } from 'react-native';
import { UserContext } from '../../context/UserContext';
import { api } from '../../convex/_generated/api';
import { auth } from '../../services/FirebaseConfig';
import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
import { styles } from './SignInUpButton.styles';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { user, setUser } = useContext(UserContext);
    const createNewUser = useMutation(api.Users.CreateNewUser);
    const router = useRouter();

    const onSignUp = () => {
        if(!name || !email || !phone || !password) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        //const auth = getAuth(app);
        createUserWithEmailAndPassword(auth, email, password)
            .then(async(userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(user);
                if (user) {
                    const result = await createNewUser({
                        name: name,
                        email: email,
                        phone: phone,
                    });
                    
                    console.log(result);
                    setUser(result);
                    // Navigate to preferences for new account setup
                    router.replace('/preferences');
                }
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                // ..
        });
    }
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />
            <Text style={styles.title}>Don't Be a Ghost 👻</Text>

            <View style={styles.container}>
                <AuthInput placeholder={"Full Name"} onChangeText={setName} autoCapitalize="words" keyboardType="default"/>
                <AuthInput placeholder={"Email"} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>
                <AuthInput placeholder={"Phone Number"} onChangeText={setPhone} autoCapitalize="none" keyboardType="phone-pad"/>
                <AuthInput placeholder={"Password"} password={true} onChangeText={setPassword} autoCapitalize="none" keyboardType="default"/>
                <Button title="Create Account" onPress={() => onSignUp()} />

                <Text style={styles.smallText}>Already have an account?</Text>
                <Link href={'/auth/SignIn'}>
                    <Text style={styles.smallTextUnderline}>Sign In</Text>
                </Link>
            </View>
        </View>
    )
}