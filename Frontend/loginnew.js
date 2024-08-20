import React, { useRef, useEffect, useState, useContext } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    Animated, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, Alert, ImageBackground, Image
} from 'react-native';
import customFetch from "./utils/CustomFetch";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../ContextAPI/AppContext';
import { DataContext } from '../ContextAPI/DataContext';
import Colour from '../Constants/Colour'

export default function LoginNew() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { handleLogin } = useContext(DataContext);
    const navigation = useNavigation();
    const { sharedState, setSharedState } = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false);

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = async () => {
        const userData = { email: formData.email, password: formData.password };

        try {
            const response = await customFetch.post('/login', userData);
            const token = response.data;
            await AsyncStorage.setItem('token', token);
            handleLogin(token);
            navigation.navigate('Home');
            setSharedState(token);
        } catch (error) {
            console.error('Login failed:', error);
            Alert.alert('Login Failed', error?.response?.data?.error || 'An error occurred. Please try again.');
        }
    };


    const moveAnimation = useRef(new Animated.Value(0)).current;
    const [doorLocked, setDoorLocked] = useState(true);

    useEffect(() => {
        animatePerson();
    }, []);

    const animatePerson = () => {
        Animated.timing(moveAnimation, {
            toValue: 1,
            duration: 4500,
            useNativeDriver: true,
        }).start(() => {
            setDoorLocked(false);
        });
    };

    const personPosition = moveAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [130, 20],
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    // source={require("./Images/backgroundGradient.png")}
                    style={styles.backgroundImage}
                >
                    <View style={styles.container}>
                        <View style={styles.container1}>
                            <Image style={styles.image1} source={require("./Images/LockDoor.png")} />
                            <Animated.Image
                                style={[
                                    styles.image2,
                                    { transform: [{ translateX: personPosition }] },
                                    !doorLocked && { opacity: 0 },
                                ]}
                                source={require("./Images/BlueMan.png")}
                            />
                            <Animated.Image
                                style={[
                                    styles.image2,
                                    { transform: [{ translateX: personPosition }] },
                                    doorLocked && { opacity: 0 },
                                ]}
                                source={require("./Images/TomatoMan.png")}
                            />
                            <Image
                                style={styles.image3}
                                source={doorLocked ? require("./Images/BlueDot.png") : require("./Images/TomatoDot.png")}
                            />
                        </View>
                        <View style={styles.container2}>
                            <Text style={styles.loginText}>Login Details</Text>
                            <TextInput
                                onChangeText={(text) => handleChange('email', text)}
                                style={styles.textInput}
                                value={formData.email}
                                placeholder="Enter user/email"
                                placeholderTextColor="#888"
                            />
                            <TextInput
                                onChangeText={(text) => handleChange('password', text)}
                                style={styles.textInput}
                                value={formData.password}
                                placeholder="Enter password"
                                secureTextEntry={true}
                                placeholderTextColor="#888"
                            />
                        </View>
                        <View style={styles.container4}>
                            <Text onPress={() => navigation.navigate('Signin')} style={styles.text}>Forget password?</Text>
                        </View>
                        <View style={styles.container5}>

                            {/* <TouchableOpacity onPress={navigation.navigate('Home')} style={styles.button}> */}
                                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container3}>
                            <Image style={styles.image4} source={require("./Images/Tomato.png")} />
                        </View>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        // backgroundColor: '#f5f5f5',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container1: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container2: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    container3: {
        flex: 3,
        justifyContent: 'flex-end',
    },
    container4: {
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        paddingHorizontal: 30,
        paddingVertical: 10,
        marginVertical: 20,
    },
    container5: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    image1: {
        width: '90%',
        height: '60%',
        resizeMode: 'contain',
        position: 'absolute',
        top: "40%",
        left: "1%",
    },
    image2: {
        width: "60%",
        height: "50%",
        resizeMode: 'contain',
        position: 'absolute',
        top: "50%",
        right: "18%",
    },
    image3: {
        width: "4%",
        height: "6%",
        resizeMode: 'contain',
        position: 'absolute',
        bottom: "18%",
        right: "48%",
    },
    image4: {
        width: '105%',
        height: '140%',
        borderRadius: 10,
    },
    loginText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: "10%",
        color: "#333",
    },
    text: {
        fontSize: 14,
        paddingVertical: "4%",
        color: Colour.primary,
    },
    textInput: {
        color: "#333",
        width: '100%',
        height: "30%",
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        width: '100%',
        backgroundColor: Colour.primary,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: "1%",
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
