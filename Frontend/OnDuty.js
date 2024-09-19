import React, { useEffect, useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text, TextInput,
    TouchableOpacity, Alert, Image, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import customFetch from './utils/CustomFetch';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colour from '../Constants/Colour'


import firebase from '@react-native-firebase/app';

export default function OnDuty() {
    const [date, setDate] = useState(new Date());
    const [reason, setReason] = useState('');
    const [onDutyType, setOnDutyType] = useState('');
    const [location, setLocation] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [City, setCity] = useState('');
    const [checkedIn, setCheckedIn] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigation = useNavigation();
    

    useEffect(() => {
        retrieveStoredData();
    }, []);

    useEffect(() => {
        let interval;
        if (checkedIn) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [checkedIn]);

    useEffect(() => {
        if (timer >= 86400) { // 24 hours in seconds
            handleAutoCheckOut();
        }
    }, [timer]);

    const retrieveStoredData = async () => {
        try {
            const storedCheckInTime = await AsyncStorage.getItem('checkInTime');
            const storedCheckedIn = await AsyncStorage.getItem('checkedIn');
            if (storedCheckedIn === 'true' && storedCheckInTime) {
                const elapsedSeconds = Math.floor((Date.now() - parseInt(storedCheckInTime, 10)) / 1000);
                setTimer(elapsedSeconds);
                setCheckedIn(true);
                setIsModalVisible(true);
            }
        } catch (error) {
            console.error('Failed to retrieve data:', error);
        }
    };

    const storeCheckInData = async () => {
        try {
            await AsyncStorage.setItem('checkInTime', Date.now().toString());
            await AsyncStorage.setItem('checkedIn', 'true');
        } catch (error) {
            console.error('Failed to store data:', error);
        }
    };

    const clearStoredData = async () => {
        try {
            await AsyncStorage.removeItem('checkInTime');
            await AsyncStorage.removeItem('checkedIn');
        } catch (error) {
            console.error('Failed to clear data:', error);
        }
    };
    const handleSelectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.uri);
            processImage(result.uri);
        }
    };

    const processImage = async (uri) => {
        try {
            const image = await fetch(uri);
            const imageData = await image.blob();

            const faces = await ml().faceDetectorProcessImage(imageData);
            Alert.alert(`Detected ${faces.length} faces`);
        } catch (error) {
            console.error('Face detection error:', error);
        }
    };


    const handleOnDutySubmit = async () => {
        try {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            // const response = await customFetch.post('/on-duty', {
            //     date: formattedDate,
            //     reason,
            //     onDutyType,
            //     location,
            //     imageUri
            // });
            Alert.alert('Success', 'On-duty request submitted successfully.');
            setCheckedIn(true);
            storeCheckInData();
            setIsModalVisible(true);
        } catch (error) {
            console.error('On-duty request failed:', error);
            Alert.alert('Failed', error?.response?.data?.error || 'An error occurred. Please try again.');
        }
    };

    const handleAutoCheckOut = async () => {
        try {
            await customFetch.post('/check-out', { /* check-out data */ });
            console.log('Checked out automatically');
            setCheckedIn(false);
            setIsModalVisible(false);
            resetState();
            clearStoredData();
        } catch (error) {
            console.error('Automatic check-out failed:', error);
        }
    };

    const handleCheckOut = async () => {
        try {
            await customFetch.post('/check-out', { /* check-out data */ });
            Alert.alert('Success', 'Checked out successfully.');
            setCheckedIn(false);
            setIsModalVisible(false);
            resetState();
            clearStoredData();
        } catch (error) {
            console.error('Check-out failed:', error);
            Alert.alert('Failed', 'Check-out failed. Please try again.');
        }
    };

    const handleSelfieCapture = async () => {
        const permissionsGranted = await requestPermissions();
        if (!permissionsGranted) return;
    
        try {
            const locationResult = await Location.getCurrentPositionAsync({});
            const { coords } = locationResult;
            const { latitude, longitude } = coords;
    
            const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            const city = reverseGeocode[0]?.formattedAddress || 'Default City';
            setCity(city);
            setLocation(locationResult);
    
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
                cameraType: ImagePicker.CameraType.front,
            });
    
            if (!result.canceled && result.assets && result.assets[0]) {
                setImageUri(result.assets[0].uri);
                await detectFace(result.assets[0].uri); // Call face detection here
            }
        } catch (error) {
            console.error('Selfie capture error:', error);
            Alert.alert('Error', 'An error occurred while capturing your selfie.');
        }
    };
    
    // Inside your handleSelfieCapture function
    const detectFace = async (uri) => {
        try {
            const faces = await mlVision().faceDetectorProcessImage(uri);
            if (faces.length > 0) {
                Alert.alert('Face Detected', 'Your face is properly oriented.');
            } else {
                Alert.alert('No Face Detected', 'Please ensure your face is visible and properly oriented.');
            }
        } catch (error) {
            console.error('Face detection error:', error);
            Alert.alert('Error', 'An error occurred while detecting face.');
        }
    };
    
    const requestPermissions = async () => {
        try {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    
            if (cameraStatus !== 'granted' || locationStatus !== 'granted') {
                Alert.alert('Permission required', 'Camera and location permissions are required.');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Permissions request error:', error);
            return false;
        }
    };
    

    const resetState = () => {
        setTimer(0);
        setReason('');
        setOnDutyType('');
        setLocation(null);
        setImageUri(null);
    };

    const formatTimer = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" style={styles.backIcon} />
                    </TouchableOpacity>
                    <Icon name="time-outline" style={styles.headerIcon} />
                    <Text style={styles.headerText}>On Duty</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>On Duty Type:</Text>
                    <Picker
                        selectedValue={onDutyType}
                        style={styles.picker}
                        onValueChange={(itemValue) => setOnDutyType(itemValue)}
                    >
                        <Picker.Item label="Select Type" value="" />
                        <Picker.Item label="WFH" value="WFH" />
                        <Picker.Item label="Unit Visit" value="Unit Visit" />
                        <Picker.Item label="Market Place" value="Market Place" />
                        <Picker.Item label="Supplier Factory Visit" value="Supplier Factory Visit" />
                        <Picker.Item label="Business Trip" value="Business Trip" />
                    </Picker>

                    <TextInput
                        onChangeText={setReason}
                        style={styles.textInput}
                        value={reason}
                        placeholder="Enter reason for on-duty"
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity onPress={handleSelfieCapture} style={styles.button}>
                        <Text style={styles.buttonText}>Take Selfie</Text>
                    </TouchableOpacity>

                    {imageUri && (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: imageUri }} style={styles.image} />
                            <Text style={styles.imageName}>
                                Location: {location ? `${City}` : 'Fetching location...'}

                                {/* Location: {location ? `${City}, ${location.coords.latitude}, ${location.coords.longitude}` : 'Fetching location...'} */}
                            </Text>
                            <TouchableOpacity onPress={() => setImageUri(null)} style={styles.clearButton}>
                                <Text style={styles.clearButtonText}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {!checkedIn ? (
                    <TouchableOpacity onPress={handleOnDutySubmit} style={styles.button}>
                        <Text style={styles.buttonText}>Check IN</Text>
                    </TouchableOpacity>
                ) : (
                    <Modal
                        visible={isModalVisible}
                        transparent={true}
                        onRequestClose={() => { }}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.timerText}>Time Elapsed: {formatTimer(timer)}</Text>
                            <TouchableOpacity onPress={handleCheckOut} style={styles.button}>
                                <Text style={styles.buttonText}>Check OUT</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',

    },
    formContainer: {
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 20,
    },
    backButton: {
        marginRight: 15,
    },
    backIcon: {
        fontSize: 24,
        color: Colour.primary,
    },
    headerIcon: {
        fontSize: 28,
        color: Colour.primary,
        marginRight: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colour.primary,
    },
    inputContainer: {
        marginBottom: 20,

    },
    label: {
        fontSize: 18,
        color: Colour.primary,
        fontWeight: 'bold',
    },
    picker: {
        backgroundColor: '#e9ebed',

        borderWidth: 1,
        borderRadius: 5,
        height: 50,
        marginBottom: 20,
    },
    textInput: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: '#333',
    },
    button: {
        backgroundColor: Colour.primary,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    image: {
        width: 140,
        height: 200,
        borderRadius: 50,

    },
    imageName: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    clearButton: {
        marginTop: 10,
        backgroundColor: Colour.primary,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    timerText: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
    },
});
