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
import dayjs from 'dayjs';
import customFetch from './utils/CustomFetch';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Colour from '../Constants/Colour';

export default function MissPunch() {
    const [date, setDate] = useState(new Date());
    const [punchTime, setPunchTime] = useState(new Date());
    const [reason, setReason] = useState('');
    const [punchType, setPunchType] = useState('in'); // Default to 'in' punch
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const navigation = useNavigation();

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || punchTime;
        setShowTimePicker(Platform.OS === 'ios');
        setPunchTime(currentTime);
    };

    const handleMissPunchRequest = async () => {
        try {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const formattedPunchTime = dayjs(punchTime).format('HH:mm');
            const response = await customFetch.post('/miss-punch-request', {
                date: formattedDate,
                punchTime: formattedPunchTime,
                punchType, // Include the punch type
                reason
            });
            Alert.alert('Success', 'Miss Punch request submitted successfully.');
            navigation.goBack();
        } catch (error) {
            console.error('Miss Punch request failed:', error);
            Alert.alert('Failed', error?.response?.data?.error || 'An error occurred. Please try again.');
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
                    <Icon name="calendar-outline" style={styles.headerIcon} />
                    <Text style={styles.headerText}>Miss Punch Request</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                        <Text style={styles.dateText}>{dayjs(date).format('YYYY-MM-DD')}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <View style={styles.pickerWrapper}>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                minimumDate={new Date()}
                                onChange={handleDateChange}
                            />
                        </View>
                    )}
                    <Text style={styles.label}>Punch Time:</Text>
                    <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateInput}>
                        <Text style={styles.dateText}>{dayjs(punchTime).format('HH:mm')}</Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <View style={styles.pickerWrapper}>
                            <DateTimePicker
                                value={punchTime}
                                mode="time"
                                display="default"
                                onChange={handleTimeChange}
                            />
                        </View>
                    )}
                    <Text style={styles.label}>Punch Type:</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={punchType}
                            onValueChange={(itemValue) => setPunchType(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="In Punch" value="in" />
                            <Picker.Item label="Out Punch" value="out" />
                        </Picker>
                    </View>
                    <TextInput
                        onChangeText={setReason}
                        style={styles.textInput}
                        value={reason}
                        placeholder="Enter reason for miss punch request"
                        placeholderTextColor="#999"
                    />
                </View>
                <TouchableOpacity onPress={handleMissPunchRequest} style={styles.button}>
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
        marginRight: 10,
    },
    backIcon: {
        fontSize: 24,
        color: Colour.primary,
    },
    headerIcon: {
        fontSize: 35,
        color: Colour.primary,
        marginRight: 10,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colour.primary,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    dateInput: {
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
        justifyContent: 'center',
        marginBottom: 15,
    },
    dateText: {
        color: "#333",
        fontSize: 18,
    },
    pickerWrapper: {
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 15,
    },
    picker: {
        height: 55,
        color: "#333",
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
        backgroundColor: Colour.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
});
