import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'

export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [menu, setMenu] = useState([]);
    const [selected, setSelected] = React.useState("");
    info = []
    for (let i = 0; i < data.length; i++){
      info.push({key:i, value:(data[i])["name"]})
    }
    // KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH
    const getData = async () => {
      try {
        const response = await fetch('https://api.ucsb.edu/dining/menu/v1/2023-05-12/', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
          }
        });
        const json = await response.json();
        setData(json);
        // console.log("\n", data)
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
    };
  
    const getMenu = async (selected) => {
      let dining = "";
      for(let i = 0; i < selected.length; i++){
        if(selected[i] == " "){
          dining += "-";
        }
        else{ dining += selected[i].toLowerCase();}
      }
      console.log(dining);
      let url = "https://api.ucsb.edu/dining/menu/v1/2023-05-18/"+dining+"/lunch";
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
          }
        });
        const json = await response.json();
        setMenu(json);
        console.log(menu);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
      getData();}, []);
  
    useEffect(() => {
      if(selected.length > 0){getMenu(selected);}},[]);
    
      const items = menu.map((food) => {
        if(selected.length > 0){
          return (
            <View>
              <Text>{food["station"]}: {food["name"]}</Text>
            </View>
          )
        }
      });
    return(
      <View style={{paddingTop: 40}}>
        <StatusBar barStyle="light_content"/>
  
        <SelectList
            onSelect={() => getMenu(selected)}
            setSelected={(val) => {
              setSelected(val);
            }} 
            data={info}
            boxStyles={{borderRadius:0}} //override default styles
            save="value"
        />
        {items}
      </View>
    );
}

