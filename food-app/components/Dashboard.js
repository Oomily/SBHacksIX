import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Text, View, CheckBox, TextInput, SafeAreaView} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
// KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH
const allergies = [];
//filtering Allergies
const filterAllergies = (nameOfItem) => {
    for(let i = 0; i < allergies.length; i++){
        if(nameOfItem.toLowerCase().includes(allergies[i])) return true;
    }
    return false;
};

export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [menu, setMenu] = useState([]);
    const [selected, setSelected] = React.useState("");

    info = []
    for (let i = 0; i < data.length; i++){
      info.push({key:i, value:(data[i])["name"]})
    }

    const getData = async () => {
        try {
        const response = await fetch('https://api.ucsb.edu/dining/menu/v1/2023-05-18/', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
            }
        });
        const json = await response.json();
        setData(json);
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
      //console.log(dining);
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
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
      if(data.length == 0) {getData();}}, []);
  
    //   Gets new menu when it updates
    useEffect(() => {
      if(selected.length > 0){
        getMenu(selected);
        console.log("\n\nuseEffect for getting Menu\n\n");
    }
    else{ return;}},[]);
    
      const items = menu.map((food) => {
        if(selected.length > 0 && filterAllergies(food["name"].toLowerCase()) == false){
          return (
            <View>
              <Text>{food["station"]}: {food["name"]}</Text>
            </View>
          )
        }
      });

      function Allergies(){
        const appendAllergies = (text) => {
            if(text.length > 0 && allergies.includes(text)==false){
                allergies.push(text.toLowerCase());
                if(selected.length > 0) getMenu(selected);
                console.log("Allergies: " + allergies);
            }
        }
        return (
            <View>
                <TextInput
                onSubmitEditing={(value) => appendAllergies(value.nativeEvent.text)}
                placeholder="type filter"
                autoCapitalize='none'
                />
            </View>
        )
    };
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
        <Allergies/>
        {items}
      </View>
    );
}



