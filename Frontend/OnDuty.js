import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    TextInput, TouchableOpacity, KeyboardAvoidingView,
    Platform, Alert, Image, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import customFetch from './utils/CustomFetch';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function OnDuty() {
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [reason, setReason] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [onDutyType, setOnDutyType] = useState('');
    const [location, setLocation] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleStartTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || startTime;
        setShowStartTimePicker(Platform.OS === 'ios');
        setStartTime(currentTime);
    };

    const handleEndTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || endTime;
        setShowEndTimePicker(Platform.OS === 'ios');
        setEndTime(currentTime);
    };

    const handleOnDutySubmit = async () => {
        try {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const formattedStartTime = dayjs(startTime).format('HH:mm');
            const formattedEndTime = dayjs(endTime).format('HH:mm');
            const response = await customFetch.post('/on-duty', {
                date: formattedDate,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                reason,
                onDutyType,
                location,
                imageUri
            });
            Alert.alert('Success', 'On-duty request submitted successfully.');
            navigation.goBack();
        } catch (error) {
            console.error('On-duty request failed:', error);
            Alert.alert('Failed', error?.response?.data?.error || 'An error occurred. Please try again.');
        }
    };

    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
            Alert.alert('Permission required', 'Camera and gallery permissions are required.');
        }
    };

    const handleImageSelection = async () => {
        await requestPermissions();
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false, // Ensure cropping is disabled
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.uri);
            setModalVisible(false);
        }
    };

    const handleImageCapture = async () => {
        await requestPermissions();
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false, // Ensure cropping is disabled
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.uri);
            setModalVisible(false);
        }
    };

    const handleImageChoice = () => {
        setModalVisible(true);
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
                        <Picker.Item label="Business Trip" value="Business Trip" />
                        {/* Add other types as needed */}
                    </Picker>

                    <Text style={styles.label}>Date:</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                        <Text style={styles.dateText}>{dayjs(date).format('YYYY-MM-DD')}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <View style={styles.pickerWrapper}>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        </View>
                    )}
                    <Text style={styles.label}>Start Time:</Text>
                    <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.dateInput}>
                        <Text style={styles.dateText}>{dayjs(startTime).format('HH:mm')}</Text>
                    </TouchableOpacity>
                    {showStartTimePicker && (
                        <View style={styles.pickerWrapper}>
                            <DateTimePicker
                                value={startTime}
                                mode="time"
                                display="default"
                                onChange={handleStartTimeChange}
                            />
                        </View>
                    )}
                    <Text style={styles.label}>End Time:</Text>
                    <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.dateInput}>
                        <Text style={styles.dateText}>{dayjs(endTime).format('HH:mm')}</Text>
                    </TouchableOpacity>
                    {showEndTimePicker && (
                        <View style={styles.pickerWrapper}>
                            <DateTimePicker
                                value={endTime}
                                mode="time"
                                display="default"
                                onChange={handleEndTimeChange}
                            />
                        </View>
                    )}
                    <TextInput
                        onChangeText={setReason}
                        style={styles.textInput}
                        value={reason}
                        placeholder="Enter reason for on-duty"
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity onPress={handleImageChoice} style={styles.button}>
                        <Text style={styles.buttonText}>Upload Image</Text>
                    </TouchableOpacity>

                    {imageUri && (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: imageUri }} style={styles.image} />
                            <Text style={styles.imageName}>{imageUri.split('/').pop()}</Text>
                        </View>
                    )}

                </View>
                <TouchableOpacity onPress={handleOnDutySubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)} // Ensure modal can be closed with hardware back button
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={handleImageCapture} style={styles.modalButton}>
                                <Icon name="camera" style={styles.modalIcon} />
                                <Text style={styles.modalButtonText}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleImageSelection} style={styles.modalButton}>
                                <Icon name="image" style={styles.modalIcon} />
                                <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                                <Icon name="close" style={styles.modalIcon} />
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formContainer: {
        flex: 1,
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    backIcon: {
        fontSize: 24,
        color: 'tomato',
    },
    headerIcon: {
        fontSize: 24,
        color: 'tomato',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'tomato',
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
       
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
    },
    dateInput: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    dateText: {
        fontSize: 16,
    },
    pickerWrapper: {
        marginTop: -15,
        marginBottom: 15,
    },
    textInput: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: 'tomato',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    imageName: {
        marginTop: 5,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: '100%',
    },
    modalIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    modalButtonText: {
        fontSize: 16,
    },
});
