import { StyleSheet, Text, TextInput, View, Button, ScrollView, FlatList, Dimensions, StatusBar } from 'react-native';
import LoginScreen from './Frontend/loginnew';
import Signin from './Frontend/ForgetPassowrd';
import Permission from './Frontend/Permission';
import Home from './Frontend/Home';
import MissPunch from './Frontend/MissPunch';
import LeaveApply from './Frontend/LeaveApply';
import MyCalendar from './Frontend/MyCalendar';
import OnDuty from './Frontend/OnDuty';
import Settings from './Frontend/Profile';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import Colour from './Constants/Colour';
import { useState } from 'react';
import { AppProvider } from './ContextAPI/AppContext';
import { DataProvider } from './ContextAPI/DataContext';




export default function App() {
  const Stack = createNativeStackNavigator();
  
  const [primaryColor, setPrimaryColor] = useState(null);

  // setPrimaryColor(Theme)
 
 

  return (
    <View style={{ flex: 1 }}>
      {/* <StatusBar
        barStyle="dark-content"
        backgroundColor={Colour.primaryColor}
        translucent={false}
      /> */}
      <NavigationContainer>
        <AppProvider>
          <DataProvider>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Signin"
                component={Signin}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MissPunch"
                component={MissPunch}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Permission"
                component={Permission}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Leave"
                component={LeaveApply}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="OnDuty"
                component={OnDuty}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MyCalendar"
                component={MyCalendar}
                options={{ headerShown: false }}
              />
               <Stack.Screen
                name="Settings"
                component={Settings}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </DataProvider>
        </AppProvider>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textbox: {
    paddingBottom: 20,
  },
});
