import React from 'react';
import { ImageBackground, StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';

import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Profile() {
    const { width } = Dimensions.get('window');
    const colors = ['#0086D1', '#000000', '#4CAF50', '#FF9800', '#87CEEB']; // blue, black, green, orange, skyblue

    const styles = StyleSheet.create({
        ContainerMain: {
            flex: 2,

        },
        MainContainer: {
            marginVertical: 0,
            paddingVertical: 20
        },
        Top: {


            width: width * 1.34,
            height: width * 1.34,
            borderRadius: width,
            backgroundColor: '#0086D1',
            position: 'absolute',
            top: -width,
            left: -width / 5,
            right: -width / 3,
            marginVertical: -10,


        },
        Top1: {

            width: width * 1.39,
            height: width * 1.39,
            borderRadius: width,
            backgroundColor: '#7FC2E8',

            position: 'absolute',
            top: -width,
            left: -width / 5.5,
            marginVertical: -10,

        },
        container: {

            flex: 0.7,
            marginVertical: 0


        },
        imageContainer: {
            position: "relative",
            flexShrink: 0,
            width: 393,
            height: 450,
            flex: 1,
            resizeMode: "cover",
            justifyContent: "center",
            marginVertical: 200
        },
        TextContainer: {

            justifyContent: "center",
            marginHorizontal: 20,




        },
        HeaderText: {
            color: "#074D75",
            fontSize: 25,
            fontStyle: "normal",
            fontWeight: "semibold",
            fontVariant: "Open Sans"
        }
        ,
        Iconheader:
        {
            color: "#074D75",
            fontSize: 30,
            marginHorizontal: 12
        },
        IconheaderArrow:
        {
            color: "#074D75",
            fontSize: 30,
            marginHorizontal: 80
        },
        HeaderView: {

            flexDirection: "row",
            paddingVertical: 15,
            marginVertical: 5,
            alignItems: "center",
            justifyContent: "space-between"
        }
        ,
        MenuText: {

            fontStyle: "normal",

            borderWidth: 1,

            borderColor: "#7FC2E8",
            borderTopLeftRadius: 25,
            borderBottomRightRadius: 25,
            marginVertical: 20,
            paddingHorizontal: 10
            ,
            paddingVertical: 5,
            flexDirection: "row",
            justifyContent: "flex-start"


        }
        ,
        MenuText1: {

            fontStyle: "normal",
            fontVariant: "Open Sans",
            borderWidth: 1,

            borderColor: "#7FC2E8",
            borderTopLeftRadius: 25,
            borderBottomRightRadius: 25,
            marginVertical: 20,
            paddingHorizontal: 10
            ,
            paddingVertical: 5,
            flexDirection: "row",



        }
        ,
        MenuTextArea: {
            justifyContent: "center",
            flex: 1

        },
        SizeText: {
            fontSize: 20,
            color: "#074D75",

        },
        Sizeicon: {

            color: "#074D75",
            fontSize: 25,
            marginHorizontal: 20

        }
        ,
        SizeiconRight: {

            color: "#074D75",
            fontSize: 25,



        },
        colorThemeContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            marginVertical: 5,
            flex: 0.3
        },
        colorRound: {
            width: 30,
            height: 30,
            borderRadius: 15,
            marginHorizontal: 5,
        },
        colorThemeLine: {
            height: 2,
            backgroundColor: '#074D75',
            flex: 0.5,
        },
    });
    return (

        <View style={styles.ContainerMain}>
            <View style={styles.MainContainer}>
                <View style={styles.Top1}>

                </View>
                <View style={styles.Top}>

                </View>
            </View>

            <View style={styles.container}>
                <ImageBackground
                    source={require('./Images/Settings.png')}
                    style={styles.imageContainer}
                >
                    <View style={styles.container}>
                        <View style={styles.TextContainer}>
                            <View style={styles.HeaderView}>
                                <Icon style={styles.Iconheader} name="settings-outline"></Icon>
                                <Text style={styles.HeaderText}>Profile & Settings</Text>
                                <Icon style={styles.IconheaderArrow} name="arrow-back-outline"></Icon>
                            </View>

                            <View style={styles.MenuText}>
                                <Icon style={styles.Sizeicon} name="git-compare-sharp"></Icon>
                                <View style={styles.MenuTextArea}>
                                    <Text style={styles.SizeText}>Terms of Service</Text>
                                </View>


                                <Icon style={styles.SizeiconRight} name="chevron-forward-outline"></Icon>
                            </View>
                            <View style={styles.MenuText1}>

                                <Icon style={styles.Sizeicon} name="help-circle-sharp" />
                                <View style={styles.MenuTextArea}>
                                    <Text style={styles.SizeText}>Support & Help</Text>
                                </View>
                                <Icon style={styles.SizeiconRight} name="chevron-forward-sharp"></Icon>
                            </View>

                            <View style={styles.MenuText1}>
                                <Icon style={styles.Sizeicon} name="alert-circle-sharp"></Icon>
                                <View style={styles.MenuTextArea}>
                                    <Text style={styles.SizeText}>Privacy Policy</Text>
                                </View>
                                <Icon style={styles.SizeiconRight} name="chevron-forward-sharp"></Icon>
                            </View>
                            <View style={styles.MenuText1}>
                                <Icon style={styles.Sizeicon} name="notifications-sharp"></Icon>
                                <View style={styles.MenuTextArea}><Text style={styles.SizeText}>Notification</Text></View>
                                <Icon style={styles.SizeiconRight} name="chevron-forward-sharp"></Icon>
                            </View>
                            <View style={styles.MenuText1}>
                                <Icon style={styles.Sizeicon} name="document-lock-sharp"></Icon>
                                <View style={styles.MenuTextArea}><Text style={styles.SizeText}>Password Change</Text></View>
                                <Icon style={styles.SizeiconRight} name="chevron-forward-sharp"></Icon>
                            </View>

                            <View style={styles.MenuText1}>
                                <Icon style={styles.Sizeicon} name="bug-sharp"></Icon>
                                <View style={styles.MenuTextArea}><Text style={styles.SizeText}>Bug Report</Text></View>
                                <Icon style={styles.SizeiconRight} name="chevron-forward-sharp"></Icon>
                            </View>
                            <View style={styles.MenuText1}>
                                <Icon style={styles.Sizeicon} name="color-filter-sharp"></Icon>
                                <View style={styles.MenuTextArea}><Text style={styles.SizeText}>Theme</Text></View>

                                <Icon style={styles.SizeiconRight} name="chevron-down-sharp"></Icon>
                            </View>


                        </View>
                    </View>

                </ImageBackground>



            </View>
            <View style={styles.colorThemeContainer}>
                <View style={styles.colorThemeLine}></View>
                {colors.map((color, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity>
                            <View style={[styles.colorRound, { backgroundColor: color }]} />
                        </TouchableOpacity>
                        {index !== colors.length - 1 && <View style={styles.colorThemeLine}></View>}
                    </View>
                ))}
                <View style={styles.colorThemeLine}></View>
            </View>
            <View style={styles.group9021Container}>
<View style={styles.rectangle133}/>
<View style={styles.rectangle112}/>
<View style={styles.rectangle134}/>
<View style={styles.rectangle121}/>
<View style={styles.rectangle122}/>
<View style={styles.rectangle123}/>
</View> 
        </View >

    );
}


