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

export default function LeaveApply() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [leaveType, setLeaveType] = useState('Sick Leave');
    const [halfDayOption, setHalfDayOption] = useState(null); // New state for half-day option
    const [reason, setReason] = useState('');
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const navigation = useNavigation();

    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(Platform.OS === 'ios');
        setStartDate(currentDate);
    };

    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(Platform.OS === 'ios');
        setEndDate(currentDate);
    };

    const handleLeaveApply = async () => {
        if (endDate < startDate) {
            Alert.alert('Validation Error', 'End date must be later than start date.');
            return;
        }

        try {
            const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
            const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
            const response = await customFetch.post('/leave-apply', {
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                leaveType,
                halfDayOption, // Include half-day option
                reason
            });
            Alert.alert('Success', 'Leave applied successfully.');
            navigation.goBack();
        } catch (error) {
            console.error('Leave application failed:', error);
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
                    <Text style={styles.headerText}>Apply for Leave</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Start Date:</Text>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateInput}>
                        <Text style={styles.dateText}>{dayjs(startDate).format('YYYY-MM-DD')}</Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                        <View style={styles.pickerWrapper}>
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                minimumDate={new Date()}
                                onChange={handleStartDateChange}
                            />
                        </View>
                    )}
                    <Text style={styles.label}>End Date:</Text>
                    <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateInput}>
                        <Text style={styles.dateText}>{dayjs(endDate).format('YYYY-MM-DD')}</Text>
                    </TouchableOpacity>
                    {showEndDatePicker && (
                        <View style={styles.pickerWrapper}>
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                minimumDate={startDate}
                                onChange={handleEndDateChange}
                            />
                        </View>
                    )}
                    <Text style={styles.label}>Leave Type:</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={leaveType}
                            onValueChange={(itemValue) => setLeaveType(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Sick Leave" value="Sick Leave" />
                            <Picker.Item label="Casual Leave" value="Casual Leave" />
                            <Picker.Item label="Earned Leave" value="Earned Leave" />
                            <Picker.Item label="Half Day" value="Half Day" />
                        </Picker>
                    </View>
                    {leaveType === 'Half Day' && (
                        <>
                            <Text style={styles.label}>Half Day Option:</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={halfDayOption}
                                    onValueChange={(itemValue) => setHalfDayOption(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="First Half" value="First Half" />
                                    <Picker.Item label="Second Half" value="Second Half" />
                                </Picker>
                            </View>
                        </>
                    )}
                    <TextInput
                        onChangeText={setReason}
                        style={styles.textInput}
                        value={reason}
                        placeholder="Enter reason for leave"
                        placeholderTextColor="#999"
                    />
                </View>
                <TouchableOpacity onPress={handleLeaveApply} style={styles.button}>
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
        backgroundColor:Colour.primary,
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
        borderColor:Colour.primary,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 15,
    },
    picker: {
        height: 55,
        width: '100%',
    },
});
