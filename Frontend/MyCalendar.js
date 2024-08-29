import React, { useState, useEffect } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    TouchableOpacity, Alert, TextInput
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/Ionicons';
import customFetch from './utils/CustomFetch';
import Colour from '../Constants/Colour';

export default function MyCalendar() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [inPunch, setInPunch] = useState('');
    const [outPunch, setOutPunch] = useState('');
    const [report, setReport] = useState('');
    const [balanceLateMinutes, setBalanceLateMinutes] = useState(0);

    useEffect(() => {
    
    }, []);

    const handleDayPress = async (day) => {
        setSelectedDate(day.dateString);

        try {
            const response = await customFetch.get(`/punch-details?date=${day.dateString}`);
            const { inPunchTime, outPunchTime } = response.data;

            setInPunch(inPunchTime || ''); // Set real in punch time
            setOutPunch(outPunchTime || ''); // Set real out punch time

            // Calculate balance late minutes
            const lateMinutes = calculateLateMinutes(inPunchTime, outPunchTime);
            setBalanceLateMinutes(lateMinutes);
        } catch (error) {
            console.error('Failed to fetch punch details:', error);
            Alert.alert('Error', 'Unable to fetch punch details.');
        }
    };

    const calculateLateMinutes = (inPunchTime, outPunchTime) => {
        // Assuming the expected in punch time is '09:00'
        const expectedInPunch = '09:00';
        const [expectedHour, expectedMinute] = expectedInPunch.split(':').map(Number);
        const [inPunchHour, inPunchMinute] = (inPunchTime || '00:00').split(':').map(Number);

        const lateMinutes = Math.max(
            0,
            (inPunchHour - expectedHour) * 60 + (inPunchMinute - expectedMinute)
        );

        return lateMinutes;
    };

    const handleReportSubmit = () => {
        if (!selectedDate || !inPunch || !outPunch || !report) {
            Alert.alert('Error', 'Please complete all fields.');
            return;
        }

        // Submit the report
        Alert.alert('Success', 'Report submitted successfully.');
        // You can also add functionality to send the report data to a server here
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Icon name="calendar-outline" style={styles.headerIcon} />
                <Text style={styles.headerText}>My Calendar</Text>
            </View>
            <View style={styles.contentContainer}>
                <CalendarList
                    current={dayjs().format('YYYY-MM-DD')}
                    onDayPress={handleDayPress}
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: Colour.primary }
                    }}
                    markingType={'single'}
                    style={styles.calendar}
                />
                <View style={styles.detailsContainer}>
                    <Text style={styles.label}>In Punch:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={inPunch}
                        onChangeText={setInPunch}
                        placeholder="Enter In Punch Time"
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Out Punch:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={outPunch}
                        onChangeText={setOutPunch}
                        placeholder="Enter Out Punch Time"
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Balance Late Minutes:</Text>
                    <Text style={styles.valueText}>{balanceLateMinutes} minutes</Text>
                    <Text style={styles.label}>Report:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={report}
                        onChangeText={setReport}
                        placeholder="Enter Report"
                        multiline
                    />
                    <TouchableOpacity onPress={handleReportSubmit} style={styles.button}>
                        <Text style={styles.buttonText}>Submit Report</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        zIndex: 1, // Ensure header is on top
    },
    headerIcon: {
        fontSize: 35,
        color:Colour.primary,
        marginRight: 10,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colour.primary,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    calendar: {
        marginBottom: 20,
    },
    detailsContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
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
        marginBottom: 15,
    },
    valueText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 15,
    },
    button: {
        backgroundColor: Colour.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
