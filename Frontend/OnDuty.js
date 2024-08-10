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

export default function OnDuty() {
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [reason, setReason] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
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
                reason
            });
            Alert.alert('Success', 'On-duty request submitted successfully.');
            navigation.goBack();
        } catch (error) {
            console.error('On-duty request failed:', error);
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
                    <Icon name="time-outline" style={styles.headerIcon} />
                    <Text style={styles.headerText}>On Duty</Text>
                </View>
                <View style={styles.inputContainer}>
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
                </View>
                <TouchableOpacity onPress={handleOnDutySubmit} style={styles.button}>
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
        color: "tomato",
    },
    headerIcon: {
        fontSize: 35,
        color: "tomato",
        marginRight: 10,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: "tomato",
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
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
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    pickerWrapper: {
        borderColor: 'tomato',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 15,
    },
});