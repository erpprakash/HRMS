import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import customFetch from "./utils/CustomFetch";
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handlePasswordReset = async () => {
        try {
            const response = await customFetch.post('/forgot-password', { email });
            Alert.alert('Success', 'Password reset link has been sent to your email.');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Password reset failed:', error);
            Alert.alert('Failed', error?.response?.data?.error || 'An error occurred. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="tomato" />
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Icon name="lock-closed-outline" style={styles.icon} />
                        <Text style={styles.headerText}>Forgot Password</Text>
                    </View>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backText}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    icon: {
        fontSize: 80,
        color: "tomato",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "tomato",
        marginTop: 10,
    },
    formContainer: {
        width: "100%",
    },
    input: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "tomato",
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    backText: {
        color: "tomato",
        fontSize: 16,
        marginTop: 20,
    },
});