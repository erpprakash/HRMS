import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    TouchableOpacity,
    Alert
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DateRangePicker() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [markedDates, setMarkedDates] = useState({});

    const handleDayPress = (day) => {
        const date = day.dateString;

        if (!startDate) {
           
            setStartDate(date);
            setMarkedDates({
                [date]: { selected: true, startingDay: true, color: 'tomato' }
            });
        } else if (!endDate && date > startDate) {
           
            setEndDate(date);
            setMarkedDates({
                ...markedDates,
                [date]: { selected: true, endingDay: true, color: 'tomato' }
            });
        } else {
            // Reset selection
            setStartDate(date);
            setEndDate(null);
            setMarkedDates({
                [date]: { selected: true, startingDay: true, color: 'tomato' }
            });
        }
    };

    const handleSubmit = () => {
        if (startDate && endDate) {
            Alert.alert('Selected Range', `From ${startDate} to ${endDate}`);
        } else {
            Alert.alert('Error', 'Please select a valid date range.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Icon name="calendar-outline" style={styles.headerIcon} />
                <Text style={styles.headerText}>Select Date Range</Text>
            </View>
            <CalendarList
                // Specify the current date
                current={new Date().toISOString().split('T')[0]}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                markingType={'period'}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
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
    button: {
        backgroundColor: 'tomato',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
