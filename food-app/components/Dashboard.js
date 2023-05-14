import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Text, Button, View, CheckBox, TextInput, SafeAreaView} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import MenuItem from './MenuItem';
// KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH
let allergies = []; 
let preferences = [];
let currentDate = new Date().toJSON().slice(0, 10);
////////////////////////////////////////////////////////////////filtering
const filterAllergies = (nameOfItem) => {
    for(let i = 0; i < allergies.length; i++){
        if(nameOfItem.toLowerCase().includes(allergies[i])) return true;
    }
    return false;
};

const filterPreferences = (nameOfItem) => {
  for(let i = 0; i < preferences.length; i++){
      if(nameOfItem.toLowerCase().includes(preferences[i])) return true;
  }
  return false;
};
/////////////////////////////////////////////////////////////////////////
export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [types, setTypes] = useState([]);
    const [menu, setMenu] = useState([]);
    const [selected, setSelected] = React.useState("");
    const [clear, callClear] = useState(false);
    const [meal, setMeal] = useState(""); //default is empty

    info = []
    for (let i = 0; i < data.length; i++){
      info.push({key:i, value:(data[i])["name"]})
    }

    const getData = async () => {
            try {
            const response = await fetch('https://api.ucsb.edu/dining/menu/v1/'+currentDate+'/', {
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
    // FUNCTION THAT RETURNS MEAL ITEMS //////////////////////////////////////////////////
    const buttons = types.map((mel, index) => {
      if(selected.length > 0){
        return (
          <MealButton meal={mel["code"]} dining={selected}></MealButton>
        )
      }
    })
    
const getMealType = async (selected) => {
        let dining = "";
        let json = [];
        for(let i = 0; i < selected.length; i++){
            if(selected[i] == " "){
                dining += "-";
            }
            else{ dining += selected[i].toLowerCase();}
        }
try {
        console.log("DINING:", dining);
        const meal = await fetch('https://api.ucsb.edu/dining/menu/v1/'+currentDate+'/'+dining, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
            }
        });
      json = await meal.json();
    } 
    catch (error) {
    console.error(error);
  }
  setTypes(json);
  console.log(types);
}

const getMenu = async (selected, selectedMeal) => {
          let dining = "";
          for(let i = 0; i < selected.length; i++){
            if(selected[i] == " "){
              dining += "-";
            }
            else{ dining += selected[i].toLowerCase();}
          }
          let url = "https://api.ucsb.edu/dining/menu/v1/"+currentDate+"/"+dining+"/"+meal;
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
            setMeal(selectedMeal);
            setMenu(json);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
    };
    // Gets names of all dining commons
    useEffect(() => {
      if(data.length == 0) {getData();}}, []);
  
    //   Gets new menu when it updates
    useEffect(() => {
      if(selected.length > 0 && types.length > 0){ //&& types.length > 0
        getMenu(selected, meal); //getMenu(selected, meal);
        console.log("\n\nGetting initial menu\n\n");
    }
    else{ return;}},[]);
  // FUNCTION THAT RETURNS MENU ITEMS //////////////////////////////////////////////////
  // MAKE SURE TO ADD IN EXTRA CONDITIONAL TO HAVE A MEAL TYPE  
  const items = menu.map((food, index) => {
      if(selected.length > 0 && meal.length > 0 && (filterAllergies(food["name"].toLowerCase()) == false) 
      && (preferences.length == 0 || filterPreferences(food["name"].toLowerCase()) == true)){
        return (
          <MenuItem category={food["station"]} name={food["name"]}/>
        )
      }
    });
///////////////////////////////////////////////////////////////////////////////
function MealButton(props){
  let meal = props.meal;
  let dining = props.dining;

  return (
    <View style={{
      backgroundColor:"lightskyblue",
      marginVertical: 5,
      marginHorizontal: 10,
      width: 150,
      alignSelf:"center",
      borderRadius: 10}}>
        <Button
        title={meal}
        onPress={() => {
            setMeal(meal);
           getMenu(dining, meal);
          }}/>
    </View>
  )
};      
function Allergies(){
        const appendAllergies = (text) => {
            if(text.length > 0 && allergies.includes(text)==false){
                allergies.push(text.toLowerCase());
                if(selected.length > 0) getMenu(selected, meal); //getMenu(selected, meal);
                console.log("Allergies: " + allergies);
            }
        }
        return (
            <View>
                <TextInput
                onSubmitEditing={(value) => appendAllergies(value.nativeEvent.text)}
                placeholder="restrictions"
                autoCapitalize='none'
                />
            </View>
        )
    };
    function Preferences(){
      const appendPreferences = (text) => {
          if(text.length > 0 && preferences.includes(text)==false){
              preferences.push(text.toLowerCase());
              if(selected.length > 0) getMenu(selected, meal); //getMenu(selected, meal);
              console.log("Preferences: " + preferences);
          }
      }
      return (
          <View>
              <TextInput
              onSubmitEditing={(value) => appendPreferences(value.nativeEvent.text)}
              placeholder="preference"
              autoCapitalize='none'
              />
          </View>
      )
  };
  function Reset(){
    // clears filters
    const clearFilter = () => {
      allergies = [];
      preferences = [];
      if(selected.length > 0) {getMenu(selected, meal);} 
    };
    return(
      <View>
        <Button
      onPress={() => {
        callClear();
        clearFilter();
      }}
      title="clear"
      color="black"/>
      </View>
    )
  };
/////////////////////////////////////////////////////////
    return(
      <View>
        <StatusBar barStyle="light_content"/>
  
        <SelectList
            onSelect={() => getMealType(selected)}
            setSelected={(val) => {
              setSelected(val);
            }} 
            data={info}
            boxStyles={{borderWidth:0,
                        marginHorizontal: 5,
                        marginVertical: 5,
                        backgroundColor: "lightblue"}} //override default styles
            save="value"
        />
        <View style={{display:"flex",
                      flexDirection:"row",
                      columnGap:50,
                      alignSelf:"center"}}>
            {buttons}
        </View>
        
        <View style={{flexDirection: 'row', gap: 40, margin: 10, 
            backgroundColor:"white", alignSelf:"center",
            alignItems: "center", borderRadius: 5, fontSize:15}}>
              <Text style={{paddingHorizontal:8, fontSize:17}}>filter</Text>
              <Allergies/>
              <Preferences/>
              <Reset/>
        </View>
        {items}
      </View>
    );
}



