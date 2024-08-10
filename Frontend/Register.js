
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, KeyboardAvoidingView,ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
export default function Register() {

    const navigation = useNavigation();
    const handleRegister = () => {

        navigation.navigate('Login');
    }
 
    return <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 4 }} style={styles.container}>
 
        <View style={styles.View1}>
            <Text style={styles.V1text2}>HR</Text>
            <Text style={styles.V1text1}>Shift</Text>
            <Image style={styles.v1img1} source={require('./Images/Logo1.png')} />
        </View>
        <View style={styles.View3}>
            <Image style={styles.v1img2} source={require('./Images/Signin.png')} />
        </View>
        <View style={styles.View2}>
            <Text style={styles.V2text1}>Welcome! </Text>
            <Text style={styles.V2Teaxt2}>Streamline your shifts with ease. Manage schedules effortlessly and stay connected with real-time updates. ShiftHR is your go-to tool for efficient workforce management. Let's optimize your workflow together!</Text>
            <TouchableOpacity onPress={handleRegister} style={styles.v2button1}>
                <Text style={styles.v2buttontext1}>Sign in</Text>
            </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
           </KeyboardAvoidingView>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
   
        backgroundColor: '#F7E7CF'
    },
    View1: {
        flex: 1,
        
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection: "row-reverse",
    },
    View2: {
        flex: 2,
        backgroundColor: '#F2994A',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    View3: {
        
        flex: 2,
    },
    V1text1:
    {

        color: "gray",
        fontSize: 36,
        fontWeight: "bold",

        paddingVertical: 30

    },
    V1text2:
    {

        color: "skyblue",
        fontSize: 36,
        fontWeight: "bold",

        paddingVertical: 30

    },
    V2text1:
    {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold",
        paddingHorizontal: 30,
        paddingVertical: 30,


    }
    ,
    V2Teaxt2:
    {
        paddingHorizontal: 30,
        fontSize: 18,
        color: '#fff',
        lineHeight: 22

    }
    ,
    Sarea: {
        height: "10%",
        width: "10%",
        borderRadius: 10,
        backgroundColor: "white",

    },
    v1img1: {
        height: "20%",
        width: "15%",
        resizeMode: 'contain',
        paddingVertical: 50
    },
    v1img2: {
        height: "100%",
        width: "100%",
        resizeMode: 'contain',
    },
    v2button1:
    {
        width: "80%",
        height: '15%',
        backgroundColor: "white",
        color: "red",
        marginHorizontal: 30,
        marginVertical: 40,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    v2buttontext1:
    {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        fontVariant: 'Montserrat'
    }
});
