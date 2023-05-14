import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Text, Button, View, TextInput, ScrollView} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import MenuItem from './MenuItem';
let allergies = []; 
let preferences = [];
let currentDate = new Date().toJSON().slice(0, 10);

/******************* FILTER ALLERGIES FUNCTION ************************/
// This function checks whether the menu items contain the food intolerances
// a user enters
const filterAllergies = (nameOfItem) => {
    for(let i = 0; i < allergies.length; i++){
        if(nameOfItem.toLowerCase().includes(allergies[i])) return true;
    }
    return false;
};

/******************* FILTER PREFERENCES FUNCTION ************************/
// This function checks whether the menu items contain the preferences that
// the user enters
const filterPreferences = (nameOfItem) => {
  for(let i = 0; i < preferences.length; i++){
      if(nameOfItem.toLowerCase().includes(preferences[i])) return true;
  }
  return false;
};
/////////////////////////////////////////////////////////////////////////
export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]); //stores dining common names
    const [types, setTypes] = useState([]); //stores meal types
    const [menu, setMenu] = useState([]); //stores menu items
    const [selected, setSelected] = React.useState(""); //tracks Dining Common selection
    const [clear, callClear] = useState(false); //tracks Reset Button
    const [meal, setMeal] = useState(""); //sets Meal Type

    info = []
    for (let i = 0; i < data.length; i++){
      info.push({key:i, value:(data[i])["name"]})
    } // parsing the dining common names

    // API call to get all dining commons open on the current day
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
    /* FUNCTION THAT RETURNS MEAL BUTTONS ************************/
    const buttons = types.map((mel, index) => {
      if(selected.length > 0){
        return (
          <MealButton meal={mel["code"]} dining={selected}></MealButton>
        )
      }
    })
    // API call to get all meal types offered on current day (eg: Lunch, Dinner, etc.)
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
            const meal = await fetch('https://api.ucsb.edu/dining/menu/v1/'+currentDate+'/'+dining, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'ucsb-api-key': 'KNhVQXTOMKnoS2oyhAFGJZdqHOOJlWUH'
                }
            });
          json = await meal.json();
          setTypes(json);
        } 
        catch (error) {
        console.error(error);
      }
    }
    // API call to get all menu items based on user selected options b4hand
    const getMenu = async (selected, meal) => {
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
      if(selected.length > 0) {getMealType(selected);}
      if(selected.length > 0 && types.length > 0){ 
        getMenu(selected, meal); 
    }
    else{ return;}},[]);
  // FUNCTION THAT RETURNS MENU ITEMS //////////////////////////////////////////////////  
  const items = menu.map((food) => {
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
      backgroundColor:"aliceblue",
      marginVertical: 5,
      marginHorizontal: 5,
      width: 160,
      alignSelf:"center",
      borderRadius: 5,
      borderWidth: 2,
      borderColor: "white"}}>
        <Button
        title={meal}
        color="lightslategrey"
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
                //console.log("Allergies: " + allergies);
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
              //console.log("Preferences: " + preferences);
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
      color="lightslategrey"/>
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
            dropdownStyles={{
              marginHorizontal: 5,
              marginVertical: 10,
              borderWidth:2,
              borderColor:"white",
              backgroundColor: "aliceblue"
            }}
            boxStyles={{borderWidth:2,
                        borderColor: "white",
                        marginHorizontal: 5,
                        marginVertical: 5,
                        backgroundColor: "aliceblue"}} //override default styles
            save="value"
        />
        <View style={{display:"flex",
                      flexDirection:"row",
                      columnGap:50,
                      alignSelf:"center"}}>
            {selected.length > 0 ? buttons: <Text style={{alignSelf:"center", color:"gray"}}>Select a Dining Common!</Text>}
        </View>
        
        <View style={{flexDirection: 'row', 
          gap: 42, margin: 10, 
            backgroundColor:"ghostwhite", 
            alignSelf:"center",
            alignItems: "center", 
            borderWidth: 1, borderColor:"white", 
            borderRadius: 5, fontSize:15}}>
              <Text style={{paddingHorizontal:8, color: "lightslategrey", fontSize:17}}>filter</Text>
              <Allergies/>
              <Preferences/>
              <Reset/>
        </View>
        {meal.length > 0 ? <ScrollView>{items}</ScrollView> : <Text style={{alignSelf:"center", color:"gray"}}>Select a Meal Type</Text>}
      </View>
    );
}



