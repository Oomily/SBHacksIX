import {StyleSheet, Text, SafeAreaView} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen'
import Dashboard from './Dashboard';

const Tab = createBottomTabNavigator();
const Tabs = () => {
  return(
    <Tab.Navigator>
      <Tab.Screen name = "Home Screen" component={HomeScreen} />
      <Tab.Screen name = "Dashboard" component={Dashboard} />
    </Tab.Navigator>
  );
}

export default Tabs;