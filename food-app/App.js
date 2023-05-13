import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import Dashboard from './components/Dashboard';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH
  const getData = async () => {
    try {
      const response = await fetch('https://api.ucsb.edu/dining/menu/v1/2022-12-06', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
        }
      });
      const json = await response.json();
      // console.log(json);
      // console.log(json[0]["name"]);
      setData(json);
      console.log("\n", data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={{flex: 1, padding: 24}}>
        {
          data.map((dat, index) => {
            return (
              <View>
                <Text>sth</Text>
                </View>
            )
          })
        }
    </View>
  );
};

export default App;
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
