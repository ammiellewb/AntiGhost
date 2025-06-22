import React from 'react';
import { TextInput } from 'react-native';
import { styles } from './components.styles.ts';

export default function AuthInput({placeholder, password=false, onChangeText, autoCapitalize, keyboardType}) {

    return (
        <TextInput 
            placeholder={placeholder} 
            style={styles.input} 
            secureTextEntry={password}
            onChangeText={onChangeText}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
        />
    )
}