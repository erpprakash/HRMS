import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import customFetch from './utils/CustomFetch';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const userData = {
            email: email,
        };
        console.log(userData)
        try {
            const response = await customFetch.post('/forgot-password', userData);
            if (response.status >= 200 && response.status <= 299) {
              
                setEmail('')
            }
        } catch (error) {
            console.log(error);

        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.formContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" style={styles.backIcon} />
                    </TouchableOpacity>
                    <Icon name="lock-closed-outline" style={styles.headerIcon} />
                    <Text style={styles.headerText}>Forgot Password</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
               
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 10,
    },
    backIcon: {
        fontSize: 24,
        color: "tomato",
    },
    headerIcon: {
        fontSize: 35,
        color: "tomato",
        marginLeft: 50,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: "tomato",
        marginLeft: 10,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    textInput: {
        height: 55,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 18,
        color: "#333",
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 15,
    },
    button: {
        backgroundColor: 'tomato',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        width: '100%',
        marginBottom: 15,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    backToLoginButton: {
        alignItems: 'center',
        marginTop: 20,
    },
    backToLoginText: {
        color: 'tomato',
        fontSize: 16,
    },
});
