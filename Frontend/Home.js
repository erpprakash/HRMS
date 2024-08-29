import React, { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, Modal, ScrollView, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import LottieView from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";
import customFetch from "./utils/CustomFetch";
import { DataContext } from "../ContextAPI/DataContext";
import { StatusBar } from "expo-status-bar";
import Logo from './Images/Logo1.png';
import Colour from '../Constants/Colour'
import * as Location from 'expo-location';
import axios from 'axios';
export default function Home({ Token }) {
    const { userDetail, handleLogout } = useContext(DataContext);
    const currentYear = new Date().getFullYear();
    const [selectedIcon, setSelectedIcon] = useState("home-outline");
    const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm"));
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [weatherCondition, setWeatherCondition] = useState('clear');
    const [animationSource, setAnimationSource] = useState(require('./Images/Morning.json'));
    const [city, setCity] = useState('New York');
    const getGreeting = () => {
        if (currentTime < "12:00") {
            return "Good Morning!";
        } else if (currentTime < "16:00") {
            return "Good Afternoon!";
        } else if (currentTime < "18:00") {
            return "Good Evening!";
        } else {
            return "Wishing you a peaceful night!";
        }
    };



    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(dayjs().format("HH:mm"));
        }, 60000);

        return () => clearInterval(intervalId);

    }, []);
    const handlePress = (iconName) => {
        handleIconPress(iconName);
        navigation.navigate('MyCalendar');
    };
    const handleIconPress = (iconName) => {
        setSelectedIcon(iconName);
    };

    const navigation = useNavigation();

    const handleSubmit = async () => {
        const userData = {
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await customFetch.get('/getUserRegistration', userData);
            const token = response.data.token;
            navigation.navigate('Home');
        } catch (error) {
            console.error('Login failed:', error);
            Alert.alert('Login Failed', error?.response?.data?.error || 'An error occurred. Please try again.');
        }
    };
    const fetchWeatherByLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = coords;


        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        const city = reverseGeocode[0]?.city || 'Default City';
        fetchWeather(city);
        console.log(city)
    };
    useEffect(() => {
        const fetchWeatherData = async () => {
            await fetchWeatherByLocation();
        };

        fetchWeatherData();
    }, []);

    const fetchWeather = async (city) => {
        try {
            const apiKey = '873fb894feda482743f544fbe67b93ff';
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            const weather = response.data.weather[0].description.toLowerCase();
            setWeatherCondition(weather);
            setAnimationSource(getAnimationSource(weather));

        } catch (error) {
            console.error('Weather fetch failed:', error);

        }
    };
    const getAnimationSource = (weather) => {
        console.log(weather)
        switch (weather) {
            case 'thunderstorm':
                return require('./Images/Night.json');
            case 'clouds':
                return require('./Images/Morning.json');
            case 'rain':
                return require('./Images/Night.json');
            case 'snow':
                return require('./Images/Afternoon.json');
            default:
                return require('./Images/Morning.json');
        }
    };




    return (
        <KeyboardAvoidingView style={styles.container}>
            <SafeAreaView style={styles.container}>
                {/* <StatusBar barStyle="light-content" backgroundColor="tomato" /> */}
                <View style={styles.container}>

                    <View style={styles.Container1}>
                        <LottieView
                            source={getAnimationSource(weatherCondition)}
                            autoPlay
                            loop
                            style={{ width: "70%", height: "70%" }}
                        />

                        <Text style={styles.Welcome}>{getGreeting()}</Text>
                        <Text style={styles.Welcome}>{userDetail?.name || 'User'}</Text>
                    </View>
                    <View style={styles.Container2}>
                        <View style={styles.QuickMenuContainer}>
                            <View style={styles.QuickMenuHeadingContainer}>
                                <Text style={styles.MenuHeading}>QuickMenu</Text>
                            </View>
                            <View style={styles.MenuItemsContainer}>
                                <View style={styles.MenuColumn}>
                                    <TouchableOpacity onPress={() => (navigation.navigate('MissPunch'))}>
                                        <View style={styles.MenuItem}>
                                            <Icon name="alarm-outline" style={styles.MenuIcon} />
                                            <Text style={styles.MenuText}>Miss Punch</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (navigation.navigate('Permission'))}>
                                        <View style={styles.MenuItem}>
                                            <Icon name="document-text-outline" style={styles.MenuIcon} />
                                            <Text style={styles.MenuText}>Permission</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (navigation.navigate('Leave'))}>
                                        <View style={styles.MenuItem}>
                                            <Icon name="calendar-outline" style={styles.MenuIcon} />
                                            <Text style={styles.MenuText}>Leave</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (navigation.navigate('OnDuty'))}>
                                        <View style={styles.MenuItem}>
                                            <Icon name="walk-outline" style={styles.MenuIcon} />
                                            <Text style={styles.MenuText}>On Duty</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.MenuColumn}>
                                    <TouchableOpacity onPress={() => (navigation.navigate('Block'))}>
                                        <View style={styles.MenuItem}>
                                            <Icon name="alert-circle-outline" style={styles.MenuIcon} />
                                            <Text style={styles.MenuText}>Block</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (navigation.navigate('Attendance'))}>
                                        <View style={styles.MenuItem}>
                                            <Icon name="checkmark-done-outline" style={styles.MenuIcon} />
                                            <Text style={styles.MenuText}>Attendance</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (navigation.navigate('EmployeeDirectory'))}>
                                        <View style={styles.MenuItem}>
                                            <Icon name="people-outline" style={styles.MenuIcon} />
                                            <Text style={styles.MenuText}>Employee</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (navigation.navigate('TagMe'))}>
                                        <View style={styles.MenuItem}>
                                            <Icon name="pricetag-outline" style={styles.MenuIcon} />
                                            <Text style={styles.MenuText}>Tag Me</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.BottomContainer}>
                        <TouchableOpacity onPress={() => handleIconPress("home-outline")} >
                            <Icon
                                style={[styles.IconStyle, selectedIcon === "home-outline" && styles.selectedIcon]}
                                name="home-outline"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress("calendar-outline")}>
                            <Icon
                                style={[styles.IconStyle, selectedIcon === "calendar-outline" && styles.selectedIcon]}
                                name="calendar-outline"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleIconPress("create-outline")}>
                            <Icon
                                style={[styles.IconStyle, selectedIcon === "create-outline" && styles.selectedIcon]}
                                name="create-outline"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                            <Icon
                                style={[styles.IconStyle, selectedIcon === "apps-outline" && styles.selectedIcon]}
                                name="apps-outline"
                            />
                        </TouchableOpacity>

                    </View>
                </View>


                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalContainer}>

                        <View style={styles.profileSection}>
                            <Image
                                source={userDetail?.profilePicture ? { uri: userDetail.profilePicture } : require('./Images/Man.jpg')}
                                style={styles.profileImage}
                            />
                            <Text style={styles.profileName}>{userDetail?.name || 'User'}</Text>
                            <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
                                <Text style={styles.profileButtonText}>Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('Attendance')}>
                                <Icon name="checkmark-done-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Attendance</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('Payslip')}>
                                <Icon name="cash-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Payslip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('EmployeeDirectory')}>
                                <Icon name="people-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Employee Directory</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('CompanyPolicies')}>
                                <Icon name="document-text-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Company Policies</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('Loans')}>
                                <Icon name="cash-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Loans</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('ExpenseClaims')}>
                                <Icon name="receipt-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Expense Claims</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('HRAnnouncements')}>
                                <Icon name="megaphone-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Announcements</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('Letters')}>
                                <Icon name="mail-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Letters</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('Insurance')}>
                                <Icon name="shield-checkmark-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Insurance</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('PersonalIDDocuments')}>
                                <Icon name="card-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Personal ID Documents</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('ESICandPF')}>
                                <Icon name="briefcase-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>ESIC and PF Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('InsurancePolicies')}>
                                <Icon name="shield-checkmark-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Insurance Policies</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('SmartCalendar')}>
                                <Icon name="calendar-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Smart Calendar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('DigitalIDCard')}>
                                <Icon name="id-card-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Digital ID Card</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('HelpSupport')}>
                                <Icon name="help-circle-outline" style={styles.modalIcon} />
                                <Text style={styles.modalText}>Help & Support</Text>
                            </TouchableOpacity>


                        </ScrollView>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                        <View style={styles.poweredByContainer}>
                            <Image source={Logo} style={styles.logo} />
                            <Text style={styles.poweredByText}>Powered by OrbitHR @ {currentYear}</Text>
                        </View>
                    </View>
                </Modal>


            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colour.primary,
    },
    Container1: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    Container2: {
        flex: 2,
        flexDirection: "row",
        backgroundColor: "#fff",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginHorizontal: 2,
        paddingVertical: 10,
    },
    BottomContainer: {
        flex: 0.3,
        borderTopWidth: 0.5,
        borderTopColor: Colour.primary,
        backgroundColor: "#EEE7E8",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    Welcome: {
        fontSize: 25,
        fontWeight: "bold",
        color: "white",
    },
    QuickMenuContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    QuickMenuHeadingContainer: {
        width: "25%",
        height: "60%",
        backgroundColor: "#f9f9f9",
        borderLeftWidth: 10,
        borderLeftColor: '#ccc',
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
        borderRadius: 8
    },
    MenuHeading: {
        fontSize: 20,
        paddingHorizontal: 10,
        fontWeight: "bold",
        color: Colour.primary,
        transform: [{ rotate: '-90deg' }],
        textAlign: "center",
    },
    MenuItemsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    MenuColumn: {
        justifyContent: "center",
        alignItems: "center",
    },
    MenuItem: {
        alignItems: "center",
        marginVertical: 10,
    },
    MenuIcon: {
        fontSize: 30,
        color: Colour.primary,
    },
    MenuText: {
        fontSize: 16,
        marginTop: 5,
        textAlign: "center",
    },
    IconStyle: {
        color: "#555",
        fontSize: 30,
        marginHorizontal: 35,
        paddingVertical: 21,
    },
    selectedIcon: {
        color: Colour.primary,
        transform: [{ scale: 1.2 }],
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 20,
        marginTop: 'auto',
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: Colour.primary,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colour.primary,
        marginBottom: 10,
    },
    profileButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colour.primary,
        borderRadius: 5,
    },
    profileButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalIcon: {
        fontSize: 20,
        color: '#333',
        marginRight: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
    },
    modalCloseButton: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 18,
        color: Colour.primary,
        fontWeight: 'bold',
    },
    poweredByContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,

    },
    logo: {
        width: 20,
        height: 20,
        marginRight: 5,
        resizeMode: 'contain',
    },
    poweredByText: {
        fontSize: 14,
        color: '#555',

    },
});
