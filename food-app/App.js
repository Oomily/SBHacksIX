import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
 import Dashboard from './components/Dashboard';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'


const App = () => {
  return(
    <View>
      <Dashboard/>
    </View>
  )
};
export default App;
