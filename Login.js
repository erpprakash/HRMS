import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView, KeyboardAvoidingView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import customFetch from "./utils/CustomFetch";

export default function Loginold() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        });
    };

    const navigation = useNavigation();

    const handleSubmit = async () => {
        const userData = {
            email: formData.email,
            password: formData.password,
        };

        try {
            console.log(userData);
            const response = await customFetch.post('/login', userData);
            console.log('result:', response);
            const token = response.data.token;  // Adjust this based on your response structure
            navigation.navigate('Signin');
        } catch (error) {
            console.error('Login failed:', error);
            // Show an alert or toast message to the user
            Alert.alert('Login Failed', error?.response?.data?.error || 'An error occurred. Please try again.');
        }
    };

    return (


        <SafeAreaView  style={styles.container} behavior="padding">
            {/* <Image style={styles.image} source={require('./Images/img1.png')} /> */}
                            <View style={styles.Maincontainer}>
            <Image style={styles.logo} source={require('./Images/Logo2.png')} />
                <Text style={styles.heading}>Welcome To</Text>
                <Text style={styles.subHeading}>AKR INDUSTRIES PVT LTD</Text>
                <TextInput
                    onChangeText={(text) => handleChange('email', text)}
                    value={formData.email}
                    style={styles.input}
                    placeholder="Enter User"
                />
                <TextInput
                    onChangeText={(text) => handleChange('password', text)}
                    value={formData.password}
                    style={styles.input}
                    placeholder="Enter Password"
                    secureTextEntry={true}
                />
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Proceed To Login</Text>
                </TouchableOpacity>
                {/* {/* <Text style={styles.forgotPassword}>Forget Password?</Text> */}
            </View>

            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#004D40',
        paddingHorizontal: 50,
        // height:"100%",
        // width:"100%"


    },
    Maincontainer: {
        backgroundColor: "#E6F7FF",
        width: "100%",

        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 0

    },
    Welcomecontainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width:"50%",
        backgroundColor: "red",
        paddingVertical: 10,
        

    },
    image: {
        width: "100%",
        height: "10%",
        resizeMode: 'contain',
        // marginVertical: 15,
    },
    circle:
    {
        width: "50%",
        height: "10%",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 20,
        overflow: "hidden"
    },
    logo: {
        width: "100%",
        height: "40%",
        resizeMode: 'contain',
        borderWidth: 2,
        borderColor: "#E6F7FF",
        borderRadius: 20,
        overflow: "hidden"

    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
        marginVertical: 5
    },
    subHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#004D40',
        marginVertical: 5
    },
    input: {
        width: "80%",
        borderWidth: 1,
        borderColor: '#004D40',
        backgroundColor: 'white',
        marginVertical: 10,
        paddingVertical: 10,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#004D40',
        paddingVertical: 10,
        // paddingHorizontal: 20,
        borderRadius: 8,
        width: "80%",
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    // forgotPassword: {
    //     marginVertical: 10,
    //     color: 'black',
    // },
});
