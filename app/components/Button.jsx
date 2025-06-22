import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from './components.styles.ts';

export default function Button({title, onPress}) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}